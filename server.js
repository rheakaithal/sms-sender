require('dotenv').config();
const express = require('express');
const smsRoutes = require('./routes/sms');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', smsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
