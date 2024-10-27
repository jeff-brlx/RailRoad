// tickets.controllers.test.js
const app = require('../index');  
const request = require('supertest')(app);
const Ticket = require('../models/tickets.models');
const Trainstation = require('../models/trainstations.models');
const User = require('../models/userModel');

// Mock the models
jest.mock('../models/tickets.models');
jest.mock('../models/trainstations.models');
jest.mock('../models/userModel');

describe('POST /tickets/book', () => {
    it('should return 201 and create a new ticket if user and trainstation are valid', async () => {
        const validUser = { _id: 'user-id', status: 'active' };
        const validTrainstation = {
            _id: 'station-id',
            status: 'active',
            open_hour: '08:00',
            close_hour: '20:00',
        };
        const newTicket = { userId: 'user-id', trainstationId: 'station-id' };

        // Mock the database responses
        User.findById.mockResolvedValue(validUser);
        Trainstation.findById.mockResolvedValue(validTrainstation);
        Ticket.prototype.save.mockResolvedValue(newTicket);

        const response = await request.post('/tickets/book').send(newTicket);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Ticket booked successfully" });
    });

    it('should return 404 if the user does not exist or is deleted', async () => {
        const invalidUser = null;

        // Mock the user as not found
        User.findById.mockResolvedValue(invalidUser);

        const response = await request.post('/tickets/book').send({ userId: 'user-id', trainstationId: 'station-id' });
        expect(response.status).toBe(404);
        expect(response.text).toBe("User not found");
    });

    it('should return 404 if the trainstation does not exist or is deleted', async () => {
        const validUser = { _id: 'user-id', status: 'active' };
        const invalidTrainstation = null;

        // Mock responses for valid user and missing trainstation
        User.findById.mockResolvedValue(validUser);
        Trainstation.findById.mockResolvedValue(invalidTrainstation);

        const response = await request.post('/tickets/book').send({ userId: 'user-id', trainstationId: 'station-id' });
        expect(response.status).toBe(404);
        expect(response.text).toBe("Trainstation not found or has been deleted");
    });

    it('should return 400 if the trainstation is closed for bookings', async () => {
        const validUser = { _id: 'user-id', status: 'active' };
        const closedTrainstation = {
            _id: 'station-id',
            status: 'active',
            open_hour: '08:00',
            close_hour: '20:00',
        };

        // Mock the current time outside of open hours
        const mockDate = new Date('2023-01-01T21:00:00Z');  // 21:00, outside of open hours
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        // Mock responses for valid user and closed trainstation
        User.findById.mockResolvedValue(validUser);
        Trainstation.findById.mockResolvedValue(closedTrainstation);

        const response = await request.post('/tickets/book').send({ userId: 'user-id', trainstationId: 'station-id' });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Trainstation is currently closed for bookings");

        // Restore the original Date object after this test
        jest.restoreAllMocks();
    });

    it('should return 500 if a database error occurs', async () => {
        // Mock a database error
        User.findById.mockRejectedValue(new Error("Database error"));

        const response = await request.post('/tickets/book').send({ userId: 'user-id', trainstationId: 'station-id' });
        expect(response.status).toBe(404);
        expect(response.text).toBe("Database error");
    });
});