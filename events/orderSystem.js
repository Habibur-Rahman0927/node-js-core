const EventEmitter = require('events');

class OrderSystem extends EventEmitter {
  constructor() {
    super();
  }

  placeOrder(order) {
    console.log(`🛒 Order received for ${order.user} (${order.item}, qty: ${order.qty})`);
    this.emit('validate-inventory', order);
  }
}

const system = new OrderSystem();

// Mock inventory
const inventory = {
  'laptop': 10,
  'mouse': 50,
  'keyboard': 0, // Out of stock!
};

// Mock payment gateway
function processPayment(order) {
  return new Promise((resolve, reject) => {
    const success = Math.random() > 0.2; // 80% chance success
    setTimeout(() => {
      success ? resolve('payment_id_xyz') : reject('Payment failed');
    }, 1000);
  });
}

// 1. Validate Inventory
system.on('validate-inventory', (order) => {
  console.log(`📦 Checking inventory for ${order.item}...`);

  if (!inventory[order.item] || inventory[order.item] < order.qty) {
    system.emit('order-error', order, 'Insufficient stock');
    return;
  }

  // Reserve stock
  inventory[order.item] -= order.qty;
  console.log(`✅ Inventory reserved. ${inventory[order.item]} left for ${order.item}`);
  system.emit('process-payment', order);
});

// 2. Process Payment
system.on('process-payment', async (order) => {
  console.log(`💳 Processing payment for ${order.user}...`);

  try {
    const paymentId = await processPayment(order);
    order.paymentId = paymentId;
    console.log(`✅ Payment successful: ${paymentId}`);
    system.emit('send-confirmation', order);
  } catch (err) {
    system.emit('order-error', order, err);
  }
});

// 3. Send Confirmation Email
system.on('send-confirmation', (order) => {
  console.log(`📧 Sending confirmation email to ${order.user}...`);
  setTimeout(() => {
    console.log(`✅ Email sent to ${order.user} for order ${order.item} (payment: ${order.paymentId})`);
    system.emit('order-complete', order);
  }, 500);
});

// 4. Final Step
system.on('order-complete', (order) => {
  console.log(`🎉 Order for ${order.user} completed!\n`);
});

// 5. Error Handling
system.on('order-error', (order, error) => {
  console.log(`❌ Order failed for ${order.user}: ${error}`);
  // Optionally: trigger rollback, refund, etc.
});


// 🧪 TEST CASES

system.placeOrder({ user: 'Alice', item: 'laptop', qty: 1 });
system.placeOrder({ user: 'Bob', item: 'keyboard', qty: 1 }); // Out of stock
system.placeOrder({ user: 'Charlie', item: 'mouse', qty: 3 });
