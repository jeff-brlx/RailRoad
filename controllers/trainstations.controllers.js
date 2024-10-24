const Trainstation = require('../models/trainstations.models');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const listTrainstations = async(req,res)=>{
    try{
        const trainList = await Trainstation.find().sort({ name: 1 });
        if(trainList.length >0){
            return res.status(200).send({message: "Trains founded : ", trainList})
        }else{
            return res.status(201).send("No trainStation found")
        }
    }catch(error){
        return res.status(400).send(error.message)
    }
}
const readTrainstation = async(req,res)=>{
    try{
        const trainId = req.params.id;
        const trainStation = await Trainstation.findById(trainId)
        if(trainStation){
            return res.status(200).send(trainStation)
        }else{
            return res.status(201).send("Error encountered , please verify your request and try again ")
        }
    }catch(error){
        return res.status(400).send(error.message)
    }

}
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

            // Supprimer le fichier original non redimensionné
            fs.unlinkSync(file.path);
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
        return res.status(400).send(error.message)
    }


}
const updateTrainstation = async(req,res)=>{
    const { name , open_hour , close_hour } = req.body
    const file = req.file
    try{
        const trainstation = await Trainstation.findByIdAndUpdate(req.params.id ,req.body, { new: true });
        if (!trainstation) {
            return res.status(400).send("Trainstation not found");
        }
        // Mise à jour des données
        trainstation.name = name || trainstation.name;
        trainstation.open_hour = open_hour || trainstation.open_hour;
        trainstation.close_hour = close_hour || trainstation.close_hour;

        // Mise à jour de l'image si un nouveau fichier est fourni
        if (file) {
            const outputPath = path.join('uploads', `resized-${Date.now()}-${file.originalname}`);
            await sharp(file.path)
                .resize(200, 200)
                .toFile(outputPath);
            trainstation.image = outputPath;

            // Supprimer l'ancienne image et le fichier temporaire
            fs.unlinkSync(file.path);
        }

        await trainstation.save();
        res.status(200).send("Trainstation updated")
    }catch(error){
        return res.status(400).send(error.message)
    }
}
const deleteTrainstation = async(req,res)=>{
    const trainstation = await Trainstation.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true });
    try {
        if (!trainstation) {
            return res.status(404).send("Trainstation not found");
        }
        res.status(200).send("Trainstation deleted")
    }catch(error){
        return res.status(400).send(error.message);
    }
}

module.exports={
    listTrainstations,
    readTrainstation,
    createTrainstation,
    updateTrainstation,
    deleteTrainstation
}