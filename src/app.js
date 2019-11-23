const QueueService = require('./services/queue');

const getListOfNumber = count => {
  return Object.keys([...Array(count)]).map(n => +n + 1);
};

(async () => {
  const config = {
    queue: {
      url: 'amqp://user:password@localhost:5672'
    }
  };
  const { url } = config.queue;
  const destinationQueue = 'test';

  try {
    const queueService = new QueueService();
    const queueConnection = await queueService.createConnection(url);

    await queueConnection.createQueues(destinationQueue);

    for (const round of getListOfNumber(10)) {
      const data = { message: 'hello', round };
      await queueConnection.sendToQueue(destinationQueue, data);
    }

    console.log('Done :)');
  } catch (error) {
    console.log('error:', error);
  }
})();
