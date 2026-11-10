import { useState, useEffect } from "react";
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
    description: "",
    image: null,
  });

  const [location, setLocation] = useState(null);

  const imagePreview = form.image
    ? URL.createObjectURL(form.image)
    : null;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY_MAPS || "",
  });

  // Padrão na região das plantas cadastradas (Santa Catarina)
  const [mapCenter, setMapCenter] = useState({
    lat: -27.0086,
    lng: -51.1517,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Mantém o centro padrão caso o usuário negue a localização
        }
      );
    }
  }, []);

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

    if (!form.image) {
      setError("Selecione uma imagem para a planta");
      return;
    }

    if (!location) {
      setError("Selecione a localização da planta clicando no mapa");
      return;
    }

    setLoading(true);
    setError("");

    const plantData = new FormData();
    plantData.append("nome_comum", form.name);
    plantData.append("nome_genero", form.genero);
    plantData.append("descricao", form.description);
    plantData.append("id_usuario", user?.id || "");
    plantData.append("latitude", location.lat);
    plantData.append("longitude", location.lng);
    plantData.append("imagem", form.image);

    try {
      // Criação da planta e do marcador no backend (autenticado)
      const response = await axios.post(`${apiUrl}/plants`, plantData);
      const plantaCriada = response.data;

      // Garante criação do marcador caso o backend não o tenha inserido diretamente
      await axios.post(`${apiUrl}/markers`, {
        id_planta: plantaCriada.id,
        latitude: location.lat,
        longitude: location.lng,
      });

      console.log("Planta e marcador cadastrados com sucesso:", plantaCriada);

      // Redireciona para o mapa focando na planta cadastrada
      navigate(`/maps?id=${plantaCriada.id}`);
      
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

          {error && <div className="error-message" style={{ color: "#d93025", marginBottom: "15px", fontWeight: "bold" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="plant-form-wrapper">
            <div className="plant-image-section">
              <label htmlFor="image">Foto da planta:</label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                disabled={loading}
                required
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
                  placeholder="Ex: Ipê Amarelo"
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
                  placeholder="Ex: Handroanthus"
                  value={form.genero}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Descrição da planta, características, etc."
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                Local da planta (clique no mapa para marcar a posição)
              </label>

              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "350px",
                    borderRadius: "14px"
                  }}
                  center={location || mapCenter}
                  zoom={12}
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
                <p>Carregando mapa...</p>
              )}

              {location && (
                <p style={{ marginTop: "8px", color: "#246302", fontWeight: 600 }}>
                  Local selecionado: Lat {location.lat.toFixed(6)}, Lng {location.lng.toFixed(6)}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              style={{ gridColumn: "1 / -1" }}
            >
              {loading ? "Salvando..." : "Salvar Planta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
