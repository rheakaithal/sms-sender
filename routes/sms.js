const express = require('express');
const router = express.Router();
const { sendSMS } = require('../services/twilioClient');
const tenants = require('../data/tenants.json');

router.post('/send', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing "to" or "message".' });
  }

  if (to === 'all') {
    const results = await Promise.allSettled(
      tenants.map(t => sendSMS(t.phone, message))
    );
    return res.json({ status: 'sent', results });
  }

  const tenant = tenants.find(t => t.name.toLowerCase() === to.toLowerCase());
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found.' });
  }

  try {
    await sendSMS(tenant.phone, message);
    res.json({ status: 'Message sent to ' + tenant.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
