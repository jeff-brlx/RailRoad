const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    end_station: { type: String, required: true },
    time_of_departure: { type: Date, required: true },
    status:{type: String, default:'active'}
    name: {type: String, required: true, unique: true},
    start_station: {type: String, required: true},
    end_station: {type: String, required: true},
    time_of_departure: {type: Date, required: true},
    status: {type: String, default: 'active'}
})
module.exports = mongoose.model('Train', trainSchema);
