// Melonking.net - Universal Day Colour v1.2
// Converts dates to RGBeat time aka 256-hour time aka cool time

// Get the colour for this moment! - accurate = true will account for milliseconds
function getRGBeatNow(accurate = false) {
    let colour = dateToDayColourObj(new Date(), accurate);
    return "rgb(" + colour.red + ", " + colour.green + ", " + colour.blue + ")";
}

// Get the colour for a particular Date object - accurate = true will account for milliseconds
function getRGBeatAt(date, accurate = false) {
    let colour = dateToDayColourObj(date, accurate);
    return "rgb(" + colour.red + ", " + colour.green + ", " + colour.blue + ")";
}

// Returns a raw RGBeat colour object - accurate = true will account for milliseconds
function dateToDayColourObj(date, accurate) {
    if (!accurate) date.setMilliseconds(400); // Setup a static ms so results are consistent relative to expected 24-hour time
    let milliseconds = date.getUTCMilliseconds();
    let seconds = date.getUTCSeconds();
    let minutes = date.getUTCMinutes();
    let hours = date.getUTCHours();

    const totalStandardMillisecondsInDay = 24 * 60 * 60 * 1000;
    const totalMilliseconds = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    const total256MillisecondsInDay = 256 * 256 * 256 * 1000;
    // Convert the total milliseconds to the 256-based scale
    const scaledMilliseconds = (totalMilliseconds / totalStandardMillisecondsInDay) * total256MillisecondsInDay;
    // Calculate 256-based hours, minutes, and seconds
    const newHours = Math.floor(scaledMilliseconds / (256 * 256 * 1000));
    const remainingMillisecondsAfterHours = scaledMilliseconds % (256 * 256 * 1000);
    const newMinutes = Math.floor(remainingMillisecondsAfterHours / (256 * 1000));
    const remainingMillisecondsAfterMinutes = remainingMillisecondsAfterHours % (256 * 1000);
    const newSeconds = Math.floor(remainingMillisecondsAfterMinutes / 1000);

    // Format the result as a string with leading zeros if necessary
    const formattedHours = String(newHours).padStart(3, "0");
    const formattedMinutes = String(newMinutes).padStart(3, "0");
    const formattedSeconds = String(newSeconds).padStart(3, "0");

    let returnObject = {};
    returnObject.red = formattedHours;
    returnObject.green = formattedMinutes;
    returnObject.blue = formattedSeconds;

    return returnObject;
}
function GetSwatchTime(showDecimals = true) {
    // get date in UTC/GMT
    var date = new Date();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    var milliseconds = date.getUTCMilliseconds();
    // add hour to get time in Switzerland
    hours = hours == 23 ? 0 : hours + 1;
    // time in seconds
    var timeInMilliseconds = ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
    // there are 86.4 seconds in a beat
    var millisecondsInABeat = 86400;
    // calculate beats to two decimal places
    if (showDecimals) {
        return Math.abs(timeInMilliseconds / millisecondsInABeat).toFixed(2);
    } else {
        return Math.floor(Math.abs(timeInMilliseconds / millisecondsInABeat));
    }
}

// while (True) {
//     r.style.setProperty('--time-color', getRGBeatNow(true));
// }
var r = document.querySelector(':root');
var mySwatchClock = document.createElement('div');
mySwatchClock.id = 'swatchClock';
function updateSwatchClock() {
    mySwatchClock.innerHTML = '@' + GetSwatchTime();
}

document.addEventListener('DOMContentLoaded', function () {
    r.style.setProperty('--time-color', getRGBeatNow(true));
    setInterval(function () {
        r.style.setProperty('--time-color', getRGBeatNow(true));
    }, 10);
});
document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(mySwatchClock);
    updateSwatchClock();
    setInterval(updateSwatchClock, 200);
});