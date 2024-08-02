import  Chart, { LineElement }  from 'chart.js/auto';
// import { textContent } from "./static/textcontent.json";
import 'chartjs-adapter-date-fns';

export function today() {
    const now = [];
    const date = new Date();
    now.push(date.toISOString().split('T')[0]);
    now.push(date.toLocaleTimeString());

    return now
}

export function removeRows() {
    if (document.querySelector('.modalrow')) {
        document.querySelectorAll('.modalrow').forEach( (row) => {
            row.remove();
        });      
    };
};

export function baseModal(row) {

    const modalbase = document.createElement('div');
    modalbase.classList.add('basemodal');
    
    
    if (row) {
        const modalrow = document.createElement('div');
        modalrow.classList.add('modalrow');
        modalrow.appendChild(modalbase);
        return modalrow
    };
    
    return modalbase
    
};

export function homeFunction(row) {
    const modalArray = [];

    const textContent = require('./static/textcontent.json');
    const homeModal = baseModal(row);
    homeModal.firstChild.classList.add('homemodal')

    const logoImage = document.createElement('img');
    logoImage.setAttribute('id', 'imglogomodal');
    logoImage.src = 'js/static/FitnessFuselogo_wide.png'

    const descriptionModal = baseModal(row)
    descriptionModal.firstChild.classList.add('descriptionmodal');
    
    const descriptionContent = document.createElement('div');


    descriptionContent.setAttribute('id', 'descricontent');

    descriptionContent.innerText = textContent.homepage.description;
    descriptionModal.firstChild.appendChild(descriptionContent);

    // remove rows

    homeModal.firstChild.appendChild(logoImage);
    modalArray.push(homeModal, descriptionModal)

    return modalArray
};

export function aboutFunction(row) {

    // Remove rows
    
    const aboutModal = baseModal(row);
    aboutModal.firstChild.classList.add('aboutmodal')
    aboutModal.firstChild.textContent = "ABOUT MODAL"


    return aboutModal
};

export function contactFunction(row) {
    
    // Remove rows
    const contactModal = baseModal(row);
    contactModal.firstChild.classList.add('contactmodal')
    contactModal.firstChild.textContent = "CONTACT MODAL"


    return contactModal
};

