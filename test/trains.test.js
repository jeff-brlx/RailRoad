// Fichier: train.controller.test.js
const { updateTrain } = require('../controllers/trains.controllers');
const Train = require('../models/trains.models');
const Trainstation = require('../models/trainstations.models');
const httpMocks = require('node-mocks-http');

jest.mock('../models/trains.models');
jest.mock('../models/trainstations.models');

describe('updateTrain', () => {
    it('should update the train successfully', async () => {
        const req = httpMocks.createRequest({
            params: { id: 'trainId' },
            body: { start_station: 'Paris', end_station: 'Lyon' }
        });
        const res = httpMocks.createResponse();
        Trainstation.findOne.mockResolvedValue({ name: 'Paris' });
        Trainstation.findOne.mockResolvedValueOnce({ name: 'Lyon' });
        Train.findByIdAndUpdate.mockResolvedValue({ name: 'Train A' });

        await updateTrain(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe('Train updated successfully');
    });

    it("should return 404 if the start station doesn't exist", async () => {
        const req = httpMocks.createRequest({
            params: { id: 'trainId' },
            body: { start_station: 'NonExistingStation' }
        });
        const res = httpMocks.createResponse();
        Trainstation.findOne.mockResolvedValue(null);

        await updateTrain(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getData()).toBe("Start station doesn't exist");
    });

    it("should return 404 if the end station doesn't exist", async () => {
        const req = httpMocks.createRequest({
            params: { id: 'trainId' },
            body: { end_station: 'NonExistingStation' }
        });
        const res = httpMocks.createResponse();
        // Trainstation.findOne.mockResolvedValueOnce({ name: 'Paris' });
        Trainstation.findOne.mockResolvedValueOnce(null);

        await updateTrain(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getData()).toBe("End station doesn't exist");
    });

    it("should return 404 if the train doesn't exist", async () => {
        const req = httpMocks.createRequest({
            params: { id: 'nonExistentTrainId' },
            body: { start_station: 'Paris' }
        });
        const res = httpMocks.createResponse();
        Trainstation.findOne.mockResolvedValue({ name: 'Paris' });
        Train.findByIdAndUpdate.mockResolvedValue(null);

        await updateTrain(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getData()).toBe("Train not found");
    });
});
