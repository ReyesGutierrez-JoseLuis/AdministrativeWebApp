const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    empresa: {
        type: String,
        required: 'This field is required.'
    },
    persona: {
        type: String,
        required: 'This field is required.'
    },
    puesto: {
        type: String,
        required: 'This field is required.'
    },
    telefono: {
        type: String,
        required: 'This field is required.'
    },
    correo: {
        type: String,
        required: 'This field is required.'
    },user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
});

// Custom validation for email

mongoose.model('clientes', employeeSchema);