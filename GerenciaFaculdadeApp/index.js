// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const session = require("express-session")
const flash = require("connect-flash")

// Inicializando express
const app = express()
const registro = require("./routes/registro.js")

// Configurações
    //Sessão
        app.use(session({
            secret: "123",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    // Template Engine
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true}
        }))
        app.set('view engine', 'handlebars')
    // Body parser
        app.use(express.json());
        app.use(express.urlencoded({extended:true}))
    // Public
        app.use(express.static(path.join(__dirname, "public")))
    // Sequelize
        async function criarDB() {
            const db = require('./models/db.js')
            const Estudante = require('./models/Estudante.js')
            const Professor = require('./models/Professor.js')
            const Curso = require('./models/Curso.js')
            const Disciplina = require('./models/Disciplina.js')
            await db.sync()
        }
        criarDB()

// Rotas
app.get('/', (req,res)=>{
    res.redirect("/registro")
})

app.use('/registro', registro)

// Inicializando servidor
const PORT = 8081
app.listen(PORT, ()=> {
    console.log("Servidor rodando\n");
})