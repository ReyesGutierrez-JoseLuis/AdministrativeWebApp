const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/contacto.model.js');
const Contacto = mongoose.model('contacto');
const { ensureAuth } = require('../middleware/auth')


router.get('/',  ensureAuth,(req, res) => {
    res.render("contacto/addOrEdit", {
        viewTitle: "Insertar Contacto"
    });
});

router.post('/',  ensureAuth,(req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var contacto = new Contacto();
    contacto.user = req.user.id;
    contacto.nombre = req.body.nombre;
    contacto.telefono = req.body.telefono;
    contacto.ocupacion = req.body.ocupacion;
    contacto.correo = req.body.correo;
    contacto.date = req.body.date;
    
    
    contacto.save((err, doc) => {
        if (!err)
            res.redirect('contacto/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("contacto/addOrEdit", {
                    viewTitle: "Insertar Contacto",
                    contacto: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Contacto.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('contacto/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("contacto/addOrEdit", {
                    viewTitle: 'Actualizar Contacto',
                    contacto: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}



router.get('/list',  ensureAuth,(req, res) => {
    Contacto.find({ user: req.user.id },(err, docs) => {
        if (!err) {
            res.render("contacto/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving contacto list :' + err);
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

router.get('/:id',  ensureAuth,(req, res) => {
    Contacto.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("contacto/addOrEdit", {
                viewTitle: "Update contacto",
                contacto: doc
            });
        }
    }).lean();
});

router.get('/delete/:id',  ensureAuth,(req, res) => {
    Contacto.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/contacto/list');
        }
        else { console.log('Error in contacto delete :' + err); }
    });
});

module.exports = router;