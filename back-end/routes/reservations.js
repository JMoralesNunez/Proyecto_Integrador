const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservations');

router.get('/', reservationsController.getAllReservations);
router.get('/numberReservations', reservationsController.getNumberReservations);
router.get('/:id', reservationsController.getReservationById);
router.post('/', reservationsController.createReservation);
router.put('/:id', reservationsController.updateReservation);
router.delete('/:id', reservationsController.deleteReservation);

module.exports = router;