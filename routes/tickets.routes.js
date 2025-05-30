// tickets.routes.js
const router = require("express").Router();
const TicketsController = require('../controllers/tickets.controllers');
const AuthMiddleware = require('../middlewares/auth.middleware');

// Book a ticket
router.post('/book', TicketsController.bookTicket);

// Validate a ticket
router.put('/validate/:id', AuthMiddleware.verifyUserOrEmployee, TicketsController.validateTicket);

module.exports = router;