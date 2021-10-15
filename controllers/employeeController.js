const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Cli = require('../models/employee.model.js');
const Employee = mongoose.model('clientes');
const { ensureAuth } = require('../middleware/auth')


router.get('/',  ensureAuth,(req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insertar Cliente"
    });
});

router.post('/',  ensureAuth,(req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var employee = new Employee();
    employee.user = req.user.id;
    employee.empresa = req.body.empresa;
    employee.persona = req.body.persona;
    employee.puesto = req.body.puesto;
    employee.telefono = req.body.telefono;
    employee.correo = req.body.correo;
    employee.date = req.body.date;
    
    
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insertar Cliente",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Actualizar Cliente',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}



router.get('/list',  ensureAuth,(req, res) => {
    Employee.find({ user: req.user.id },(err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving cliente list :' + err);
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
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Actualizar Cliente",
                employee: doc
            });
        }
    }).lean();
});

router.get('/delete/:id',  ensureAuth,(req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in Cliente delete :' + err); }
    });
});

module.exports = router;