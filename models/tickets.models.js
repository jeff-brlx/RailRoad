// tickets.models.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    trainstationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainstation', required: true },
    bookingTime: { type: Date, default: Date.now },
    status: { type: String, default: 'booked' } // or 'validated', 'canceled'
});

module.exports = mongoose.model('Ticket', ticketSchema);