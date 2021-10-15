const mongoose = require('mongoose');

var notaSchema = new mongoose.Schema({
    
    titulo: {
        type: String,
        required: 'This field is required.'
    },
    nota: {
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

mongoose.model('nota', notaSchema);