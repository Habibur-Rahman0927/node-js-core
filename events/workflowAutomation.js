const EventEmitter = require('events');

// Central event system
const workflow = new EventEmitter();

// Step 1: Handle form submission
function submitForm(formData) {
    console.log(`📥 [Form] Received submission from ${formData.user}`);
    workflow.emit('formSubmitted', formData);
}

// Step 2: Approve submission based on form type
workflow.on('formSubmitted', (data) => {
    if (data.type === 'leave') {
        console.log(`✅ [Approval] Leave request auto-approved for ${data.user}`);
        workflow.emit('approved', data);
    } else {
        console.log(`⚠️ [Approval] Manual approval required for type: ${data.type}`);
    }
});

// Step 3: Log for audit
workflow.on('approved', (data) => {
    console.log(`📝 [Audit] Approval logged for ${data.user}`);
    workflow.emit('auditLogged', data);
});

// Step 4: Notify user
workflow.on('auditLogged', (data) => {
    console.log(`📧 [Notification] Email sent to ${data.user}: Your request is approved.`);
});

// Simulate form submission
const formData = {
    user: 'Habib',
    type: 'leave', // try changing this to 'reimbursement' for different flow
    reason: 'Personal time off'
};

const formData1 = {
    user: 'Rock',
    type: 'reimbursement', // try changing this to 'reimbursement' for different flow
    reason: 'Personal time off'
};


console.log('🚀 Starting workflow...\n');
submitForm(formData);
submitForm(formData1);
