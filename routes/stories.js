const express = require('express');
const router = express.Router();
const Story = require('../models/Story');


router.get('/api', async (req, res) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/api/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/api', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const story = new Story({
            title,
            content,
            author: author || 'Anonymous'
        });

        await story.save();
        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/api/:id', async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const story = await Story.findByIdAndUpdate(
            req.params.id,
            { title, content, author, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.json(story);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/api/:id', async (req, res) => {
    try {
        const story = await Story.findByIdAndDelete(req.params.id);

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.json({ message: 'Story deleted successfully', story });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/', (req, res) => {
    res.render('site/stories', {
        pagetitle: 'Share Your Story',
        layout: false 
    });
});

module.exports = router;
