import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/login.css";

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  const [form, setForm] = useState({
    email: "",
    senha: ""
  });

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${apiUrl}/users/validate`, {
        email: form.email,
        senha: form.senha
      });

      if (data.valid && data.user) {
        login(data.user);
        navigate("/");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erro ao fazer login";
      alert(errorMsg);
      console.error("Erro ao conectar com backend:", error);
    }

  }

  return (
 <div className="box">

    <button onClick={() => navigate(-1)} className="btnVoltar">
        ← 
    </button>
  <div className="login-container">
    <div className="login-box">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          required
        />

        <button type="submit">Entrar</button>
      </form>

      <div className="login-footer">
        <p>Não tem uma conta?</p>
        <Link to="/register">Cadastre-se</Link>
      </div>
    </div>
  </div>
  </div>
);
}
