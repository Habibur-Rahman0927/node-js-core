// book-appointment
// ├── validate-patient
// │   ├── validate-insurance
// │   │   ├── check-doctor-availability
// │   │   │   ├── reserve-slot
// │   │   │   │   ├── notify-doctor
// │   │   │   │   └── notify-patient
// │   │   │   └── audit-log
// │   │   └── error-handling
// └── error-handling

const EventEmitter = require('events');

class HospitalSystem extends EventEmitter {
  constructor() {
    super();
  }

  startAppointmentBooking(appointment) {
    this.emit('validate-patient', appointment);
  }
}

const hospital = new HospitalSystem();

// Mock external APIs
const db = {
  doctors: {
    'dr.john': { availableSlots: ['10am', '11am'], booked: [] }
  },
  patients: ['p123', 'p456']
};

function mockInsuranceValidation(patientId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      patientId === 'p123' ? resolve(true) : reject('Insurance not valid');
    }, 500);
  });
}

// 1. Validate Patient
hospital.on('validate-patient', (appointment) => {
  console.log('🔎 Validating patient...');
  if (!db.patients.includes(appointment.patientId)) {
    return hospital.emit('error', appointment, 'Invalid patient ID');
  }
  hospital.emit('validate-insurance', appointment);
});

// 2. Validate Insurance
hospital.on('validate-insurance', async (appointment) => {
  console.log('📄 Validating insurance...');
  try {
    await mockInsuranceValidation(appointment.patientId);
    hospital.emit('check-doctor', appointment);
  } catch (err) {
    hospital.emit('error', appointment, err);
  }
});

// 3. Check Doctor Availability
hospital.on('check-doctor', (appointment) => {
  console.log('👨‍⚕️ Checking doctor availability...');
  const doctor = db.doctors[appointment.doctorId];
  if (!doctor || !doctor.availableSlots.includes(appointment.time)) {
    return hospital.emit('error', appointment, 'Doctor unavailable');
  }
  hospital.emit('reserve-slot', appointment);
});

// 4. Reserve Slot
hospital.on('reserve-slot', (appointment) => {
  console.log('📅 Reserving slot...');
  const doctor = db.doctors[appointment.doctorId];
  doctor.availableSlots = doctor.availableSlots.filter(t => t !== appointment.time);
  doctor.booked.push(appointment.time);
  hospital.emit('notify-doctor', appointment);
  hospital.emit('notify-patient', appointment);
  hospital.emit('audit-log', appointment);
});

// 5. Notify Doctor
hospital.on('notify-doctor', (appointment) => {
  console.log(`📧 Notifying doctor ${appointment.doctorId} about new appointment at ${appointment.time}`);
});

// 6. Notify Patient
hospital.on('notify-patient', (appointment) => {
  console.log(`📧 Sending confirmation to patient ${appointment.patientId} for ${appointment.time}`);
});

// 7. Audit Log
hospital.on('audit-log', (appointment) => {
  console.log(`📝 Audit log created for ${appointment.patientId} -> ${appointment.doctorId} at ${appointment.time}`);
});

// 8. Error Handling
hospital.on('error', (appointment, error) => {
  console.error(`❌ Booking failed for ${appointment.patientId}: ${error}`);
  // Could emit retry, send alert, rollback actions, etc.
});


// 🧪 Trigger Test
hospital.startAppointmentBooking({
  patientId: 'p123',
  doctorId: 'dr.john',
  time: '10am'
});

hospital.startAppointmentBooking({
  patientId: 'p999',
  doctorId: 'dr.john',
  time: '11am'
});

hospital.startAppointmentBooking({
  patientId: 'p456',
  doctorId: 'dr.john',
  time: '11am'
});

