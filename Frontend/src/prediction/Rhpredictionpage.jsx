import React, { useState } from "react";
import logo from "../assets/logo.png";

const Rhpredictionpage = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handlePredict = () => {
    if (file) {
      alert(
        `Le fichier "${file.name}" a été importé avec succès. Prédictions en cours...`
      );
    } else {
      alert("Veuillez d'abord importer un fichier !");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        {/* Logo */}
        <img src={logo} alt="Logo" style={styles.logo} />

        {/* Titre */}
        <h1 style={styles.title}>Prédictions RH</h1>

        {/* Sous-titre */}
        <p style={styles.subtitle}>
          Importez un fichier Excel pour générer des prédictions pour vos
          besoins en ressources humaines.
        </p>

        {/* Champ d'importation */}
        <div style={styles.uploadContainer}>
          <label htmlFor="file-upload" style={styles.uploadLabel}>
            {file ? `Fichier : ${file.name}` : "Cliquez pour importer un fichier"}
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".xls, .xlsx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* Bouton prédire */}
        <button
          onClick={handlePredict}
          style={file ? styles.predictButtonActive : styles.predictButtonDisabled}
          disabled={!file}
        >
          Lancer les Prédictions
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  contentContainer: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "90%",
    maxWidth: "600px",
    padding: "40px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  logo: {
    width: "100px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333333",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666666",
    marginBottom: "30px",
    fontSize: "1rem",
    lineHeight: "1.5",
  },
  uploadContainer: {
    marginBottom: "30px",
  },
  uploadLabel: {
    display: "block",
    padding: "15px 20px",
    background: "rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    border: "2px dashed rgba(0, 0, 0, 0.3)",
    color: "#333333",
    cursor: "pointer",
    transition: "all 0.3s",
    textAlign: "center",
  },
  predictButtonActive: {
    padding: "12px 24px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s, background 0.3s",
  },
  predictButtonDisabled: {
    padding: "12px 24px",
    background: "rgba(0, 0, 0, 0.1)",
    color: "#666666",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "not-allowed",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, background 0.3s",
  },
};

export default Rhpredictionpage;
