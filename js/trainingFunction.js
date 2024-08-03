import { today, baseModal } from './views';
import { createChartwithApiData, chartModalFunction } from './chartFunction';
import { createFunction, deleteFunction, responseFunction, updateFunction } from './tools';
import { trainingCreateFormTemplate, trainingDeleteFormTemplate, trainingUpdateFormTemplate } from './htmlTemplates';


export function trainingFunction(row) {

    const getTrainingList = async () => {
        // SELECT - append new option with list of trainings

        const response = await responseFunction('traininglist');
        
        // Response verification
        if (response.ok) {
            const trainingList = await response.json();

            // append training list in form
            const select = document.querySelector('#traininglist');
            trainingList.forEach( (element) => {
                const option = document.createElement('option');
                option.textContent = element.training_name;
                option.value = element.key;
                select.appendChild(option);
            })
        }
        };

    const apiTrainingData = async () => {
        // Function which fill form with sport avalible to choose
        const response = await responseFunction('training');

        // Response verification
        if (response.ok) {
            const trainingData = await response.json()
            const sortedTrainingData = trainingData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
            
            // Append select with meseaurment data
            sortedTrainingData.forEach(element => {
                const option = document.createElement('option');
                const dateTime = new Date (element.measurement_date)
                const date = dateTime.toISOString().split('T')[0];
                const time = dateTime.toISOString().split('T')[1].split('.')[0]

                option.textContent = `${date} ${time} - training: ${element.training} - duration: ${element.training_time}`;
                option.value = element.id;
                document.querySelector('select').appendChild(option);
            });


        } else {
            // Error
            const error = await response.json();
            console.log('Error: ', error);
        }
    };

    const now = today();
    const modalArray = [];

    // Trainging manage console: Update, Create, Delete
    const trainingModal = baseModal(row);
    trainingModal.firstChild.classList.add('trainingmodal');

    // TRAINING MANAGE: update, create, delete
    const manageModal = document.createElement('div');
    manageModal.classList.add('managemodal');

    // TRAINING MANAGE: UPDATE
    const update = document.createElement('div');
    update.classList.add('manage', 'update');
    update.textContent='update';

    update.addEventListener('click', () => {

        const manageContent = document.createElement('div');
        manageContent.classList.add('managecontent', 'update');

        const formModal = document.createElement('div');
        formModal.classList.add('formmodal');

        const createForm = document.createElement('form');
        createForm.classList.add('form', 'update');
        createForm.innerHTML = trainingUpdateFormTemplate;

        // Event listener - after selecting data to update fill other fields in form
        createForm.querySelector('select').addEventListener('click', () => {
            const selected = createForm.querySelector('select')
            var selectedOption = selected.options[selected.selectedIndex];

            const trainingInput = createForm.querySelector('#traininglist');
            const dateInput = createForm.querySelector('#measurement_date');
            const tiemInput = createForm.querySelector('#measurement_time');
            const durationHoursInput = createForm.querySelector('#durationhours');
            const durationMinutesInput = createForm.querySelector('#durationminutes');
            const durationSecondsInput = createForm.querySelector('#durationseconds');

            const measurementData = selectedOption.textContent.split(" ");
            const measurementDataTraining = measurementData[4];
            const measurementDataDate = measurementData[0];
            const measurementDataTime = measurementData[1];
            const measurementDuration = measurementData[measurementData.length - 1].split(":")

            trainingInput.value = measurementDataTraining
            dateInput.value = measurementDataDate;
            tiemInput.value = measurementDataTime;
            durationHoursInput.value = measurementDuration[0];
            durationMinutesInput.value = measurementDuration[1];
            durationSecondsInput.value = measurementDuration[2];
        });


        // Fill form with Sport avalible to choose
        apiTrainingData();

        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.trainingmodal').append(manageContent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            const meseaurmentId = parseInt(document.querySelector('select').value)
            const duration = `${formData.get('durationhours')}:${formData.get('durationminutes')}:${formData.get('durationseconds')}`;
            const measurementDateTime = `${formData.get('measurement_date')}T${formData.get('measurement_time')}Z`

            // PUT - update training
            const updateTrainingData = async() => {
                const body = {
                    'training': formData.get('training'),
                    'measurement_date': measurementDateTime,
                    'training_time': duration,
                };

                const response = await updateFunction('training', meseaurmentId, body);

                if (response.ok) {

                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Updated!';

                    infoModal.append(infoContent);
                    
                    document.querySelector('.managemodal').parentElement.append(infoModal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }

                    createChartwithApiData('training', 'line', 'Training hours', 
                                            {type: 'time',
                                                time: {unit: 'day'}
                                            },
                                            ['training_time', 2], ['', 3]);

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }
            updateTrainingData();

        });

        getTrainingList();

    });

    // TAINING MANAGE: CREATE
    const create = document.createElement('div');
    create.classList.add('manage','create');
    create.textContent='create';

    create.addEventListener('click', () => {
        const manageContent = document.createElement('div');
        manageContent.classList.add('managecontent', 'create');

        const formModal = document.createElement('div');
        formModal.classList.add('formmodal');

        const createForm = document.createElement('form');
        createForm.classList.add('form', 'create');
        createForm.innerHTML = trainingCreateFormTemplate;
        createForm.querySelector('#measurement_date').value = now[0];
        createForm.querySelector('#measurement_time').value = now[1];
        
        // Fill form with Sport avalible to choose
        getTrainingList();
        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);
        
        if (!document.querySelector('.managecontent.create')) {
            // If the .managecontent.create not exist -> show the managecontetn create modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.trainingmodal').append(manageContent);
        };

        // POST: add new training to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            const toDataTime = `${formData.get('measurement_date')}T${formData.get('measurement_time')}`
            const duration = `${formData.get('durationhours')}:${formData.get('durationminutes')}:${formData.get('durationseconds')}`;

            // POST - Add training api
            const apiAddTraining = async () => {
                const body = {
                    'training': formData.get('training'),
                    'measurement_date': toDataTime,
                    'training_time': duration
                }
                const response = await createFunction('training', body)
    
                if (response.ok) {
                    
                    const infomodal = document.createElement('div');
                    infomodal.classList.add('infomodal', 'success');

                    const infocontent = document.createElement('div');
                    infocontent.classList.add('infocontent');
                    infocontent.textContent = 'Success';
                    infomodal.append(infocontent);
                    
                    document.querySelector('.managemodal').parentElement.append(infomodal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }

                    createChartwithApiData('training', 'line', 'Training hours', 
                                            {type: 'time',
                                                time: {unit: 'day'}
                                            },
                                            ['training_time', 2], ['', 3]);
                                            
                    document.querySelector('.form').reset();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                    
                } else {
                    const error = response.json()
                    console.log('Error: ', error );
                }

            }
            apiAddTraining();

        })

    });

    // TRAINING MANAGE: DELETE
    const deleteData = document.createElement('div');
    deleteData.classList.add('manage', 'deletedata');
    deleteData.textContent='delete';

    deleteData.addEventListener('click', () => {

        const manageContent = document.createElement('div');
        manageContent.classList.add('managecontent', 'deletedata');

        const formModal = document.createElement('div');
        formModal.classList.add('formmodal');

        const createForm = document.createElement('form');
        createForm.classList.add('form', 'update');
        createForm.innerHTML = trainingDeleteFormTemplate;

        // SELECT - append new option with data
        const apiTrainingData = async () => {
            const response = await responseFunction('training')
    
            // Response verification
            if (response.ok) {
                const trainingData = await response.json()
                const sortedTrainingData = trainingData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data
                sortedTrainingData.forEach(element => {
                    const option = document.createElement('option');
                    const dateTime = new Date (element.measurement_date)
                    const date = dateTime.toISOString().split('T')[0];
                    const time = dateTime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - weight: ${element.training}`;
                    option.value = element.id;
                    createForm.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apiTrainingData()

        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.trainingmodal').append(manageContent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deleteData = async () => {
                // const token = sessionStorage.getItem('token');
                const id = document.querySelector('select').value

                const response = await deleteFunction('training', id);

                if (response.ok) {

                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Deleted!';

                    infoModal.append(infoContent);
                    
                    document.querySelector('.managemodal').parentElement.append(infoModal)
                    console.log(infoModal);

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }
                    
                    createChartwithApiData('training', 'line', 'Training hours', 
                                            {type: 'time',
                                                time: {unit: 'day'}
                                            },
                                            ['training_time', 2], ['', 3]);

                    // Remove removed option
                    const toremove = document.querySelector('select');
                    toremove.remove(toremove.selectedIndex);

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000); 
                };
            };
            deleteData();
        });
    }); 

    // Append {UPDATE CREATE DELETE}
    manageModal.appendChild(update);
    manageModal.appendChild(create);
    manageModal.appendChild(deleteData);
    trainingModal.firstChild.appendChild(manageModal);

    // CHART
    const chartModal = chartModalFunction();
    
    // Get training data after clicking weight navbtn
    document.querySelector('.navbtn.training').addEventListener('click', () => {
        createChartwithApiData('training', 'line', 'Training hours', 
                                {type: 'time',
                                    time: {unit: 'day'}
                                },
                                ['training_time', 2], ['', 3]);

    })

    modalArray.push(trainingModal, chartModal);

    return modalArray
};