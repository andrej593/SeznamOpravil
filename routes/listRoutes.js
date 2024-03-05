var express = require('express');
var router = express.Router();
var listController = require('../controllers/listController.js');

//STORITVE ROUTES

//LIST

router.get('/', listController.getAllLists);
router.get('/:id', listController.getList);
//{listSchemaJson}
router.post('/', listController.createList);
router.delete('/:id', listController.removeList);
//{"listName":"","listDesc":""}
router.put('/:id', listController.updateList);
//flips bool
router.put('/changeListStatus/:id', listController.changeListStatus);
//{"tag":""}
router.put('/addListTag/:id', listController.addListTag);
//{"tag":"toBeRemovedTag"}
router.put('/deleteListTag/:id/:idT2', listController.deleteListTag);
//{"tag":"oldTag","newTag":"newTag"}
//router.put('/changeListTag/:id', listController.changeListTag);

//TASKS

//{taskSchemaJson}
router.put('/updateTask/:id/:idT', listController.updateTask);
router.put('/addTask/:id', listController.addTask);
router.put('/deleteTask/:id/:idT', listController.deleteTask);
//flips bool
router.put('/changeTaskStatus/:id/:idT', listController.changeTaskStatus);
//{"tag":"newTag"}
router.put('/addTaskTag/:id/:idT', listController.addTaskTag);
//{"tag":"toBeRemovedTag"}
router.put('/deleteTaskTag/:id/:idT/:idT2', listController.deleteTaskTag);
//{"tag":"oldTag","newTag":"newTag"}
//router.put('/changeTaskTag/:id/:idT', listController.changeTaskTag);
//{"date":"newDate"}
router.put('/changeTaskWarnDate/:id/:idT', listController.changeTaskWarnDate);
//{"date":"newDate"}
router.put('/changeTaskEndDate/:id/:idT', listController.changeTaskEndDate);


//RENDER ROUTES

module.exports = router;
