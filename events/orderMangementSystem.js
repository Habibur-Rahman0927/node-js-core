const EventEmitter = require('events');

class OrderManager extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Allow up to 20 listeners per event
  }

  createOrder(order) {
    console.log(`✅ Creating order for ${order.customer}`);
    this.emit('orderCreated', order); // Notify all listeners
  }
}

class InventoryManager {
  constructor(eventEmitter) {
    eventEmitter.on('orderCreated', this.updateInventory);
  }

  updateInventory(order) {
    console.log(`📦 Updating inventory for product ${order.product}`);
    // Inventory update logic here
  }
}

class NotificationService {
  constructor(eventEmitter) {
    eventEmitter.on('orderCreated', this.sendOrderConfirmation);
  }

  async sendOrderConfirmation(order) {
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`📨 Order confirmation sent to ${order.customer}`);
    } catch (error) {
      eventEmitter.emit('error', error);
    }
  }
}

class Logger {
  constructor(eventEmitter) {
    eventEmitter.on('orderCreated', this.logOrder);
    eventEmitter.on('error', this.logError);
  }

  logOrder(order) {
    console.log(`📝 Order logged: ${JSON.stringify(order)}`);
    // Logging logic here
  }

  logError(error) {
    console.error(`❌ Error occurred: ${error.message}`);
    // Error logging logic here
  }
}

// Bootstrap the system
const orderManager = new OrderManager();
new InventoryManager(orderManager);
new NotificationService(orderManager);
new Logger(orderManager);

// Example order
const order = {
  customer: 'Alice',
  product: 'Laptop',
  quantity: 1
};

orderManager.createOrder(order);
