import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { createPortal } from "react-dom";
import logo from "../assets/images/logo (3).png";
import "../assets/styles/maps.css";

export default function Maps() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [markers, setMarkers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [selected, setSelected] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [clickedPosition, setClickedPosition] = useState(null);

  const { isLoggedIn } = useAuth();
  // const navigate = useNavigate();

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.API_KEY_MAPS,
	});

  const [center, setCenter] = useState({
    lat: -23.55,
    lng: -46.63,
  });

  // Pega a localização atual e coloca como centro, só pra não aparecer em são paulo...
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        }
      );
    }
  }, []);



  //LOAD DATA
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
          lat: m.latitude,
          lng: m.longitude,
          plant: plantsMap[m.id_planta],
        }));

        setMarkers(formatted);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    loadData();
  }, []);

  // CLICK MAP → OPEN MODAL (ONLY FOR LOGGED IN USERS)
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

  // CREATE MARKER
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

      setMarkers((prev) => [
        ...prev,
        {
          id: res.data.id,
          lat: res.data.latitude,
          lng: res.data.longitude,
          plant,
        },
      ]);

      setShowModal(false);
      setClickedPosition(null);
    } catch (err) {
      console.error("Erro ao criar marcador:", err);
    }
  };

  //  DELETE MARKER
  function handleDelete(id) {
    axios
      .delete(`${apiUrl}/markers/${id}`)
      .then(() => {
        setMarkers((prev) => prev.filter((m) => m.id !== id));
        setSelected(null);
      })
      .catch((err) => console.error("Erro ao deletar:", err));
  }

  return (
    <div className="map-container">
      {/* MAP */}
			{isLoaded ? (
				<GoogleMap
					mapContainerStyle={{ width: "100%", height: "100%" }}
					center={center}
					zoom={10}
					onClick={handleMapClick}
				>
					{markers.map((marker) => (
						<Marker
							key={marker.id}
							position={{ lat: marker.lat, lng: marker.lng }}
							onClick={() => setSelected(marker)}
						/>
					))}
				</GoogleMap>
			) : (
				<p>Loading map...</p>
			)}

      {/* SIDEBAR */}
      <div className="sidebar">
        <Link to="/catalogo" className="back-btn">
          ← Catálogo
        </Link>

        {selected ? (
          <>
            {selected.plant && (
              <div className="plant-details">
                <img
                  src={selected.plant.imagem_url || logo}
                  alt={selected.plant.nome_comum}
                />
                <h2>{selected.plant.nome_comum}</h2>
                <p>{selected.plant.descricao}</p>

                <Link to={`/catalogo?id=${selected.plant.id}`}>
                  Ver mais
                </Link>

                {isLoggedIn && (
                  <button onClick={() => handleDelete(selected.id)}>
                    Excluir marcador
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <p>Selecione um marcador</p>
        )}
      </div>

      {/* SEARCH */}
      {/* <div className="search-box">
        <input type="text" placeholder="Buscar..." />
      </div> */}

      {/* ADD BUTTON (UNCHANGED as requested) */}
      <Link to="/cadastrar-planta" className="add-btn">
        +
      </Link>

      {/* MODAL */}
			{showModal &&
				createPortal(
					<div className="modal">
						<div className="modal-content">
							<h2>Selecione uma planta</h2>

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
