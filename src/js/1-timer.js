import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const dateTimePickEl = document.querySelector('#datetime-picker');
const startBtnEl = document.querySelector('[type="button"]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtnEl.disabled = true;
let userSelectedDate = null;
let timerID = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startBtnEl.disabled = true;
        } else {
            startBtnEl.disabled = false;
            userSelectedDate = selectedDate;
        }
    },
  };
  
flatpickr(dateTimePickEl, options);

startBtnEl.addEventListener('click', () => {
    startBtnEl.disabled = true;
    dateTimePickEl.disabled = true;

    timerID = setInterval(() => {
        const now = new Date();
        const timeDiff = userSelectedDate - now;

        if (timeDiff <= 0) {
            clearInterval(timerID);
            updateTimerUI(0);
            iziToast.success({
                title: 'Timer',
                message: 'Countdown finished!',
            });
            dateTimePickEl.disabled = false;
            return;
        }
        
        updateTimerUI(timeDiff);
    }, 1000)
});

function updateTimerUI(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);

    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
};

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }
  