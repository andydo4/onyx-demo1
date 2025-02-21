const mongoose = require('mongoose')
const Schema = mongoose.Schema

const flashcardSchema = new Schema({
    front: { type: String, required: true },
    back: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User'},
})

const Flashcard = mongoose.model('Flashcard', flashcardSchema)

module.exports = Flashcard