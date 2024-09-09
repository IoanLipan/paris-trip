import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100vw",
  height: "80vh",
};

const initialCenter = {
  lat: 48.8566,
  lng: 2.3522,
};

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const days = [
  {
    name: "September 11: Eiffel Tower & Central Paris",
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
        duration: "1 hour",
        price: "Free",
        facts:
          "This large public greenspace offers stunning views of the Eiffel Tower.",
        transport: "A short walk from the Eiffel Tower.",
      },
      {
        name: "Arc de Triomphe",
        position: { lat: 48.8738, lng: 2.295 },
        duration: "1-2 hours",
        price: "€13 for adults",
        facts:
          "Offers panoramic views of Paris and honors those who fought for France.",
        transport:
          "Take Metro Lines 1, 2, or 6 to Charles de Gaulle-Étoile station.",
      },
      {
        name: "Champs-Élysées",
        position: { lat: 48.8698, lng: 2.3075 },
        duration: "2-3 hours",
        price: "Free (unless shopping)",
        facts:
          "One of the world's most famous commercial streets, stretching 1.9 km.",
        transport:
          "Walk down from the Arc de Triomphe or take Metro Line 1 to Franklin D. Roosevelt or Champs-Élysées-Clemenceau stations.",
      },
      {
        name: "Eiffel Tower at Night",
        position: { lat: 48.8584, lng: 2.2945 },
        duration: "1 hour",
        price: "Free to view from ground",
        facts:
          "The tower sparkles for 5 minutes every hour on the hour until 1 AM.",
        transport: "Same as daytime Eiffel Tower.",
      },
    ],
    tips: "Book Eiffel Tower tickets in advance. For the evening visit, consider viewing from Trocadéro for the best photo opportunities.",
  },
  {
    name: "September 12: Montmartre & Historical Paris",
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
        duration: "Photo stop",
        price: "Free (€87-€235 for show tickets)",
        facts: "Birthplace of the modern can-can dance, opened in 1889.",
        transport: "Take Metro Line 2 to Blanche station.",
      },
      {
        name: "Père Lachaise Cemetery",
        position: { lat: 48.8592, lng: 2.391 },
        duration: "2-3 hours",
        price: "Free",
        facts:
          "Final resting place of many famous figures including Jim Morrison and Oscar Wilde.",
        transport: "Take Metro Line 2 or 3 to Père Lachaise station.",
      },
    ],
    tips: "Wear comfortable shoes for walking in Montmartre's hilly streets. At Père Lachaise, consider getting a map or guided tour to locate famous graves.",
  },
  {
    name: "September 13: Louvre & Central Paris",
    locations: [
      {
        name: "Louvre Museum",
        position: { lat: 48.8606, lng: 2.3376 },
        duration: "4-5 hours",
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
      {
        name: "Sainte-Chapelle",
        position: { lat: 48.8554, lng: 2.3451 },
        duration: "1 hour",
        price: "€11.50 for adults",
        facts:
          "13th-century royal chapel famous for its spectacular stained glass windows.",
        transport: "Take Metro Line 4 to Cité station.",
      },
    ],
    tips: "Book Louvre tickets online to skip the line. Consider a guided tour for highlights if you're short on time. Don't miss Sainte-Chapelle's upper chapel for the best view of the stained glass.",
  },
  {
    name: "September 14: Versailles",
    locations: [
      {
        name: "Palace of Versailles",
        position: { lat: 48.8048, lng: 2.1203 },
        duration: "4-5 hours",
        price:
          "€18 for palace, €20 for palace + gardens (on musical fountain shows days)",
        facts:
          "Former royal residence, known for its Hall of Mirrors and extensive gardens.",
        transport: "Take RER C to Versailles Château Rive Gauche station.",
      },
      {
        name: "Gardens of Versailles",
        position: { lat: 48.8048, lng: 2.1203 },
        duration: "2-3 hours",
        price: "Included with palace ticket or €9.50 separately",
        facts:
          "Covering 800 hectares, featuring fountains, canals, and geometric flower beds.",
        transport: "Included in the Palace of Versailles visit.",
      },
    ],
    tips: "Arrive early to avoid crowds. Book tickets in advance. Consider renting a golf cart or bikes to explore the extensive gardens.",
  },
  {
    name: "September 15: Notre-Dame & Left Bank",
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
        name: "Saint-Germain-des-Prés",
        position: { lat: 48.8542, lng: 2.3332 },
        duration: "2-3 hours",
        price: "Free",
        facts:
          "Historic neighborhood known for its cafes, art galleries, and intellectual history.",
        transport: "Take Metro Line 4 to Saint-Germain-des-Prés station.",
      },
      {
        name: "Panthéon",
        position: { lat: 48.8462, lng: 2.3464 },
        duration: "1-2 hours",
        price: "€11.50 for adults",
        facts:
          "Mausoleum containing the remains of distinguished French citizens like Voltaire and Marie Curie.",
        transport:
          "Take RER B to Luxembourg station or bus 21, 27, 38, 82, 84, 85, or 89.",
      },
      {
        name: "Luxembourg Gardens",
        position: { lat: 48.8462, lng: 2.3371 },
        duration: "1-2 hours",
        price: "Free",
        facts:
          "Second largest public park in Paris, home to the French Senate.",
        transport:
          "Walk from the Panthéon or take RER B to Luxembourg station.",
      },
    ],
    tips: "Enjoy a relaxed day in the Left Bank. Consider having lunch at a classic Parisian café in Saint-Germain-des-Prés. The Luxembourg Gardens are perfect for a picnic if weather permits.",
  },
  {
    name: "September 16: Relaxation & Hidden Gems",
    locations: [
      {
        name: "Canal Saint-Martin",
        position: { lat: 48.8731, lng: 2.3654 },
        duration: "2-3 hours",
        price: "Free",
        facts:
          "A picturesque canal lined with trendy shops and cafes, perfect for a leisurely stroll or picnic.",
        transport:
          "Take Metro Line 5 to République or Jacques Bonsergent station.",
      },
      {
        name: "Parc des Buttes-Chaumont",
        position: { lat: 48.8809, lng: 2.3825 },
        duration: "2-3 hours",
        price: "Free",
        facts:
          "One of the largest and most original parks in Paris, featuring a lake, waterfalls, and great views of the city.",
        transport:
          "Take Metro Line 7bis to Buttes Chaumont station or Line 5 to Laumière station.",
      },
      {
        name: "Le Marais",
        position: { lat: 48.8597, lng: 2.3622 },
        duration: "2-3 hours",
        price: "Free (unless shopping or dining)",
        facts:
          "A historic district known for its beautiful architecture, trendy boutiques, and vibrant Jewish and LGBTQ+ communities.",
        transport:
          "Take Metro Line 1 to Saint-Paul station or Line 8 to Chemin Vert station.",
      },
      {
        name: "Seine River Cruise",
        position: { lat: 48.8589, lng: 2.347 },
        duration: "1 hour",
        price: "€15-€20 for adults",
        facts:
          "A relaxing way to see many Paris landmarks from the water, especially beautiful at sunset.",
        transport:
          "Most cruises depart near Pont Neuf. Take Metro Line 7 to Pont Neuf station or Line 4 to Cité station.",
      },
    ],
    tips: "Take it easy on your last day. Enjoy a leisurely breakfast at a local café, people-watch from a park bench, and soak in the Parisian atmosphere. Consider doing any last-minute shopping in Le Marais. End your trip with a relaxing Seine River cruise to bid farewell to the City of Light.",
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
            {day.name.split(":")[0]}
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
            marginTop: "20px",
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
