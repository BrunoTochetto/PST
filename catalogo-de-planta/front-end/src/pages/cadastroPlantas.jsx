import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import '../assets/styles/forms.css';

export default function CadastroPlanta() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    genero: "",
    especie: "",
    description: "",
    image: "",
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const plantData = {
      nome_comum: form.name,
      nome_genero: form.genero,
      descricao: form.description,
      imagem_url: form.image,
      id_usuario: user?.id || 1
    };

    axios.post(`${apiUrl}/plants`, plantData)
      .then(response => {
        console.log("Planta cadastrada com sucesso:", response.data);
        navigate("/maps");
      })
      .catch(err => {
        console.error("Erro ao cadastrar planta:", err);
        setError(err.response?.data?.error || "Erro ao cadastrar planta");
        setLoading(false);
      });
  }

  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="box">
      <button onClick={() => navigate(-1)} className="btnVoltar">
        ←
      </button>

      <div className="plant-container">
        <div className="plant-box">
          <h1>Cadastrar Planta</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="plant-form-wrapper">
            <div className="plant-image-section">
              <label htmlFor="image">URL da imagem:</label>
              
              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={form.image}
                onChange={handleChange}
                disabled={loading}
              />

              <div className="image-preview">
                {isValidImageUrl(form.image ) ? (
                  <img 
                    src={form.image} 
                    alt="Preview da planta"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = 'Imagem não encontrada';
                    }}
                  />
                ) : (
                  <span>Nenhuma imagem selecionada</span>
                )}
              </div>
            </div>

            <div className="plant-fields-section">
              <div className="form-group">
                <label htmlFor="name">Nome comum</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ex: Rosa"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="genero">Gênero</label>
                <input
                  id="genero"
                  name="genero"
                  type="text"
                  placeholder="Ex: Rosa"
                  value={form.genero}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="especie">Espécie</label>
                <input
                  id="especie"
                  name="especie"
                  type="text"
                  placeholder="Ex: Rosa damascena"
                  value={form.especie}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Descrição da planta..."
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </form>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
