const User = require('../models/User')
const passport = require("passport")


// Mostrar el formulario de registro
const renderRegisterForm =(req,res)=>{
    res.render('user/registerForm')
}

// Capturar los datos del formulario y almacenar en la BDD
const registerNewUser = async(req,res)=>{
    // Capturar los datos del body
    const{name,email,password,confirmpassword} = req.body
    // Validar todos los campos
    if (Object.values(req.body).includes("")) return res.send("Lo sentimos, debes llenar todos los campos")
    // Validar el password
    if(password != confirmpassword) return res.send("Lo sentimos, los passwords no coinciden")
    // Validar si el usuario ya esta registrado
    const userBDD = await User.findOne({email})
    // Si el usuario ya esta registrado 
    if(userBDD) return res.send("Lo sentimos, el email ya se encuentra registrado")
    // Crear una instancia del usuario
    const newUser = await new User({name,email,password,confirmpassword})
    // Encriptar el password
    newUser.password = await newUser.encrypPassword(password)
    // Guardar en BDD
    newUser.save()
    // Redirecionamiento
    res.redirect('/user/login')
}


// Mostrar el formulario del login
const renderLoginForm =(req,res)=>{
    res.render('user/loginForm')
}

// Capturar los datos del login y realizar el proceso de login en conjunto con BDD
const loginUser = passport.authenticate('local',{
    failureRedirect:'/user/login',
    successRedirect:'/portafolios'
})

// Cerrar sesion del usuario
const logoutUser =(req,res)=>{
    req.logout((err)=>{
        if (err) return res.send("Ocurrio un error") 
        res.redirect('/');
    });
}

// Exportar los metodos
module.exports={
    renderRegisterForm,
    registerNewUser,
    renderLoginForm,
    loginUser,
    logoutUser
}