var express = require('express');
var router = express.Router();

const {Acceder_Login} = require('../middleware/login_middleware');



/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('Vista_Login/Login',{mensaje:null});


});

router.get('/principal',function(req,res,next){


  if (!req.session.usu) {
    return res.redirect('/');  // Redirige a la página de login si no está autenticado
  }

  res.render('Vista_Menu/Principal');

});


router.post('/', Acceder_Login , (req,res) =>{

  

  res.redirect('/principal');

  

});











module.exports = router;
