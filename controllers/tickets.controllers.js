// tickets.controllers.js
const Ticket = require('../models/tickets.models');
const Trainstation = require('../models/trainstations.models');
const User = require('../models/userModel'); 

const bookTicket = async (req, res) => {
    const { userId, trainstationId } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user || user.status === 'deleted') {
            return res.status(404).send("User not found");
        }

        // Vérifier si la station de train existe et est active
        const trainstation = await Trainstation.findById(trainstationId);
        if (!trainstation || trainstation.status === 'deleted') {
            return res.status(404).send("Trainstation not found or has been deleted");
        }

        // Vérifier si la station est ouverte pour les réservations
        const currentHour = new Date().toISOString().slice(11, 16); // Format HH:mm
        if (currentHour < trainstation.open_hour || currentHour > trainstation.close_hour) {
            return res.status(400).send("Trainstation is currently closed for bookings");
        }

        // Créer et enregistrer un nouveau ticket
        const newTicket = new Ticket({
            userId,
            trainstationId
        });

        await newTicket.save();
        res.status(201).send({ message: "Ticket booked successfully", ticket: newTicket });
    } catch (error) {
        return res.status(404).send(error.message);
    }
};

const validateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: "validate" }, { new: true });
        if (!ticket) {
            return res.status(404).send("Ticket not found");
        }
        res.status(200).send("Ticket validated")
    }catch(error){
        return res.status(404).send(error.message);
    }
};

module.exports = {
    bookTicket,
    validateTicket
};