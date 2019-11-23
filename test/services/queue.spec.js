const QueueService = require('../../src/services/queue');

describe('Services', () => {
  describe('Queue service', () => {
    beforeEach(() => {
      queueService = new QueueService();
      queueService.connection = jest.fn();
      queueService.channel = {
        assertQueue: jest.fn(),
        sendToQueue: jest.fn()
      };
    });

    test('should throw error when create connection with null url', async () => {
      const url = null;
      const expectedErrorMessage = 'Invalid url';

      try {
        await queueService.createConnection(url);
      } catch (error) {
        expect(error).toEqual(expectedErrorMessage);
      }
    });

    test('should call the assertQueue function at one time when creating a queue', async () => {
      const queueName = 'test';
      jest.spyOn(queueService.channel, 'assertQueue');

      await queueService.createQueues(queueName);
      expect(queueService.channel.assertQueue.mock.calls.length).toBe(1);
    });

    test('should call the assertQueue function at three time when creating 3 queues', async () => {
      const queueName = ['test1', 'test2', 'test3'];
      jest.spyOn(queueService.channel, 'assertQueue');

      await queueService.createQueues(queueName);
      expect(queueService.channel.assertQueue.mock.calls.length).toBe(3);
    });

    test('should call the sentToQueue function at one time when send data to a queue', async () => {
      const queueName = 'test1';
      const data = { message: 'hello world' };
      jest.spyOn(queueService.channel, 'sendToQueue');

      await queueService.sendToQueue(queueName, data);
      expect(queueService.channel.sendToQueue.mock.calls.length).toBe(1);
    });

    test('should call the sentToQueue function at two time when send data to 2 queue', async () => {
      const queueName = ['test1', 'test2'];
      const data = { message: 'hello world' };
      jest.spyOn(queueService.channel, 'sendToQueue');

      await queueService.sendToQueue(queueName, data);
      expect(queueService.channel.sendToQueue.mock.calls.length).toBe(2);
    });
  });
});
