import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/notes - Buscar todas as notas
router.get('/', async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar notas' });
    }
});

// POST /api/notes - Criar nova nota
router.post('/', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }

    try {
        const note = await prisma.note.create({
            data: { title, content }
        });
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar nota' });
    }
});

// DELETE /api/notes/:id - Excluir nota
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.note.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir nota' });
    }
});

export default router;