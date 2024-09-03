var express = require('express')
const session = require('express-session');
var cors = require('cors')
const jwt = require("jsonwebtoken");

var app = express()
const secretKey = "your-secret-key";

const API_KEY = "e9ded15e88a1eed72cb91b20929bd3a3"
const DNS = "https://api.themoviedb.org/3"


app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }));

var dados = {
    usuarios: [
        {id: '1', nome:'alyson', email: 'alyson@gmail.com', senha: '1234', idade: '20'},      
    ]
}

const categories = [
    {
        name: "trending",
        title: "Em Alta",
        path: "/trending/all/week?api_key="+API_KEY+"&language=pt-BR",
        isLarge: true,
    },
    {
        name: "netflixOriginals",
        title: "Originais Netflix",
        path: "/discover/tv?api_key="+API_KEY+"&with_networks=213",
        isLarge: false,
    },
    {
        name: "topRated",
        title: "Populares",
        path: "/movie/top_rated?api_key="+API_KEY+"&language=pt-BR",
        isLarge: false,
    },
    {
        name: "comedy",
        title: "Comédias",
        path: "/discover/tv?api_key="+API_KEY+"&with_genres=35",
        isLarge: false,
    },  
    {
        name: "romances",
        title: "Romances",
        path: "/discover/tv?api_key="+API_KEY+"&with_genres=10749",
        isLarge: false,
    },                
    {
        name: "documentaries",
        title: "Documentários",
        path: "/discover/tv?api_key="+API_KEY+"&with_genres=99",
        isLarge: false,
    }
]

const getData = async (path) => {
    try{
        
        let URI = DNS + path
        let result = await fetch(URI)
        return result.json()    

    } catch (error){
        console.log(error)
    }
}


const generateToken = (userID) => {
    return jwt.sign({userID}, secretKey, { expiresIn: 60 * 60});
};

function verifyJWT(req, res, next){
    
    console.log('verify ', req.headers)
    let token = req.headers.authorization

    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      req.session.usuarioID = decoded.userID;
      console.log('verify: ', req.session)
      next();
    });
}

function findUserByID(userID){
    let encontrado = {}
    
    dados.usuarios.forEach((usuario)=>{
        console.log(usuario.id, userID)
        if(usuario.id==userID){
            encontrado = usuario
        }
    })
    
    return encontrado
}

app.post('/login', (req, res, next)=>{

    let logado = false
    let usuarioLogado = {}
    dados.usuarios.forEach((usuario)=>{
        if(usuario.email==req.body.email && usuario.senha==req.body.senha){
            logado = true
            usuarioLogado = usuario
        }
    })

    if(logado){
        const sessionData = req.session;
        req.session.isLogado = true;
        req.session.usuarioID = usuarioLogado.id;
        console.log('login ', req.session)
        const token = generateToken(usuarioLogado.id);
        res.send({sessionID: token})        
    }else{
        res.send('Error....')
    }
        
})

app.get('/moviesByCategory', verifyJWT, async (req, res, next) => {

    const category = categories.find(
        (element) => element.name === req.headers.category
    );

    const data = await getData(category.path);
    const sessionData = req.session;

    let usuario = findUserByID(sessionData.usuarioID);

    const filteredData = usuario.idade < 18
        ? data.filter(movie => !movie.adult)
        : data;

    res.send(filteredData);
})


app.listen(8080)