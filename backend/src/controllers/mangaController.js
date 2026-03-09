import Manga from '../models/mangaModel.js';

// GET ALL
export const getManga = async (req, res) => {
    try {
        // Build filter object based on query params
        const filter = {};
        if (req.query.author) {
            filter.author = req.query.author;
        }
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: 'i' };
        }
        if (req.query.genre) {
            // Support comma-separated genres or single genre
            if (Array.isArray(req.query.genre)) {
                filter.genre = { $all: req.query.genre };
            } else if (req.query.genre.includes(',')) {
                filter.genre = { $all: req.query.genre.split(',') };
            } else {
                filter.genre = req.query.genre;
            }
        }
        // Determine sort order from query, default to title ascending
        let sort = { title: 1 };
        if (req.query.sort) {
            // Example: ?sort=title or ?sort=-releaseYear
            const sortField = req.query.sort;
            if (sortField.startsWith('-')) {
                sort = { [sortField.substring(1)]: -1 };
            } else {
                sort = { [sortField]: 1 };
            }
        }
        const manga = await Manga.find(filter).sort(sort);
        res.json(manga);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET SINGLE BY ID
export const getMangaById = async (req, res) => {
    try {
        const item = await Manga.findOne({ _id: req.params.id });
        if (!item) return res.status(404).json({ message: "Manga not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE
export const createManga = async (req, res) => {
    try {
        const newManga = new Manga(req.body);
        const saved = await newManga.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// UPDATE BY ID
export const updateManga = async (req, res) => {
    try {
        const updatedManga = await Manga.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedManga) return res.status(404).json({ message: "Manga not found" });
        res.json(updatedManga);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE BY ID
export const deleteManga = async (req, res) => {
    try {
        const deletedManga = await Manga.findOneAndDelete({
            _id: req.params.id
        });
        if (!deletedManga) return res.status(404).json({ message: "Manga not found" });
        res.json({ message: "Manga entry successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};