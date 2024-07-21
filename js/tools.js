export const mapProperty = (property) => {
    return (data) => data.map(row => row[property]);
};

export const miliSecondsToHours = (property) => {
// const hours = Math.floor(miliseconds / (1000*60*60));
    return (data) => data.map(row => row[property] / (1000*60*60))
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
}