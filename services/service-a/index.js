const express = require('express');
const consul = require('consul')({ host: 'consul' });
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;
const serviceId = uuidv4();
const serviceName = process.env.SERVICE_NAME || 'service-a';

app.get('/info', (req, res) => {
  res.json({
    service: serviceName,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`${serviceName} running on port ${port}`);
  registerService();
});

function registerService() {
  consul.agent.service.register({
    id: serviceId,
    name: serviceName,
    address: serviceName,
    port: port,
    check: {
      http: `http://${serviceName}:${port}/health`,
      interval: '10s',
      timeout: '5s',
      deregistercriticalserviceafter: '1m'
    }
  }, err => {
    if (err) throw err;
    console.log(`${serviceName} registered with Consul`);
  });
}

function shutdown() {
  consul.agent.service.deregister(serviceId, err => {
    if (err) console.error('Deregistration error:', err);
    else console.log(`${serviceName} deregistered`);
    process.exit();
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
