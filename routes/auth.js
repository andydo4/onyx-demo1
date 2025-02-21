const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Flashcard = require('../models/Flashcard')
const StudySet = require('../models/StudySet')

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, 'process.env.JWT_SECRET', { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        console.error('Error in /register:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });

        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

console.log("Flashcard routes loaded")
// Create Flashcard Route
router.post('/flashcards', async (req, res) => {
    console.log("POST /flashcards hit")
    const { front, back, userId } = req.body
    
    try {
        const newFlashcard = new Flashcard({ front, back, userId })
        await newFlashcard.save()
        res.status(201).json(newFlashcard)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error adding flashcard' })
    }
})

// Retrieve all flashcards
router.get('/flashcards', async (req, res) => {
    const { userId } = req.query

    try {
        const flashcards = await Flashcard.find({ userId })
        res.status(200).json(flashcards)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error fetching flashcards'})
    }
})

// Create study set
router.post('/studysets', async (req, res) => {
    const { title, flashcards, userId } = req.body
    
    try{
        const newStudySet = new StudySet({
            title, flashcards, userId,
        })
        await newStudySet.save()
        res.status(201).json(newStudySet)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error creating study set' })
    }
})

// Retrieve all study sets from user
router.get('/studysets', async (req, res) => {
    const {userId} = req.query

    try {
        const studySets = await StudySet.find({userId}).populate('flashcards')
        res.status(200).json(studySets)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error fetching study sets' })
    }
})

// Put flashcard in study set
router.put('/studysets/:id', async (req, res) => {
    const { id } = req.params
    const { flashcardId } = req.body

    try {
        const studySet = await StudySet.findById(id)
        if(!studySet) {
            return res.status(404).json({ message: 'Study set not found' })
        }
        studySet.flashcards.push(flashcardId)
        await studySet.save()
        res.status(200).json(studySet)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error adding flashcard to study set' })
    }
})

// Delete study set
router.delete('/studysets/:id', async (req, res) => {
    const { id } = req.params

    try {
        const deletedStudySet = await StudySet.findByIdAndDelete(id)
        if(!deletedStudySet) {
            return res.status(404).json({ message: 'Study set not found' })
        }
        res.status(200).json({ message: 'Study set deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error deleting study set' })
    }
})

// Delete flashcard
router.delete('/flashcards/:id', async (req, res) => {
    const { id } = req.params

    try {
        const deletedFlashcard = await Flashcard.findByIdAndDelete(id)
        if(!deletedFlashcard) {
            return res.status(404).json({ message: 'Flashcard not found' })
        }
        res.status(200).json({ message: 'Flashcard deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error deleting flashcard' })
    }
})


module.exports = router;