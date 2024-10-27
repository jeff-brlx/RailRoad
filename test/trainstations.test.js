// Fichier: trainstation.controller.test.js
const { deleteTrainstation } = require('../controllers/trainstations.controllers');
const Trainstation = require('../models/trainstations.models');
const Train = require('../models/trains.models');
const Ticket = require('../models/tickets.models');
const httpMocks = require('node-mocks-http');

jest.mock('../models/trainstations.models');
jest.mock('../models/trains.models');
jest.mock('../models/tickets.models');

describe('deleteTrainstation', () => {
    it('should delete the trainstation and update related trains and tickets', async () => {
        const req = httpMocks.createRequest({ params: { id: 'trainstationId' } });
        const res = httpMocks.createResponse();
        const trainstation = { _id: 'trainstationId', name: 'Old Station' };

        Trainstation.findByIdAndUpdate.mockResolvedValue(trainstation);
        Train.updateMany.mockResolvedValue({ nModified: 1 });
        Ticket.updateMany.mockResolvedValue({ nModified: 1 });

        await deleteTrainstation(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe("Trainstation deleted");
    });

    it("should return 404 if the trainstation doesn't exist", async () => {
        const req = httpMocks.createRequest({ params: { id: 'nonExistentStationId' } });
        const res = httpMocks.createResponse();

        Trainstation.findByIdAndUpdate.mockResolvedValue(null);

        await deleteTrainstation(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getData()).toBe("Trainstation not found");
    });
});
