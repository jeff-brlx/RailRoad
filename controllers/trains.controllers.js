const Train = require('../models/trains.models');

// List all trains
const listTrains = async (req, res) => {
    const { start_station, end_station, date, limit = 10 } = req.query;
    try {
        const filters = {};
        if (start_station) {
            filters.start_station = start_station}
        if (end_station) {
            filters.end_station = end_station}
        if (date) {
            filters.time_of_departure = { $date: date }
        }
        const trains = await Train.find(filters).limit(limit)
        if(trains.length>0){

            res.status(200).send(trains);
        }else{
            res.status(201).send("No train found");
        }
    } catch (error) {
        console.error('Error listing trains:', error);
        // res.status(500).send("Server error: " + (error.message || error));
    }
};

// Create a new train
const createTrain = async (req, res) => {
    const { name, start_station, end_station, time_of_departure } = req.body;
    try {
        const existingTrain = await Train.findOne({name});
        if (existingTrain) {
            console.log("ouiii");
            return res.status(409).send("Train already exist");
        }
        const newTrain = new Train({ name, start_station, end_station, time_of_departure });
        await newTrain.save();
        res.status(200).send("New train created");
    } catch (error) {
        console.error('Error creating train:', error);
        // res.status(500).send("Server error: " + (error.message || error));
    }
};

// Get a specific train by ID
const getTrainById = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (!train) {
            return res.status(404).send("Train not found");
        }
        res.status(200).send(train);
    } catch (error) {
        console.error('Error fetching train by ID:', error);
        // res.status(500).send("Server error: " + (error.message || error));
    }
};

// Update a train
const updateTrain = async (req, res) => {
    try {
        const train = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!train) {
            return res.status(404).send("Train not found");
        }
        res.status(200).send("Train updated successfully");
    } catch (error) {
        console.error('Error updating train:', error);
        // res.status(500).send("Server error: " + (error.message || error));
    }
};

// Delete a train
const deleteTrain = async (req, res) => {
    try {
        const train = await Train.findByIdAndDelete(req.params.id);
        if (!train) {
            return res.status(404).send("Train not found");
        }
        res.status(200).send("Train deleted successfully");
    } catch (error) {
        console.error('Error deleting train:', error);
        // res.status(500).send("Server error: " + (error.message || error));
    }
};

module.exports = {
    listTrains,
    createTrain,
    getTrainById,
    updateTrain,
    deleteTrain
};
