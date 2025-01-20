const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    const {title, description, priority, dueDate, status} = req.body;
    
    try {
        const newTask = new Task({
            title,
            description, 
            priority, 
            dueDate, 
            status, 
            owner:req.user.id,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch(err) {
        res.status(500).json({ message: 'Erreur lors de la création de la tâche', error: err.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id });
        res.json(tasks);
    } catch(err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    const { title, description, priority, dueDate, status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: 'Tâche introuvable' });
        if(task.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;
        
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: 'Tâche introuvable' });
        if(task.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });
        
        await task.deleteOne();
        res.json({ message: 'Tâche supprimée avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error: err.message });
    }
};