const mongoose = require('mongoose');

const trainstationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    status: { type: String, default: "active" },
    open_hour: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);  // Format HH:mm
            },
            message: props => `${props.value} n'est pas une heure valide!`
        }
    },
    close_hour: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);  // Format HH:mm
            },
            message: props => `${props.value} n'est pas une heure valide!`
        }
    },
    image: { type: String, required: true },  // Stocke l'URL ou le chemin de l'image redimensionnée
});

module.exports = mongoose.model('Trainstation', trainstationSchema);
