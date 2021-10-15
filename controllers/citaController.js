const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/cita.model.js');
const Cita = mongoose.model('cita');
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth,(req, res) => {
    res.render("cita/addOrEdit", {
        viewTitle: "Crear CIta"
    });
});

router.post('/', ensureAuth,(req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var cita = new Cita();
    cita.user = req.user.id;
    cita.empleado = req.body.empleado;
    cita.persona = req.body.persona;
    cita.fecha = req.body.fecha;
    
    
    cita.save((err, doc) => {
        if (!err)
            res.redirect('cita/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("cita/addOrEdit", {
                    viewTitle: "Insertar Cita",
                    cita: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Cita.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('cita/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("cita/addOrEdit", {
                    viewTitle: 'Actualizar Cita',
                    cita: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}



router.get('/list', ensureAuth,(req, res) => {
    Cita.find({ user: req.user.id },(err, docs) => {
        if (!err) {
            res.render("cita/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving cita list :' + err);
        }
    }).lean();
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', ensureAuth,(req, res) => {
    Cita.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("cita/addOrEdit", {
                viewTitle: "Actualizar cita",
                cita: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', ensureAuth,(req, res) => {
    Cita.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/cita/list');
        }
        else { console.log('Error in cita delete :' + err); }
    });
});

module.exports = router;