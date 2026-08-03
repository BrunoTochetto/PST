import { useState } from "react";
import Header from "./widgets/Header";
import "../assets/styles/cadastro.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function Register() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [form, setForm] = useState({
        nome: "",
        email: "",
        profissao: "",
        cidade: "",
        senha: "",
    });

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${apiUrl}/users`, {

                /*
                antes a resposta buscava do port direto do banco, tem q ser o do back
                */

                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Erro ao cadastrar");

            const data = await res.json();

            // salva usuário como logado
            localStorage.setItem("user", JSON.stringify(data));

            alert("Usuário criado!");

            setForm({
                nome: "",
                email: "",
                profissao: "",
                cidade: "",
                senha: "",
            });

            // redireciona pra home (ou mapa, ou catálogo)
            navigate("/catalogo");

        } catch (err) {
            console.error(err);
        }}

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
                    placeholder="Nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />

                    <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />

                    <input
                    type="text"
                    placeholder="Profissão"
                    value={form.profissao}
                    onChange={(e) => setForm({ ...form, profissao: e.target.value })}
                    />

                    <input
                    type="text"
                    placeholder="Cidade"
                    value={form.cidade}
                    onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                    />

                    <input
                    type="password"
                    placeholder="Senha"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    />

                    <button type="submit">Cadastrar</button>
                </form>
                </div>
            </div>
        </div>
        </>
        )
    }
