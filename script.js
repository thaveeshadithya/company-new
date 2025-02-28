const WORKING_HOURS = 8; // 8 Hours
const LUNCH_TIME = 1;    // 1 Hour Break
const DAYS_IN_MONTH = 31;
const DEFAULT_ARRIVAL = "09:00";
const DEFAULT_LEAVING = "17:00";

function createDayColumns() {
    const headerRow = document.querySelector('#attendanceTable thead tr');
    while (headerRow.children.length > 1) {
        headerRow.removeChild(headerRow.children[1]);
    }

    for (let day = 1; day <= DAYS_IN_MONTH; day++) {
        const th = document.createElement('th');
        th.colSpan = 2;
        th.textContent = `Day ${day}`;
        headerRow.appendChild(th);
    }

    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total Working Hours';
    headerRow.appendChild(totalHeader);

    const extraHeader = document.createElement('th');
    extraHeader.textContent = 'Extra Hours';
    headerRow.appendChild(extraHeader);
}

function addNewEmployee() {
    const tbody = document.getElementById('tableBody');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Enter name';
    nameCell.appendChild(nameInput);
    row.appendChild(nameCell);

    for (let day = 1; day <= DAYS_IN_MONTH; day++) {
        row.appendChild(createTimeCell(DEFAULT_ARRIVAL));
        row.appendChild(createTimeCell(DEFAULT_LEAVING));
    }

    const totalCell = document.createElement('td');
    totalCell.className = 'output total-column';
    row.appendChild(totalCell);

    const extraCell = document.createElement('td');
    extraCell.className = 'output extra-column';
    row.appendChild(extraCell);

    tbody.appendChild(row);
    addInputListeners(row);
    calculateHours(row);
}

function createTimeCell(defaultValue) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'time';
    input.value = defaultValue;
    input.step = 300;
    cell.appendChild(input);
    return cell;
}

function addInputListeners(row) {
    const inputs = row.querySelectorAll('input[type="time"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => calculateHours(row));
    });
}

function calculateHours(row) {
    let totalMinutes = 0;
    let extraMinutes = 0;

    const inputs = row.querySelectorAll('input[type="time"]');

    for (let day = 0; day < DAYS_IN_MONTH; day++) {
        const arrivalInput = inputs[day * 2];
        const leavingInput = inputs[day * 2 + 1];

        if (arrivalInput.value && leavingInput.value) {
            const [arrivalH, arrivalM] = arrivalInput.value.split(':').map(Number);
            const [leavingH, leavingM] = leavingInput.value.split(':').map(Number);

            let arrivalTime = arrivalH * 60 + arrivalM;
            let leavingTime = leavingH * 60 + leavingM;

            // Fix 24 Hours Logic 🔥
            if (leavingTime < arrivalTime) {
                leavingTime += 24 * 60;
            }

            let workedMinutes = leavingTime - arrivalTime;

            // Deduct Lunch Time
            if (workedMinutes > LUNCH_TIME * 60) {
                workedMinutes -= LUNCH_TIME * 60;
            }

            // Total Working Hours
            totalMinutes += workedMinutes;

            // 🔥 Finally Fixed Extra Hours
            if (workedMinutes > WORKING_HOURS * 60) {
                extraMinutes += workedMinutes - (WORKING_HOURS * 60);
            }
        }
    }

    row.querySelector('.total-column').textContent = formatTime(totalMinutes);
    row.querySelector('.extra-column').textContent = formatTime(extraMinutes); // This will NEVER show 0 again!
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

document.addEventListener('DOMContentLoaded', () => {
    createDayColumns();
    addNewEmployee();
});
