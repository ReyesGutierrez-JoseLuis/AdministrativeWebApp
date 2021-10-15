const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var User = require('../models/nota.model.js');
const Nota = mongoose.model('nota');
const { ensureAuth } = require('../middleware/auth')


router.get('/', ensureAuth,(req, res) => {
    res.render("nota/addOrEdit", {
        viewTitle: "Crear Notas"
    });
});

router.post('/', ensureAuth,(req, res) => {

    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var nota = new Nota();
    nota.user = req.user.id;
    nota.titulo = req.body.titulo;
    nota.nota = req.body.nota;
    nota.fecha = req.fecha;
    


    
    nota.save((err, doc) => {
        if (!err){
            res.redirect('nota/list');
        }else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("nota/addOrEdit", {
                    viewTitle: "Insertar nota",
                    nota: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Nota.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('nota/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("nota/addOrEdit", {
                    viewTitle: 'Actualizar nota',
                    nota: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

/* router.get('/list', ensureAuth, async (req, res) => {
    try {
      const stories = await Nota.find({ user: req.user.id }).lean()
      res.render('nota/list', {
        name: req.user.firstName,
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })
 */
router.get('/list',  ensureAuth,(req, res) => {
    Nota.find({ user: req.user.id },(err, docs) => {
        if (!err) {
            res.render("nota/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving nota list :' + err);
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
    Nota.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("nota/addOrEdit", {
                viewTitle: "Actualizar nota",
                nota: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', ensureAuth,(req, res) => {
    Nota.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/nota/list');
        }
        else { console.log('Error in nota delete :' + err); }
    });
});

module.exports = router;