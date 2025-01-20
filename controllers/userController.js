const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'Utilisateur enregistré ' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Impossible de trouver cet utilisateur' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Identifiants invalides' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({token, user: { id: user._id, username: user.username, email: user.email }});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};
