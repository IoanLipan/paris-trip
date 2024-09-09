import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100vw",
  height: "60vh",
};

const initialCenter = {
  lat: 48.8566,
  lng: 2.3522,
};

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const days = [
  {
    name: "Day 1: Eiffel Tower & Champ de Mars",
    locations: [
      {
        name: "Eiffel Tower",
        position: { lat: 48.8584, lng: 2.2945 },
        duration: "2-3 hours",
        price: "€26.10 for adults (stairs access to 2nd floor + lift to top)",
        facts:
          "Completed in 1889, it's 324 meters tall and has 1,665 steps to the top.",
        transport:
          "Take Metro Line 6 to Bir-Hakeim station or RER C to Champ de Mars-Tour Eiffel.",
      },
      {
        name: "Champ de Mars",
        position: { lat: 48.8556, lng: 2.2989 },
        duration: "1-2 hours",
        price: "Free",
        facts:
          "This large public greenspace is perfect for a picnic with a view of the Eiffel Tower.",
        transport: "A short walk from the Eiffel Tower.",
      },
    ],
    tips: "Start your trip with an iconic view of Paris. Consider booking Eiffel Tower tickets in advance to avoid long queues. Bring a picnic to enjoy in Champ de Mars for a relaxing first day.",
  },
  {
    name: "Day 2: Louvre & Central Paris",
    locations: [
      {
        name: "Louvre Museum",
        position: { lat: 48.8606, lng: 2.3376 },
        duration: "3-4 hours",
        price: "€17 for adults",
        facts:
          "World's largest art museum, home to the Mona Lisa and Venus de Milo.",
        transport:
          "Take Metro Line 1 or 7 to Palais Royal-Musée du Louvre station.",
      },
      {
        name: "Tuileries Garden",
        position: { lat: 48.8634, lng: 2.3275 },
        duration: "1 hour",
        price: "Free",
        facts:
          "Created by Catherine de' Medici in 1564, it became a public park after the French Revolution.",
        transport: "A short walk from the Louvre.",
      },
      {
        name: "Place de la Concorde",
        position: { lat: 48.8656, lng: 2.3212 },
        duration: "30 minutes",
        price: "Free",
        facts:
          "Largest square in Paris, featuring an Egyptian obelisk over 3,000 years old.",
        transport:
          "Walk through Tuileries Garden or take Metro Line 1, 8, or 12 to Concorde station.",
      },
    ],
    tips: "Book Louvre tickets online to skip the line. Consider a guided tour for highlights if you're short on time. The museum is free on the first Saturday of each month from 6 pm to 9:45 pm.",
  },
  {
    name: "Day 3: Notre-Dame & Left Bank",
    locations: [
      {
        name: "Notre-Dame Cathedral (exterior)",
        position: { lat: 48.853, lng: 2.3499 },
        duration: "30 minutes",
        price: "Free",
        facts:
          "Currently under restoration after the 2019 fire, but the exterior is still impressive.",
        transport:
          "Take RER B or C to Saint-Michel Notre-Dame station, or Metro Line 4 to Cité station.",
      },
      {
        name: "Shakespeare and Company",
        position: { lat: 48.8526, lng: 2.3471 },
        duration: "30-45 minutes",
        price: "Free (unless buying books)",
        facts:
          "Iconic English-language bookstore, a gathering place for writers since 1951.",
        transport: "A short walk from Notre-Dame.",
      },
      {
        name: "Saint-Germain-des-Prés",
        position: { lat: 48.8542, lng: 2.3332 },
        duration: "2-3 hours",
        price: "Free",
        facts:
          "Historic neighborhood known for its cafes, art galleries, and intellectual history.",
        transport: "Take Metro Line 4 to Saint-Germain-des-Prés station.",
      },
    ],
    tips: "While at Saint-Germain-des-Prés, consider visiting Café de Flore or Les Deux Magots, famous for their literary history. The area is great for shopping and people-watching.",
  },
  {
    name: "Day 4: Montmartre & Northern Paris",
    locations: [
      {
        name: "Sacré-Cœur",
        position: { lat: 48.8867, lng: 2.3431 },
        duration: "1-2 hours",
        price: "Free (€6 for dome access)",
        facts: "Highest point in Paris, offering panoramic views of the city.",
        transport:
          "Take Metro Line 2 to Anvers station, then walk or take the funicular.",
      },
      {
        name: "Place du Tertre",
        position: { lat: 48.8865, lng: 2.3408 },
        duration: "1 hour",
        price: "Free",
        facts:
          "Famous square in Montmartre, known for its artists painting en plein air.",
        transport: "A short walk from Sacré-Cœur.",
      },
      {
        name: "Moulin Rouge",
        position: { lat: 48.8842, lng: 2.3322 },
        duration: "2-3 hours (for a show)",
        price: "€87-€235 for show tickets",
        facts: "Birthplace of the modern can-can dance, opened in 1889.",
        transport: "Take Metro Line 2 to Blanche station.",
      },
    ],
    tips: "Wear comfortable shoes for walking in Montmartre's hilly streets. Book Moulin Rouge tickets in advance if you plan to see a show. Be aware of pickpockets in touristy areas.",
  },
  {
    name: "Day 5: Seine River Cruise & Relaxation",
    locations: [
      {
        name: "Seine River Cruise",
        position: { lat: 48.8589, lng: 2.3469 },
        duration: "1 hour",
        price: "€15-€20 for adults",
        facts: "A relaxing way to see many Paris landmarks from the water.",
        transport:
          "Most cruises depart near Pont Neuf. Take Metro Line 7 to Pont Neuf station.",
      },
      {
        name: "Jardin du Luxembourg",
        position: { lat: 48.8462, lng: 2.3371 },
        duration: "2-3 hours",
        price: "Free",
        facts:
          "Second largest public park in Paris, home to the French Senate.",
        transport:
          "Take RER B to Luxembourg station or Metro Line 4 to Saint-Sulpice station.",
      },
    ],
    tips: "End your trip with a relaxing day. Consider bringing a book or picnic to Jardin du Luxembourg. Evening cruises offer beautiful views of illuminated monuments.",
  },
];

const ParisItineraryMap = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(12);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      days[selectedDay].locations.forEach((location) => {
        bounds.extend(location.position);
      });
      map.fitBounds(bounds);
      setCenter(bounds.getCenter().toJSON());
      setZoom(map.getZoom());
    }
  }, [selectedDay, map]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f4f8",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            style={{
              padding: "8px 16px",
              margin: "0 4px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: selectedDay === index ? "#3490dc" : "#e2e8f0",
              color: selectedDay === index ? "white" : "black",
              transition: "all 0.3s ease",
            }}
          >
            Day {index + 1}
          </button>
        ))}
      </div>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
        >
          {days[selectedDay].locations.map((location, index) => (
            <MarkerF
              key={index}
              position={location.position}
              label={(index + 1).toString()}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <div
        style={{
          padding: "24px",
          overflowY: "auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#2c3e50",
          }}
        >
          {days[selectedDay].name}
        </h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {days[selectedDay].locations.map((location, index) => (
            <li
              key={index}
              style={{
                marginBottom: "24px",
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "8px",
                  color: "#3490dc",
                }}
              >
                {index + 1}. {location.name}
              </h3>
              <p>
                <strong>Duration:</strong> {location.duration}
              </p>
              <p>
                <strong>Price:</strong> {location.price}
              </p>
              <p>
                <strong>Fun Fact:</strong> {location.facts}
              </p>
              <p>
                <strong>How to get there:</strong> {location.transport}
              </p>
            </li>
          ))}
        </ul>
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#e6f7ff",
            borderRadius: "8px",
            borderLeft: "4px solid #3490dc",
          }}
        >
          <h4 style={{ marginBottom: "8px", color: "#2c3e50" }}>
            Tips for the day:
          </h4>
          <p>{days[selectedDay].tips}</p>
        </div>
      </div>
    </div>
  );
};

export default ParisItineraryMap;
