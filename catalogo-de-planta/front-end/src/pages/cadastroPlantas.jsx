import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import '../assets/styles/cadastroPlanta.css';

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
    image: null,
  });

  const imagePreview = form.image
    ? URL.createObjectURL(form.image)
    : null;

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

    const plantData = new FormData();

    plantData.append("nome_comum", form.name);
    plantData.append("nome_genero", form.genero);
    plantData.append("descricao", form.description);
    plantData.append("id_usuario", user?.id || 1);

    if (form.image) {
      plantData.append("imagem", form.image);
    }

axios.post(`${apiUrl}/plants`, plantData);

    axios.post(`${apiUrl}/plants`, plantData)

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

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setForm(prev => ({
      ...prev,
      image: file
    }));
  }


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
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                disabled={loading}
              />

              <div className="image-preview">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview da planta"
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
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
