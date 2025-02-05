import React, { useState } from "react";
import logo from "../assets/logo.png";
const API_URL = 'http://localhost:5001/api/upload-data1';  // Nouveau port
const Rhpredictionpage = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (uploadedFiles.length === 3) {
      setFiles(uploadedFiles);
    } else {
      alert("Vous devez importer exactement trois fichiers Excel.");
    }
  };

  const handlePredict = () => {
    if (files.length === 1) {
      alert(
        `Les fichiers ont été importés avec succès : \n${files
          .map((file) => file.name)
          .join("\n")}\nPrédictions en cours...`
      );
    } else {
      alert("Veuillez importer votre fichier Excel avant de continuer !");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Prédictions RH</h1>
        <p style={styles.subtitle}>
          Importez trois fichiers Excel pour générer des prédictions pour vos besoins en ressources humaines.
        </p>
        <div style={styles.uploadContainer}>
          <label htmlFor="file-upload" style={styles.uploadLabel}>
            {files.length === 3
              ? `Fichiers importés : \n${files.map((file) => file.name).join(", ")}`
              : "Cliquez pour importer trois fichiers"}
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".xls, .xlsx"
            multiple
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
        <button
          onClick={handlePredict}
          style={files.length === 1 ? styles.predictButtonActive : styles.predictButtonDisabled}
          disabled={files.length !== 1}
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
