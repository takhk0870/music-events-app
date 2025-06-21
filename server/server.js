import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';

// Expressアプリケーションを作成
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
// '/api/events' で始まるリクエストをeventsRouterに渡す
// これで、GET, POST, PUT, DELETE のリクエストを処理します
app.use('/api/events', eventsRouter);


// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('This server only provides event data via API.');
  console.log('To update data, run "npm run scrape" in a separate terminal.');
});
