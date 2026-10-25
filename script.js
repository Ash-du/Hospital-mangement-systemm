const STORAGE_KEY = 'carecoreHospitalState';

const initialState = {
  patients: [
    { id: 'PT-1024', name: 'Selam Tadesse', department: 'Cardiology', doctor: 'Dr. Hagos', status: 'In treatment' },
    { id: 'PT-1048', name: 'Martha Bekele', department: 'Neurology', doctor: 'Dr. Emebet', status: 'Stable' },
    { id: 'PT-1063', name: 'Daniel Mamo', department: 'Orthopedics', doctor: 'Dr. Berhanu', status: 'Critical' },
    { id: 'PT-1078', name: 'Aster Zegeye', department: 'Dermatology', doctor: 'Dr. Meron', status: 'Discharged' },
    { id: 'PT-1091', name: 'Nebiyu Teshome', department: 'Pediatrics', doctor: 'Dr. Samuel', status: 'Stable' }
  ],
  appointments: [
    { id: 'APT-2201', patient: 'Selam Tadesse', doctor: 'Dr. Hagos', date: '2026-10-25', time: '09:30', status: 'Confirmed' },
    { id: 'APT-2202', patient: 'Martha Bekele', doctor: 'Dr. Emebet', date: '2026-10-25', time: '11:15', status: 'Pending' },
    { id: 'APT-2203', patient: 'Daniel Mamo', doctor: 'Dr. Berhanu', date: '2026-10-26', time: '08:00', status: 'Confirmed' }
  ],
  billing: [
    { id: 'INV-4581', patient: 'Selam Tadesse', amount: 2400, status: 'Pending' },
    { id: 'INV-4582', patient: 'Martha Bekele', amount: 1800, status: 'Paid' },
    { id: 'INV-4583', patient: 'Daniel Mamo', amount: 5600, status: 'Pending' },
    { id: 'INV-4584', patient: 'Aster Zegeye', amount: 1200, status: 'Paid' }
  ],
  labs: [
    { id: 'LAB-701', patient: 'Daniel Mamo', test: 'CBC Panel', doctor: 'Dr. Berhanu', status: 'In review', result: 'Pending' },
    { id: 'LAB-702', patient: 'Martha Bekele', test: 'MRI Scan', doctor: 'Dr. Emebet', status: 'Completed', result: 'Normal' },
    { id: 'LAB-703', patient: 'Selam Tadesse', test: 'ECG', doctor: 'Dr. Hagos', status: 'In review', result: 'Monitoring' }
  ],
  pharmacy: [
    { name: 'Paracetamol', batch: 'PAR-204', stock: 320, reorder: 80, status: 'Healthy' },
    { name: 'Antibiotic Syrup', batch: 'ANT-119', stock: 42, reorder: 60, status: 'Low' },
    { name: 'Insulin', batch: 'INS-560', stock: 18, reorder: 30, status: 'Critical' }
  ],
  staff: [
    { name: 'Dr. Hagos Aman', role: 'Cardiologist', shift: 'Morning', onDuty: true },
    { name: 'Dr. Emebet Tola', role: 'Neurologist', shift: 'Evening', onDuty: true },
    { name: 'Nurse Berihun', role: 'ICU Nurse', shift: 'Night', onDuty: true },
    { name: 'Mekdes Gashaw', role: 'Pharmacy Lead', shift: 'Morning', onDuty: false }
  ]
};

const state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(initialState);

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHTML(value) {
  const characters = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(value ?? '').replace(/[&<>"']/g, character => characters[character]);
}

function updateDate() {
  const el = document.getElementById('liveDate');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function renderDashboard() {
  document.getElementById('statPatients').textContent = state.patients.length;
  document.getElementById('statAdmissions').textContent = state.patients.filter(p => p.status !== 'Discharged').length + 14;
  document.getElementById('statBilling').textContent = state.billing.filter(i => i.status === 'Pending').length;
  document.getElementById('statCritical').textContent = state.patients.filter(p => p.status === 'Critical').length;

  const queueList = document.getElementById('queueList');
  queueList.innerHTML = state.patients.slice(0, 4).map((patient) => `
    <div class="list-item">
      <div class="list-meta">
        <strong>${escapeHTML(patient.name)}</strong>
        <small>${escapeHTML(patient.department)}</small>
      </div>
      <span class="status-tag ${patient.status === 'Critical' ? 'danger' : patient.status === 'In treatment' ? 'warning' : 'info'}">${escapeHTML(patient.status)}</span>
    </div>
  `).join('');

  const activityFeed = document.getElementById('activityFeed');
  activityFeed.innerHTML = [
    { label: 'Admission updated', info: 'PT-1024', time: '5 mins ago' },
    { label: 'Lab result uploaded', info: 'LAB-702', time: '12 mins ago' },
    { label: 'Payment confirmed', info: 'INV-4582', time: '25 mins ago' }
  ].map(item => `
    <div class="list-item">
      <div class="list-meta">
        <strong>${item.label}</strong>
        <small>${item.info}</small>
      </div>
      <small>${item.time}</small>
    </div>
  `).join('');

  const alertFeed = document.getElementById('alertFeed');
  alertFeed.innerHTML = [
    { label: 'Critical case review', meta: 'ICU-12', type: 'danger' },
    { label: 'Low pharmacy stock', meta: 'Insulin', type: 'warning' },
    { label: 'Pending billing review', meta: 'INV-4581', type: 'info' }
  ].map(item => `
    <div class="list-item">
      <div class="list-meta">
        <strong>${item.label}</strong>
        <small>${item.meta}</small>
      </div>
      <span class="status-tag ${item.type}">${item.type === 'danger' ? 'High' : item.type === 'warning' ? 'Review' : 'Open'}</span>
    </div>
  `).join('');
}

function renderPatients() {
  const table = document.getElementById('patientTableBody');
  const search = document.getElementById('patientSearch')?.value.trim().toLowerCase() || '';

  const filtered = state.patients.filter((patient) =>
    patient.name.toLowerCase().includes(search) ||
    patient.department.toLowerCase().includes(search) ||
    patient.doctor.toLowerCase().includes(search)
  );

  table.innerHTML = filtered.length ? filtered.map((patient) => `
    <tr>
      <td><strong>${escapeHTML(patient.name)}</strong><br><small>${escapeHTML(patient.id)}</small></td>
      <td>${escapeHTML(patient.department)}</td>
      <td>${escapeHTML(patient.doctor)}</td>
      <td><span class="status-tag ${patient.status === 'Critical' ? 'danger' : patient.status === 'Discharged' ? 'success' : patient.status === 'Stable' ? 'info' : 'warning'}">${escapeHTML(patient.status)}</span></td>
      <td><button class="action-btn" data-patient="${escapeHTML(patient.id)}">Open</button></td>
    </tr>
  `).join('') : '<tr><td colspan="5">No matching patients found.</td></tr>';
}

function renderAppointments(search = '') {
  const table = document.getElementById('appointmentTableBody');
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = state.appointments.filter((appointment) =>
    `${appointment.patient} ${appointment.doctor} ${appointment.date} ${appointment.time} ${appointment.id}`
      .toLowerCase().includes(normalizedSearch)
  );

  table.innerHTML = filtered.length ? filtered.map((appointment) => `
    <tr>
      <td>${escapeHTML(appointment.patient)}</td>
      <td>${escapeHTML(appointment.doctor)}</td>
      <td>${escapeHTML(appointment.date)}</td>
      <td>${escapeHTML(appointment.time)}</td>
      <td><span class="status-tag ${appointment.status === 'Confirmed' ? 'success' : 'warning'}">${escapeHTML(appointment.status)}</span></td>
    </tr>
  `).join('') : '<tr><td colspan="5">No matching appointments found.</td></tr>';
}

function renderBilling() {
  const table = document.getElementById('billingTableBody');
  table.innerHTML = state.billing.map((item) => `
    <tr>
      <td>${escapeHTML(item.id)}</td>
      <td>${escapeHTML(item.patient)}</td>
      <td>$${item.amount.toLocaleString()}</td>
      <td><span class="status-tag ${item.status === 'Paid' ? 'success' : 'warning'}">${escapeHTML(item.status)}</span></td>
    </tr>
  `).join('');

  const totalOutstanding = state.billing.filter(item => item.status !== 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const totalCollected = state.billing.filter(item => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const pending = state.billing.filter(item => item.status === 'Pending').length;

  document.getElementById('totalOutstanding').textContent = `$${totalOutstanding.toLocaleString()}`;
  document.getElementById('totalCollected').textContent = `$${totalCollected.toLocaleString()}`;
  document.getElementById('totalPending').textContent = pending;
}

function renderLabs() {
  const table = document.getElementById('labTableBody');
  table.innerHTML = state.labs.map((item) => `
    <tr>
      <td>${escapeHTML(item.patient)}</td>
      <td>${escapeHTML(item.test)}</td>
      <td>${escapeHTML(item.doctor)}</td>
      <td><span class="status-tag ${item.status === 'Completed' ? 'success' : 'info'}">${escapeHTML(item.status)}</span></td>
      <td>${escapeHTML(item.result)}</td>
    </tr>
  `).join('');
}

function renderPharmacy() {
  const table = document.getElementById('pharmacyTableBody');
  table.innerHTML = state.pharmacy.map((item) => `
    <tr>
      <td>${escapeHTML(item.name)}</td>
      <td>${escapeHTML(item.batch)}</td>
      <td>${escapeHTML(item.stock)}</td>
      <td>${escapeHTML(item.reorder)}</td>
      <td><span class="status-tag ${item.status === 'Critical' ? 'danger' : item.status === 'Low' ? 'warning' : 'success'}">${escapeHTML(item.status)}</span></td>
    </tr>
  `).join('');
}

function renderStaff() {
  const table = document.getElementById('staffTableBody');
  table.innerHTML = state.staff.map((member) => `
    <tr>
      <td>${escapeHTML(member.name)}</td>
      <td>${escapeHTML(member.role)}</td>
      <td>${escapeHTML(member.shift)}</td>
      <td><span class="status-tag ${member.onDuty ? 'success' : 'warning'}">${member.onDuty ? 'On duty' : 'Off duty'}</span></td>
    </tr>
  `).join('');
}

function setActivePanel(target) {
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.target === target);
  });

  document.querySelectorAll('.panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === target);
  });
}

function addPatient(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const patient = {
    id: `PT-${Math.floor(Math.random() * 9000 + 1000)}`,
    name: formData.get('name').toString().trim(),
    department: formData.get('department').toString().trim(),
    doctor: formData.get('doctor').toString().trim(),
    status: formData.get('status').toString()
  };

  if (!patient.name || !patient.department || !patient.doctor) return;

  state.patients.unshift(patient);
  saveState();
  renderAll();
  form.reset();
}

function addAppointment(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const appointment = {
    id: `APT-${Math.floor(Math.random() * 9000 + 1000)}`,
    patient: formData.get('patient').toString().trim(),
    doctor: formData.get('doctor').toString().trim(),
    date: formData.get('date').toString(),
    time: formData.get('time').toString(),
    status: 'Pending'
  };

  if (!appointment.patient || !appointment.doctor || !appointment.date || !appointment.time) return;

  state.appointments.unshift(appointment);
  saveState();
  renderAll();
  form.reset();
}

function renderAll() {
  renderDashboard();
  renderPatients();
  renderAppointments();
  renderBilling();
  renderLabs();
  renderPharmacy();
  renderStaff();
}

function bindEvents() {
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('globalSearch').value = '';
      document.getElementById('patientSearch').value = '';
      renderAll();
      setActivePanel(button.dataset.target);
    });
  });

  document.getElementById('patientForm').addEventListener('submit', addPatient);
  document.getElementById('appointmentForm').addEventListener('submit', addAppointment);

  document.getElementById('patientSearch').addEventListener('input', renderPatients);

  document.getElementById('newPatientBtn').addEventListener('click', () => {
    setActivePanel('patients');
    document.querySelector('#patientForm input[name="name"]').focus();
  });

  document.getElementById('globalSearch').addEventListener('input', (event) => {
    const value = event.target.value.trim().toLowerCase();
    const patientSearch = document.getElementById('patientSearch');
    if (!value) {
      patientSearch.value = '';
      renderAll();
      setActivePanel('dashboard');
      return;
    }

    const patientMatches = state.patients.some((item) =>
      `${item.name} ${item.department} ${item.doctor}`.toLowerCase().includes(value)
    );
    const appointmentMatches = state.appointments.some((item) =>
      `${item.patient} ${item.doctor} ${item.date} ${item.time} ${item.id}`.toLowerCase().includes(value)
    );

    if (patientMatches || !appointmentMatches) {
      patientSearch.value = value;
      renderPatients();
      setActivePanel('patients');
      return;
    }

    patientSearch.value = '';
    renderAppointments(value);
    setActivePanel('appointments');
  });

  const luxuryToggle = document.getElementById('luxuryThemeToggle');
  const luxuryEnabled = localStorage.getItem('carecoreExecutiveTheme') === 'true';
  document.body.classList.toggle('luxury-theme', luxuryEnabled);
  luxuryToggle.setAttribute('aria-pressed', String(luxuryEnabled));
  luxuryToggle.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('luxury-theme');
    localStorage.setItem('carecoreExecutiveTheme', String(enabled));
    luxuryToggle.setAttribute('aria-pressed', String(enabled));
  });
}

updateDate();
renderAll();
bindEvents();

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();
