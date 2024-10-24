const Train = require('../models/trains.models');
const Trainstation = require('../models/trainstations.models');

// List all trains
const listTrains = async (req, res) => {
    const { start_station, end_station, time_of_departure, limit = 10 } = req.query;
    try {
        const filters = {};
        if (start_station) {
            filters.start_station = start_station}
        if (end_station) {
            filters.end_station = end_station}
        if (time_of_departure) {
            filters.time_of_departure = { $gte:time_of_departure  };
        }
        const trains = await Train.find(filters).limit(limit)
        if(trains.length>0){

            res.status(200).send({message:"Trains Founded",trains});
        }else{
            res.status(201).send("No train found");
        }
    } catch (error) {
        return res.status(400).send(error.message)
    }
};

// Create a new train
const createTrain = async (req, res) => {
    const { name, start_station, end_station, time_of_departure } = req.body;
    try {
        const existingTrain = await Train.findOne({name});
        const existingStartStation = await Trainstation.findOne({name:start_station});
        const existingEndStation = await Trainstation.findOne({name:end_station});

        if (existingTrain) {
            return res.status(400).send("Train already exist");
        }
        else if(!existingStartStation){
            return res.status(404).send("Start station doesn't exist");
        }
        else if(!existingEndStation){
            return res.status(404).send("End station doesn't exist");
        }
        const newTrain = new Train({ name, start_station, end_station, time_of_departure });
        await newTrain.save();
        res.status(200).send("New train created");
    } catch (error) {
        return res.status(400).send(error.message)
    }
};

// Get a specific train by ID
const getTrainById = async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (!train) {
            return res.status(404).send("Train not found");
        }
        res.status(200).send({message:"Train founded", train});
    } catch (error) {
        return res.status(400).send(error.message)
    }
};

// Update a train
const updateTrain = async (req, res) => {
    try {
        const {  start_station, end_station } = req.body;
        if(start_station){
            const existingStartStation = await Trainstation.findOne({name:start_station});
            if(!existingStartStation){
                return res.status(404).send("Start station doesn't exist");
            }
        }
        if(end_station ){
            const existingEndStation = await Trainstation.findOne({name:end_station});
            if(!existingEndStation){
                return res.status(404).send("End station doesn't exist");
            }
        }
        const train = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!train) {
            return res.status(404).send("Train not found");
        }
        res.status(200).send("Train updated successfully");
    } catch (error) {
        return res.status(400).send(error.message)
    }
};

// Delete a train
const deleteTrain = async (req, res) => {
    try {
        const train = await Train.findByIdAndUpdate(req.params.id,{status:'deleted'}, {new:true});
        if (!train) {
            return res.status(404).send("Train not found");
        }
        res.status(200).send("Train deleted successfully");
    } catch (error) {
        return res.status(400).send(error.message)
    }
};

module.exports = {
    listTrains,
    createTrain,
    getTrainById,
    updateTrain,
    deleteTrain
};
