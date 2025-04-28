const express = require('express');
const Consul = require('consul');
const consul = new Consul({ host: 'consul' });
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/:service/info', async (req, res) => {
  const serviceName = req.params.service;

  try {
    const instances = await consul.health.service(serviceName);
    const healthy = instances
      .filter(entry => entry.Checks.every(c => c.Status === 'passing'))
      .map(entry => entry.Service);

    if (healthy.length === 0) {
      return res.status(404).send('No healthy instances found.');
    }

    const selected = healthy[Math.floor(Math.random() * healthy.length)];
    const url = `http://${selected.Address}:${selected.Port}/info`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error contacting service');
  }
});

app.listen(port, () => {
  console.log(`Gateway running on port ${port}`);
});
