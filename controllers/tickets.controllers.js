// tickets.controllers.js
const Ticket = require('../models/tickets.models');
const Trainstation = require('../models/trainstations.models');

const bookTicket = async (req, res) => {
    const { userId, trainstationId } = req.body;

    try {
        const trainstation = await Trainstation.findById(trainstationId);
        if (!trainstation || trainstation.status === 'deleted') {
            return res.status(404).send("Trainstation not found or has been deleted");
        }

        // Check if the trainstation is open
        const currentHour = new Date().toISOString().slice(11, 16); // Get HH:mm format
        if (currentHour < trainstation.open_hour || currentHour > trainstation.close_hour) {
            return res.status(400).send("Trainstation is currently closed for bookings");
        }

        const newTicket = new Ticket({
            userId,
            trainstationId
        });

        await newTicket.save();
        res.status(201).send({ message: "Ticket booked successfully", ticket: newTicket });
    } catch (error) {
        return res.status(400).send("Failed to book ticket. Please try again.");
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
        return res.status(400).send(error.message);
    }
};

module.exports = {
    bookTicket,
    validateTicket
};