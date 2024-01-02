const data = new Date();

const day = String(data.getDate()).padStart(2, '0');
const month = String(data.getMonth() + 1).padStart(2, '0');
const year = data.getFullYear();

const formattedDate = day + '.' + month + '.' + year;
document.querySelector('#date').innerText = formattedDate;

let hours = String(data.getHours()).padStart(2, '0');
const minutes = String(data.getMinutes()).padStart(2, '0');

let period = 'AM';

if(hours >= 12) {
    period = 'PM';
    
}

const formattedTime = hours + ':' + minutes + ' ' + period;
document.querySelector('#time').innerText = formattedTime;

const good = document.querySelector('#good');
let goodDay;

if(hours >= 5 && hours < 12) {
    goodDay = 'Good Morning';
} else if (hours >= 12 && hours < 18) {
    goodDay = 'Good Afternoon';
} else {
    goodDay = 'Good Night';
}

good.innerText = goodDay;
