// Trainstation is at least {id, name, open_hour, close_hour, image}. The image
// need to be resized to a 200*200px image if the upload is too big
const mongoose = require('mongoose')

const trainstationSchema = new mongoose.Schema({
    name:{ type: String , require: true , unique: true},
    open_hour: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);  // Teste si l'heure est au format HH:mm
            },
            message: props => `${props.value} n'est pas une heure valide!`  // Message d'erreur personnalisé
        }
    },
    close_hour: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);  // Teste si l'heure est au format HH:mm
            },
            message: props => `${props.value} n'est pas une heure valide!`  // Message d'erreur personnalisé
        }
    },
    image:{

        }
    });
