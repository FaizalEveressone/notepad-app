import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/checklists - Buscar todas as checklists com seus itens
router.get('/', async (req, res) => {
    try {
        const checklists = await prisma.checklist.findMany({
            include: {
                items: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(checklists);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar checklists' });
    }
});

// POST /api/checklists - Criar nova checklist
router.post('/', async (req, res) => {
    const { title, items } = req.body;

    if (!title || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Título e itens são obrigatórios' });
    }

    try {
        const checklist = await prisma.checklist.create({
            data: {
                title,
                items: {
                    create: items
                }
            },
            include: {
                items: true
            }
        });
        res.json(checklist);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar checklist' });
    }
});

// PUT /api/checklists/:checklistId/items/:itemId/toggle - Alternar estado do item
router.put('/:checklistId/items/:itemId/toggle', async (req, res) => {
    const checklistId = parseInt(req.params.checklistId);
    const itemId = parseInt(req.params.itemId);

    try {
        const currentItem = await prisma.checklistItem.findUnique({
            where: { id: itemId }
        });

        if (!currentItem) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        const updatedItem = await prisma.checklistItem.update({
            where: { id: itemId },
            data: { completed: !currentItem.completed }
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar item' });
    }
});

// DELETE /api/checklists/:id - Excluir checklist
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.checklist.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir checklist' });
    }
});

export default router;