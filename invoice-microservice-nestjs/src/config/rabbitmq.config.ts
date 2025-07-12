export default () => ({
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
    exchangeName: process.env.RABBITMQ_EXCHANGE_NAME,
    exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE,
    prefetchCount: parseInt(process.env.RABBITMQ_PREFETCH || '10', 10),
  },
});
