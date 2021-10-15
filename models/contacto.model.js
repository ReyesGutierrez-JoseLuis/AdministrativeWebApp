const mongoose = require('mongoose');

var contactoSchema = new mongoose.Schema({
    
    nombre: {
        type: String,
        required: 'This field is required.'
    },
    telefono: {
        type: String,
        required: 'This field is required.'
    },
    ocupacion: {
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

mongoose.model('contacto', contactoSchema);