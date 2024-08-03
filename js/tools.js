export const mapProperty = (property) => {
    return (data) => data.map(row => row[property]);
};

export const miliSecondsToHours = (property) => {
    return (data) => data.map(row => row[property] / (1000*60*60))
};

export const measurementDate = (property) => {
    return (data) => data.map(row => row.measurement_date.setHours(0,0,0,0))
}

export const methodFunction = (methodNumber, property) => {
    switch (methodNumber) {
        case 1:
            return mapProperty(property);
        case 2:
            return miliSecondsToHours(property);
        case 3:
            return measurementDate(property);
        default:
            throw new Error('Invalid method number');
    }
};

export function durationToMilliseconds(duration) {
    // Convert duration to miliseconds 
    // Split the duration into hours, minutes, and seconds
    const parts = duration.split(':');

    // Parse the parts as integers
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    // Convert hours, minutes, and seconds to milliseconds
    const hoursToMilliseconds = hours * 60 * 60 * 1000;
    const minutesToMilliseconds = minutes * 60 * 1000;
    const secondsToMilliseconds = seconds * 1000;

    // Sum all the milliseconds
    return hoursToMilliseconds + minutesToMilliseconds + secondsToMilliseconds;
};

export async function responseFunction(url) {
    const token = sessionStorage.getItem('token')
    const response = await fetch(`http://127.0.0.1:8000/${url}/`, {
        mode: 'cors',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
    return response
};

export async function updateFunction(url, id, body) {
    const token = sessionStorage.getItem('token');
    body['user'] = token;
    const response = await fetch(`http://127.0.0.1:8000/${url}/${id}/`, {
        mode: 'cors',
        credentials: 'same-origin',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(body)
    })
    return response
};

export async function createFunction(url, body) {
    const token = sessionStorage.getItem('token');
    body['user'] = token;
    const response = await fetch(`http://127.0.0.1:8000/${url}/`, {
        mode: 'cors',
        credentials: 'same-origin',
        method: 'POST',
        headers: {                    
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`                
            },
        body: JSON.stringify(body)
    })
    return response
};

export async function deleteFunction(url, id) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/${url}/${id}/`, {
        mode: 'cors',
        credentials: "same-origin",
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
    return response
};

export async function authenticationFunction(url, body) {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/${url}/`, {
        mode: 'cors',
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(body)   
    })
    return response
};