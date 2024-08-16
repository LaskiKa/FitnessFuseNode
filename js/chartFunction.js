import  Chart, { LineElement, scales }  from 'chart.js/auto';
import { baseModal } from './views';
import 'chartjs-adapter-date-fns';
import { durationToMilliseconds, filterFunction, lastSevenDays, methodFunction, responseFunction } from './tools';
import { chartFilterModalTemplate } from './htmlTemplates';

export function chartModalFunction() {
    // Create chart html modal
    const chartModal = baseModal(true);
    chartModal.firstChild.classList.add('chartmodal');

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('id', 'canvas'); // ID canvasa - tutaj zmiana

    // Add filter modal
    const filterModal = document.createElement('div');
    filterModal.classList.add('filtermodal');
    filterModal.innerHTML = chartFilterModalTemplate;
    // Set filter dates for last 7 days: today & today-7
    lastSevenDays(filterModal);

    chartModal.firstChild.appendChild(canvas);
    chartModal.firstChild.appendChild(filterModal)

    return chartModal
};

export async function createChartwithApiData(path, chartType, chartLabel,
                                            xScale, 
                                            [property1, dataMethodNumber], 
                                            [property2, labelsMethodNumber]) {

    const response = await responseFunction(path);

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
            
            const result = filterFunction(sortedResponseData);

            // #2 Filter modal by dates selected by user - Event Listener
            document.querySelector('#submit').addEventListener('click', () => {
                const result = filterFunction(sortedResponseData);
            
                // Update chart based on filtered dates
                window.dataChart.data.labels = methodFunction(labelsMethodNumber, property2)(result);
                window.dataChart.data.datasets[0].data = methodFunction(dataMethodNumber, property1)(result);
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
                        }
                    },
                    data: {
                        labels: methodFunction(labelsMethodNumber, property2)(result),
                        datasets: [
                            {
                                label: chartLabel,
                                data: methodFunction(dataMethodNumber ,property1)(result),
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
};