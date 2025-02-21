const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studySetSchema = new Schema({
    title: String,
    flashcards: [{ type: Schema.Types.ObjectId, ref: 'Flashcard' }],
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
})

const StudySet = mongoose.model('StudySet', studySetSchema)

module.exports = StudySet