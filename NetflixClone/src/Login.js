import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Login() {
  const [response, setResponse] = useState(0);
  const [email, setEmail] = useState(0);
  const [senha, setSenha] = useState(0);
  const navigate = useNavigate();

  let onChangeEmail = (e) => {
    setEmail(e.target.value)
    console.log(email)
  }

  let onChangeSenha = (e) => {
    setSenha(e.target.value)
    console.log(senha)
  }


  let entrar = () => {
    axios.post("http://localhost:8080/login", 
    {
        "email": email,
        "senha": senha
    
    }
  ).then(resp => {
    
    
    if(resp?.data?.sessionID){
      sessionStorage.setItem("sessionID", resp.data.sessionID)
      
      //redireciona o navegador para a home no netflix
      navigate('home');

    }

    }).catch(error => {    
        console.log(error)
    });
  } 

  return (
    <div className="App">
      <header className="App-header">
          <label>Email:</label> <input onChange={onChangeEmail}></input>
          <label>Senha:</label> <input onChange={onChangeSenha}></input>

          <button onClick={entrar}>Entrar</button>


          { response?.data }
      
      </header>
    </div>
  );
}

export default Login;
