const mongoose = require('mongoose');

var citaSchema = new mongoose.Schema({
    
    empleado: {
        type: String,
        required: 'This field is required.'
    },
    persona: {
        type: String,
        required: 'This field is required.'
    },
    fecha: {
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

mongoose.model('cita', citaSchema);