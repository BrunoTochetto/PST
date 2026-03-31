import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const initialMarkers = [
  { id: 1, name: "Marker 1", lat: -23.55, lng: -46.63 },
  { id: 2, name: "Marker 2", lat: -23.56, lng: -46.64 },
];

export default function Maps() {
  const [markers, setMarkers] = useState(initialMarkers);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", lat: "", lng: "" });

  // ✅ NEW: center state
  const [center, setCenter] = useState({
    lat: -23.55,
    lng: -46.63,
  });

  const handleMapClick = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();

    // ✅ update map center
    setCenter({ lat: newLat, lng: newLng });

    // fill form with clicked coords
    setForm({
      name: "",
      lat: newLat,
      lng: newLng,
    });

    setSelected(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selected) {
      // UPDATE
      setMarkers((prev) =>
        prev.map((m) =>
          m.id === selected.id
            ? {
                ...selected,
                name: form.name,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
              }
            : m
        )
      );
    } else {
      // CREATE
      const newMarker = {
        id: Date.now(),
        name: form.name,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
      };
      setMarkers((prev) => [...prev, newMarker]);
    }

    setForm({ name: "", lat: "", lng: "" });
    setSelected(null);
  };

  const handleEdit = (marker) => {
    setSelected(marker);
    setForm(marker);

    // optional: center map on marker when editing
    setCenter({ lat: marker.lat, lng: marker.lng });
  };

  const handleDelete = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <LoadScript googleMapsApiKey="">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={center} // ✅ dynamic center
          zoom={10}
          onClick={handleMapClick}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleEdit(marker)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-2">
          {selected ? "Edit Marker" : "Add Marker"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
            className="border p-2 rounded"
            required
          />

          <button className="bg-blue-500 text-white p-2 rounded">
            {selected ? "Update" : "Create"}
          </button>
        </form>

        <div className="mt-4">
          <h3 className="font-semibold">Markers List</h3>
          {markers.map((m) => (
            <div
              key={m.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{m.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}