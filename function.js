let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

function addAppointment() {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (!title || !date || !startTime || !endTime) {
        alert("⚠️ กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    const newAppointment = {
        id: Date.now(),
        title,
        date,
        startTime,
        endTime,
        status: "confirmed"
    };

    if (checkTimeConflict(newAppointment)) {
        alert("⚠️ มีนัดหมายในช่วงเวลานี้แล้ว!");
        return;
    }

    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    renderAppointments();
}

function checkTimeConflict(newAppt) {
    return appointments.some(appt => appt.date === newAppt.date && 
        ((newAppt.startTime >= appt.startTime && newAppt.startTime < appt.endTime) || 
        (newAppt.endTime > appt.startTime && newAppt.endTime <= appt.endTime)));
}

function cancelAppointment(id) {
    appointments = appointments.map(appt => 
        appt.id === id ? { ...appt, status: "cancelled" } : appt);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    renderAppointments();
}

function renderAppointments() {
    const list = document.getElementById('appointmentList');
    list.innerHTML = "";

    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = appointments.filter(appt => appt.date >= today);

    upcomingAppointments.forEach(appt => {
        const li = document.createElement('li');
        li.className = `appointment-item flex justify-between p-4 rounded-md shadow-md bg-white ${appt.status === "cancelled" ? "cancelled" : ""}`;
        li.innerHTML = `
            <div>
                <p class="text-lg font-semibold">📅 ${appt.date} | ⏰ ${appt.startTime} - ${appt.endTime}</p>
                <p class="text-gray-600">${appt.title}</p>
            </div>
            ${appt.status !== 'cancelled' ? `<button onclick="cancelAppointment(${appt.id})" class="btn bg-red-500 hover:bg-red-700 text-sm px-3 py-1">ยกเลิก</button>` : ''}
        `;
        list.appendChild(li);
    });
}


renderAppointments();
