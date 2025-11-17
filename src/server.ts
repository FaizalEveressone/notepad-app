import express from 'express';
import cors from 'cors';
import path from 'path';
import noteRoutes from './routes/notes';
import checklistRoutes from './routes/checklist';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/notes', noteRoutes);
app.use('/api/checklists', checklistRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

app.get('/checklist', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/checklist.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});