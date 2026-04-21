const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // এক ইমেইল দিয়ে দুইবার খোলা যাবে না
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);