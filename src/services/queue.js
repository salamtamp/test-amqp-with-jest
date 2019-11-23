const amqp = require('amqplib');

class QueueService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async createConnection(url) {
    if (!url) {
      throw 'Invalid url';
    }

    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    return this;
  }

  async createQueues(queueNames, option = { durable: true }) {
    if (this.connection === null || this.channel === null) {
      throw 'Connection not found';
    }

    if (typeof queueNames === 'string') {
      queueNames = [queueNames];
    }

    return Promise.all([
      ...queueNames.map(name => this.channel.assertQueue(name, option))
    ]);
  }

  async sendToQueue(queueNames, data, option = { deliveryMode: 2 }) {
    if (this.connection === null || this.channel === null) {
      throw 'Connection not found';
    }

    if (typeof queueNames === 'string') {
      queueNames = [queueNames];
    }

    const bufferData = Buffer.from(JSON.stringify(data));

    return Promise.all([
      ...queueNames.map(name =>
        this.channel.sendToQueue(name, bufferData, option)
      )
    ]);
  }
}

module.exports = QueueService;
