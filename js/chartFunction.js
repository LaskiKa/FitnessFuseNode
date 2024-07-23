import  Chart, { LineElement, scales }  from 'chart.js/auto';
import { baseModal } from './views';
import 'chartjs-adapter-date-fns';
import { mapProperty, miliSecondsToHours, durationToMilliseconds, meseaurmentDate, methodFunction } from './tools';



// ROZBUDOWAĆ 
    //                 type: 'line',
    //                 options: {
    //                     responsive: true,
    //                     scales: {
    //                         y: {
    //                             beginAtZero: true,
    //                         }
    //                     },
    //                 },


export function chartModalFunction() {

    // Create chart html modal
    const chartModal = baseModal(true);
    chartModal.firstChild.classList.add('chartmodal');

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('id', 'canvas'); // ID canvasa - tutaj zmiana

    const filterModal = document.createElement('div');
    filterModal.classList.add('filtermodal');
    filterModal.innerHTML = `
    <div class='filtercontent'>Start: <input id='start' type="date"> </div>
    <div class='filtercontent' >End: <input id='end' type="date"> </div>
    <button class='filtercontent' id='submit' >Filter</button>
    
    `
    chartModal.firstChild.appendChild(canvas);
    chartModal.firstChild.appendChild(filterModal)

    return chartModal
}

export async function createChartwithApiData(path, chartType, chartLabel,
                                            xScale, 
                                            [property1, dataMethodNumber], 
                                            [property2, labelsMethodNumber]) {

    const token = sessionStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/${path}/`, {
        mode: 'cors',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });


    //Response verification
        if(response.ok) {
            const responseData = await response.json();
            const sortedResponseData = responseData.sort((a,b)=> new Date(a.measurement_date) - new Date(b.measurement_date));

            // Convert text to Data
            sortedResponseData.forEach(element => {
                element.measurement_date = new Date(element.measurement_date)
            });
            
            // Convert duration data to miliseconds format & from meseurement_data exclude time (left only data)
            if (property1 === 'training_time' || property2 === 'training_time') {
                sortedResponseData.forEach(element => {
                    element.training_time = durationToMilliseconds(element.training_time)
    
                    const datatime = new Date (element.measurement_date);
                    const data = datatime.toISOString().split('T')[0]
                    element.measurement_date = new Date (data);
                });
            };
            

            // Filter modal by dates - Event Listener
            document.querySelector('#submit').addEventListener('click', () => {
                const start = new Date(document.querySelector('#start').value).setHours(0,0,0,0);
                const end = new Date(document.querySelector('#end').value).setHours(0,0,0,0);
                
                const result = sortedResponseData.filter(element => {var date = new Date(element.measurement_date).setHours(0,0,0,0);
                    return (start <= date && date <= end);
                });
            
                // Fill chart with filtered data
                // window.dataChart.data.labels = result.map(row => row.measurement_date.setHours(0,0,0,0));
                window.dataChart.data.labels = methodFunction(labelsMethodNumber, property2)(result)
                // window.dataChart.data.datasets[0].data = method[dataMethodNumber](result)
                window.dataChart.data.datasets[0].data = methodFunction(dataMethodNumber ,property1)(result)
                window.dataChart.update();
       
            });

            // IF CHART EXIST - DELETE
            if (window.dataChart != null) {
                window.dataChart.destroy()
            };

            // CREATE CHART - create global variable with chart
            window.dataChart = new Chart(
                document.querySelector('#canvas'),
                {
                    type: chartType,
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                            x: xScale
                            // {
                            //     type: 'time',
                            //     time: {
                            //         unit: 'day'
                            //     }
                            // }
                        }
                    },
                    data: {
                        // labels: sortedResponseData.map(row => row.measurement_date.setHours(0,0,0,0)),
                        // labels: method[labelsMethodNumber](property2)(sortedResponseData),
                        labels: methodFunction(labelsMethodNumber, property2)(sortedResponseData),
                        // labels: sortedResponseData.map(row => row.measurement_date),
                        datasets: [
                            {
                                label: chartLabel,
                                // data: mapProperty(property)(sortedResponseData),
                                // data: method[dataMethodNumber](property1)(sortedResponseData),
                                data: methodFunction(dataMethodNumber ,property1)(sortedResponseData),
                                backgroundColor: '#4d3ef9',
                                borderColor: '#4d3ef9'
                            }
                        ]
                    }
                }
            );

        } else {
            const error = await response.json();
            console.log('Error: ', error);
        };
        console.log(window.dataChart);
    
}