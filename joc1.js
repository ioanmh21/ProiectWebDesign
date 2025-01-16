let secret = Math.floor(Math.random() * 1000);
let tries = 11;
let minInterval = 0;
let maxInterval = 1000;

document.querySelector('form').addEventListener('submit', (e) => {
    if (tries === 0) {
        e.preventDefault();
        return;
    }

    e.preventDefault();
    const guess = parseInt(document.querySelector('#guess').value);
    tries--;

    if (guess < minInterval || guess > maxInterval) {
        document.querySelector('#result').innerText = `Caută în interval.`;
        tries++;
    } else if (guess < secret) {
        minInterval = guess + 1;
        document.querySelector('#result').innerText = `Mai mare.`;
    } else if (guess > secret) {
        maxInterval = guess - 1;
        document.querySelector('#result').innerText = `Mai mic.`;
    } else {
        document.querySelector('#result').innerText = `Felicitări! Ai găsit numărul în ${11 - tries} încercări.`;
        document.querySelector('#result').classList.add('win-effect');
        document.querySelector('#win-sound').play();
        tries = 0;
    }

    document.querySelector('#interval').innerText = `Interval: ${minInterval} - ${maxInterval}`;
    document.querySelector('#tries-left').innerText = `Încercări rămase: ${tries}`;

    if (tries === 0) {
        document.querySelector('#result').innerText += ` Numărul era ${secret}.`;
        document.querySelector('#guess').disabled = true;
        document.querySelector('button[type="submit"]').disabled = true;
    }
});