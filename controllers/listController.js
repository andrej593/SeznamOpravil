var ListModel = require('../models/listModel.js');

module.exports = {
    getAllLists: function (req, res) {
        ListModel.find(function (err, lists) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list.',
                    error: err
                });
            }
            return res.json(lists);
        });
    },

    getList: function (req, res) {
        let id = req.params.id;
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list.',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            return res.json(list);
        });
    },

    createList: function (req, res) {
        console.log(req.body);
        let listTasks = req.body.listTasks;
        let listListOfTags = req.body.listListOfTags;
        var list = new ListModel({
			listName : req.body.listName,
            listDesc : req.body.listDesc,
			listCreated : req.body.listCreated,
            listTasks : listTasks,
            listStatus : req.body.listStatus,
            listListOfTags : listListOfTags
        });
        list.save(function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating list',
                    error: err
                });
            }
            return res.status(201).json(list);
        });
    },

    updateList: function (req, res) {
        let id = req.params.id;
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            list.listName = req.body.listName ? req.body.listName : list.listName;
            list.listDesc = req.body.listDesc ? req.body.listDesc : list.listDesc;
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(list);
            });
        });
    },

    removeList: function (req, res) {
        let id = req.params.id;
        ListModel.findByIdAndRemove(id, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the list.',
                    error: err
                });
            }
            return res.status(204).json({message:"Removed"});
        });
    },
    
    changeListStatus: function (req, res) {
        let id = req.params.id;
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            list.changeListStatus();
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(list);
            });
        });
    },

    addListTag: function (req, res) {
        let id = req.params.id;
        let tag = req.body.tag; 
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            let mytag = list.addListTag(tag);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(mytag);
            });
        });
    },

    deleteListTag: function (req, res) {
        let id = req.params.id;
        let idT2 = req.params.idT2 
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            list.deleteListTag(idT2);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json({message:"Removed"});
            });
        });
    },
/*
    changeListTag: function (req, res) {
        var id = req.params.id;
        var tag = req.body.tag; 
        var newtag = req.body.newtag; 
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            list.changeListTag(tag, newtag);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(list);
            });
        });
    },
    
    changeTaskTag: function (req, res) {
        var id = req.params.id;
        var idT = req.params.idT;
        var tag = req.body.tag; 
        var newtag = req.body.newtag; 
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            list.changeTaskTag(idT, tag, newtag);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(list);
            });
        });
    },
*/
    //TASKS START HERE

    addTask: function (req, res) {
        let id = req.params.id;
    
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            } 
            let task = list.addTask(req.body);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(task);
            });
        });
    },

    updateTask: function (req, res) {
        let id = req.params.id;
        let idT = req.params.idT;
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            } 
            let task = list.updateTask(idT, req.body);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(task);
            });
        });
    },

    deleteTask: function (req, res) {
        let id = req.params.id;
        let idT = req.params.idT;
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            list.deleteTask(idT);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json({message:"Removed"});
            });
        });
    },

    changeTaskStatus: function (req, res) {
        let id = req.params.id;
        let idT = req.params.idT;
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            let task = list.changeTaskStatus(idT);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(task);
            });
        });
    },

    addTaskTag: function (req, res) {
        let id = req.params.id;
        let idT = req.params.idT;
        let tag = req.body.tag; 
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            let mytag = list.addTaskTag(idT, tag);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(mytag);
            });
        });
    },

    deleteTaskTag: function (req, res) {
        let id = req.params.id;
        let idT = req.params.idT;
        let idT2 = req.params.idT2;
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            list.deleteTaskTag(idT,idT2);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json({message:"Removed"});
            });
        });
    },

    changeTaskWarnDate: function (req, res) {
        let id = req.params.id;
        let idT = req.params.idT;
        let date = req.body.taskDateWarn; 
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            let task = list.changeTaskWarnDate(idT, date);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(task);
            });
        });
    },

    changeTaskEndDate: function (req, res) {
        let id = req.params.id;
        let idT = req.params.idT;
        let date = req.body.taskDateEnd; 
        ListModel.findOne({_id: id}, function (err, list) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list',
                    error: err
                });
            }
            if (!list) {
                return res.status(404).json({
                    message: 'No such list'
                });
            }
            let task = list.changeTaskEndDate(idT, date);
            list.save(function (err, list) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating list.',
                        error: err
                    });
                }
                return res.json(task);
            });
        });
    }
};
