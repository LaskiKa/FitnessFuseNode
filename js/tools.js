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


// ZAMIAST METHOD 
// ZROBIĆ FUNKCJE, KTÓRA PRZYJMUJE PROPERTY ORAZ NUMER I ZWRACA KONKRETNA FUNKCJĘ??


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
}