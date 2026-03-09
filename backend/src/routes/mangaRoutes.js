import express from 'express';
const router = express.Router();
import {
    getManga,
    getMangaById,
    createManga,
    updateManga,
    deleteManga
} from '../controllers/mangaController.js';

// 1. GET ALL
router.get('/', getManga);

// 2. GET SINGLE BY ID
router.get('/:id', getMangaById);

// 3. CREATE
router.post('/', createManga);

// 4. UPDATE BY ID
router.put('/:id', updateManga);

// 5. DELETE BY ID
router.delete('/:id', deleteManga);

export default router;