// tickets.controllers.js
const Ticket = require('../models/tickets.models');
const Trainstation = require('../models/trainstations.models');
const User = require('../models/userModel'); 

const bookTicket = async (req, res) => {
    const { userId, trainstationId } = req.body;

    try {
        // verify if the user exist
        const user = await User.findById(userId);
        if (!user || user.status === 'deleted') {
            return res.status(404).send("User not found");
        }

        // Verify if the train station exist and is active
        const trainstation = await Trainstation.findById(trainstationId);
        if (!trainstation || trainstation.status === 'deleted') {
            return res.status(404).send("Trainstation not found or has been deleted");
        }

        // Verify if the train station is open
        const currentHour = new Date().toISOString().slice(11, 16); // Format HH:mm
        if (currentHour < trainstation.open_hour || currentHour > trainstation.close_hour) {
            return res.status(400).send("Trainstation is currently closed for bookings");
        }

        // Create and book a new ticket
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