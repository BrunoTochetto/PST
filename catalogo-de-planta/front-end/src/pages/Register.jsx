import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/cadastro.css";

export default function Register() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cep: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/users`, {
        nome: form.nome,
        email: form.email,
        cep: form.cep,
        senha: form.senha
      });

      const data = response.data;

      if (data.user && data.token) {
        login(data.user, data.token);
        alert("Conta criada com sucesso!");
        navigate("/catalogo");
      } else {
        alert("Conta criada com sucesso! Faça login para continuar.");
        navigate("/login");
      }

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erro ao cadastrar usuário";
      alert(errorMsg);
      console.error("Erro no cadastro:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => navigate(-1)} className="btnVoltar">
        ← 
      </button>

      <div className="box">
        <div className="register-container">
          <div className="register-box">
            <h1>Cadastro</h1>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
                disabled={loading}
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />

              <input
                type="text"
                placeholder="CEP (ex: 89700-000)"
                value={form.cep}
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
                disabled={loading}
              />

              <input
                type="password"
                placeholder="Senha"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                required
                disabled={loading}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>

            <div className="login-footer" style={{ marginTop: "2vh" }}>
              <p>Já tem uma conta?</p>
              <Link to="/login" style={{ color: "#246302", fontWeight: 600 }}>Entrar</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
