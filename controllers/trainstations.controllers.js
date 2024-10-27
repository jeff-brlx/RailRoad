const Trainstation = require('../models/trainstations.models');
const Train = require('../models/trains.models');
const Ticket = require('../models/tickets.models');

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// List all train stations and filter by tag
const listTrainstations = async(req,res)=>{
    try{
        const trainList = await Trainstation.find().sort({ name: 1 });
        if(trainList.length >0){
            return res.status(200).send({message: "Trainstation found : ", trainList})
        }else{
            return res.status(201).send("No trainstation found")
        }
    }catch(error){
        return res.status(404).send(error.message)
    }
}
// Get a trainstation detail
const readTrainstation = async(req,res)=>{
    try{
        const trainstationId = req.params.id;
        const trainStation = await Trainstation.findById(trainstationId)
        if(trainStation){
            return res.status(200).send({message:"Trainstation found :",trainStation})
        }else{
            return res.status(201).send("Error encountered , please verify your request and try again ")
        }
    }catch(error){
        return res.status(404).send(error.message)
    }

}

// Create a new train station
const createTrainstation = async(req,res)=>{
    const { name , open_hour , close_hour } = req.body
    const file = req.file

    try {
        const existingTrainStation = await Trainstation.findOne({name})
        if (existingTrainStation) {
            return res.status(400).send("Trainstation already exist")
        }
        // Redimensionner l'image si elle est fournie
        let imagePath = "";
        if (file) {
            const outputPath = path.join('uploads', `resized-${Date.now()}-${file.originalname}`);
            await sharp(file.path)
                .resize(200, 200)
                .toFile(outputPath);
            imagePath = outputPath;

            // // Supprimer le fichier original non redimensionné
            // fs.unlinkSync(file.path);
        }

        const newTrainStation = new Trainstation({
            name,
            open_hour,
            close_hour,
            image: imagePath
        });

        await newTrainStation.save();
        res.status(201).send({message :"Trainstation created successfully" , newTrainStation});
    }catch(error){
        // if (error.code === 'LIMIT_FILE_SIZE') {
        //     return res.status(400).send({
        //         message: "File too Large . Please choose a lighter picture"
        //     })
        // }
        return res.status(404).send(error.message)
    }


}

// Update a train station
const updateTrainstation = async(req,res)=>{
    const { name , open_hour , close_hour, status } = req.body

    const file = req.file
    try{
        const trainstation = await Trainstation.findByIdAndUpdate(req.params.id ,req.body, { new: true });
        if (!trainstation) {
            return res.status(400).send("Trainstation not found");
        }
        // Update data
        trainstation.name = name || trainstation.name;
        trainstation.open_hour = open_hour || trainstation.open_hour;
        trainstation.close_hour = close_hour || trainstation.close_hour;
        trainstation.status = status || trainstation.status;

        // Update the image if a new one is put
        if (file) {
            const outputPath = path.join('uploads', `resized-${Date.now()}-${file.originalname}`);
            await sharp(file.path)
                .resize(200, 200)
                .toFile(outputPath);
            trainstation.image = outputPath;

            // Suppress the old one
            fs.unlinkSync(file.path);
        }

        await trainstation.save();
        res.status(200).send("Trainstation updated")
    }catch(error){
        return res.status(404).send(error.message)
    }
}

// Delete a train station
const deleteTrainstation = async(req,res)=>{
    const trainstation = await Trainstation.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true });
    try {
        if (!trainstation) {
            return res.status(404).send("Trainstation not found");
        }
        res.status(200).send("Trainstation deleted")
        await Train.updateMany({ start_station: trainstation.name }, { status: "Canceled" });
        await Train.updateMany({ end_station: trainstation.name }, { status: "Canceled" });
        await Ticket.updateMany({ trainstationId: trainstation.id }, { status: "Canceled" });

    }catch(error){
        return res.status(404).send(error.message);
    }
}

module.exports={
    listTrainstations,
    readTrainstation,
    createTrainstation,
    updateTrainstation,
    deleteTrainstation
}