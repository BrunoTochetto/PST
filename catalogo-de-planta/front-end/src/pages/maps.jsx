import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { createPortal } from "react-dom";
import logo from "../assets/images/logoWikiPlant.png";
import "../assets/styles/maps.css";

export default function Maps() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [markers, setMarkers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [selected, setSelected] = useState(null);

  const [searchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [clickedPosition, setClickedPosition] = useState(null);

  const { isLoggedIn } = useAuth();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY_MAPS || "",
  });

  // Centro padrão nas coordenadas reais das plantas (Santa Catarina)
  const [center, setCenter] = useState({
    lat: -27.0086,
    lng: -51.1517,
  });

  const mapRef = useRef(null);
  const onMapLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
  }, []);

  // Pega localização do usuário APENAS se não estiver visualizando uma planta específica
  useEffect(() => {
    const plantaId = searchParams.get("id");
    if (!plantaId && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCenter(userPos);
          if (mapRef.current) {
            mapRef.current.panTo(userPos);
          }
        },
        () => {
          // Mantém localização padrão de Santa Catarina
        }
      );
    }
  }, [searchParams]);

  // Carrega dados de plantas e marcadores
  useEffect(() => {
    async function loadData() {
      try {
        const [markersRes, plantsRes] = await Promise.all([
          axios.get(`${apiUrl}/markers`),
          axios.get(`${apiUrl}/plants`),
        ]);

        setPlants(plantsRes.data);

        const plantsMap = {};
        plantsRes.data.forEach((p) => {
          plantsMap[p.id] = p;
        });

        const formatted = markersRes.data.map((m) => ({
          id: m.id,
          lat: parseFloat(m.latitude),
          lng: parseFloat(m.longitude),
          plant: plantsMap[m.id_planta],
        }));

        setMarkers(formatted);

        // Se veio com id da planta na URL, seleciona e centraliza no mapa
        const plantaId = searchParams.get("id");
        if (plantaId) {
          const marcador = formatted.find(
            (marker) => marker.plant?.id === parseInt(plantaId)
          );

          if (marcador) {
            setSelected(marcador);
            const targetPos = {
              lat: marcador.lat,
              lng: marcador.lng,
            };
            setCenter(targetPos);
            if (mapRef.current) {
              mapRef.current.panTo(targetPos);
            }
          }
        }

      } catch (err) {
        console.error("Erro ao carregar dados do mapa:", err);
      }
    }

    loadData();
  }, [apiUrl, searchParams]);

  // Clique no mapa para abrir modal de vinculação (apenas logados)
  const handleMapClick = (e) => {
    if (!e.latLng) return;

    if (!isLoggedIn) {
      return;
    }

    setClickedPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });

    setShowModal(true);
  };

  // Cria marcador vinculado a uma planta selecionada (requisição autenticada)
  const handleSelectPlant = async (plant) => {
    try {
      const res = await axios.post(
        `${apiUrl}/markers`,
        {
          id_planta: plant.id,
          latitude: clickedPosition.lat,
          longitude: clickedPosition.lng,
        }
      );

      const novoMarcador = {
        id: res.data.id,
        lat: parseFloat(res.data.latitude),
        lng: parseFloat(res.data.longitude),
        plant,
      };

      setMarkers((prev) => [...prev, novoMarcador]);
      setSelected(novoMarcador);
      setShowModal(false);
      setClickedPosition(null);
    } catch (err) {
      console.error("Erro ao criar marcador:", err);
      alert(err.response?.data?.error || "Erro ao criar marcador.");
    }
  };

  // Exclui marcador (requisição autenticada)
  function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este marcador?")) {
      return;
    }

    axios
      .delete(`${apiUrl}/markers/${id}`)
      .then(() => {
        setMarkers((prev) => prev.filter((m) => m.id !== id));
        setSelected(null);
      })
      .catch((err) => {
        console.error("Erro ao deletar marcador:", err);
        alert(err.response?.data?.error || "Erro ao deletar marcador.");
      });
  }

  function handleMarkerClick(marker) {
    setSelected(marker);
    const pos = { lat: marker.lat, lng: marker.lng };
    setCenter(pos);
    if (mapRef.current) {
      mapRef.current.panTo(pos);
    }
  }

  return (
    <div className="map-container">
      {/* MAPA */}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {markers.map((marker) => {
            const isSelected = selected?.id === marker.id;

            return (
              <Marker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => handleMarkerClick(marker)}
                icon={{
                  url: isSelected
                    ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: isSelected
                    ? new window.google.maps.Size(48, 48)
                    : new window.google.maps.Size(32, 32),
                }}
              />
            );
          })}
        </GoogleMap>
      ) : (
        <p>Carregando mapa...</p>
      )}

      {/* BARRA LATERAL COM INFORMAÇÕES DA PLANTA */}
      <div className="sidebar">
        <Link to="/catalogo" className="back-btn">
          ← Catálogo
        </Link>

        {selected ? (
          <>
            {selected.plant ? (
              <div className="plant-details">
                <img
                  src={selected.plant.imagem_url || logo}
                  alt={selected.plant.nome_comum}
                />
                <h2>{selected.plant.nome_comum}</h2>
                <p><strong>Gênero:</strong> {selected.plant.genero || "Não informado"}</p>
                <p>{selected.plant.descricao}</p>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  Coord: {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
                </p>

                <Link to={`/catalogo?id=${selected.plant.id}`} style={{ display: "inline-block", margin: "10px 0" }}>
                  Ver mais detalhes
                </Link>

                {isLoggedIn && (
                  <button onClick={() => handleDelete(selected.id)}>
                    Excluir marcador
                  </button>
                )}
              </div>
            ) : (
              <p>Informações da planta vinculada não encontradas.</p>
            )}
          </>
        ) : (
          <p>Selecione um marcador no mapa para ver detalhes da planta.</p>
        )}
      </div>

      {/* BOTÃO ADICIONAR */}
      {isLoggedIn && (
        <Link to="/cadastrar-planta" className="add-btn" title="Cadastrar nova planta">
          +
        </Link>
      )}

      {/* MODAL PARA VINCULAR PLANTA AO CLIQUE NO MAPA */}
      {showModal &&
        createPortal(
          <div className="modal">
            <div className="modal-content">
              <h2>Selecione uma planta para este local</h2>

              <div className="plant-list">
                {plants.map((p) => (
                  <div
                    key={p.id}
                    className="plant-item"
                    onClick={() => handleSelectPlant(p)}
                  >
                    <img src={p.imagem_url || logo} alt={p.nome_comum} />
                    <div className="plant-info">
                      <p className="plant-name">{p.nome_comum}</p>
                      <p className="plant-genero">{p.genero || 'Sem gênero'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
}
