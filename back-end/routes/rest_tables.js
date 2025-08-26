const express = require('express');
const router = express.Router();
const rest_tablesController = require('../controllers/rest_tables');

router.get('/', rest_tablesController.getAllTables);
router.get('/:id', rest_tablesController.getTableById);
router.post('/', rest_tablesController.createTable);
router.put('/:id', rest_tablesController.updateTable);
router.delete('/:id', rest_tablesController.deleteTable);

module.exports = router;