import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.ts';
import createOrderHandler from './api/createOrder.ts';
import sendEmailHandler from './api/send-email.ts';
import verifyPaymentHandler from './api/verifyPayment.ts';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper adapter for Vercel req/res handler compatibility
const adaptHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('API Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }
};

app.post('/api/chat', adaptHandler(chatHandler));
app.post('/api/createOrder', adaptHandler(createOrderHandler));
app.post('/api/send-email', adaptHandler(sendEmailHandler));
app.post('/api/verifyPayment', adaptHandler(verifyPaymentHandler));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running on http://localhost:${PORT}`);
});
