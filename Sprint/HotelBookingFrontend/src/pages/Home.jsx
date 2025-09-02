import Hero from "../components/Hero";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Hero />
      <div
        className="container"
        style={{
          textAlign: "center",
          marginTop: "2rem",
          backgroundColor: "#f5f5f5", // light grey background inside box
          padding: "2rem",
          borderRadius: "10px", // rounded corners
          border: "2px solid #ddd", // light grey border
          maxWidth: "800px", // keeps box from stretching full width
          marginLeft: "auto",
          marginRight: "auto", // center the box
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // optional shadow for depth
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: "2.2rem",
            color: "#2c3e50",
            marginBottom: "1rem",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Plan your perfect trip
        </h2>

        {/* Subtitle */}
        <p
          className="subtitle"
          style={{
            fontSize: "1.2rem",
            color: "#555",
            marginBottom: "1.5rem",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Real hotels, real rooms, real-time availability.
        </p>

        {/* Button */}
        <Link
          className="btn"
          to="/hotels"
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Browse Hotels
        </Link>
      </div>
    </>
  );
}
