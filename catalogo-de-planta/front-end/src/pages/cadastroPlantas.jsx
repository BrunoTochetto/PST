import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "../assets/styles/cadastroPlanta.css";

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

  const [location, setLocation] = useState(null);

  const imagePreview = form.image
    ? URL.createObjectURL(form.image)
    : null;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY_MAPS,
  });

  const [mapCenter] = useState({
    lat: -23.55,
    lng: -46.63,
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

  function handleMapClick(e) {
    if (!e.latLng) return;

    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!location) {
      setError("Selecione um local no mapa");
      return;
    }

    setLoading(true);
    setError("");

    const plantData = new FormData();

    plantData.append("nome_comum", form.name);
    plantData.append("nome_genero", form.genero);
    plantData.append("descricao", form.description);
    plantData.append("id_usuario", user?.id || 1);

    plantData.append("latitude", location.lat);
    plantData.append("longitude", location.lng);

    if (form.image) {
      plantData.append("imagem", form.image);
    }

    try {
      const response = await axios.post(`${apiUrl}/plants`, plantData);

      console.log("Planta cadastrada com sucesso:", response.data);

      navigate("/maps");
    } catch (err) {
      console.error("Erro ao cadastrar planta:", err);

      setError(
        err.response?.data?.error || "Erro ao cadastrar planta"
      );

      setLoading(false);
    }
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

            <div>
              <label>Local da planta</label>

              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "300px"
                  }}
                  center={mapCenter}
                  zoom={10}
                  onClick={handleMapClick}
                >
                  {location && (
                    <Marker
                      position={{
                        lat: location.lat,
                        lng: location.lng
                      }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <p>Loading map...</p>
              )}

              {location && (
                <p>
                  Local selecionado: {location.lat}, {location.lng}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
