const router = require("express").Router()
const TrainstationsController = require('../controllers/trainstations.controllers')
const AuthMiddleware = require('../middlewares/auth.middleware')
const ImageMiddleware = require('../middlewares/image.middleware')

// List all trainstations
router.get('/', TrainstationsController.listTrainstations)
// Read a trainstation
router.get('/:id', TrainstationsController.readTrainstation)

// Create a trainstation ( reverifier l'exportation de " upload " avec ou sans {}
router.post('/', AuthMiddleware.verifyUserOrAdmin, ImageMiddleware.upload.single("file"),ImageMiddleware.handleUploadErrors, TrainstationsController.createTrainstation)
// Update a trainstation
router.put('/:id', AuthMiddleware.verifyUserOrAdmin,ImageMiddleware.upload.single("image"),ImageMiddleware.handleUploadErrors, TrainstationsController.updateTrainstation)
// Delete a trainstation
router.delete('/:id', AuthMiddleware.verifyUserOrAdmin, TrainstationsController.deleteTrainstation)

module.exports= router;
