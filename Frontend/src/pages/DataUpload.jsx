import React, { useState } from 'react';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:5001/api/upload-data';  // Nouveau port

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Veuillez sélectionner un fichier');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadStatus('Fichier téléchargé avec succès');
    } catch (error) {
      setUploadStatus(`Erreur: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div style={styles.uploadContainer}>
        <div style={styles.uploadBox}>
          <h2 style={styles.subtitle}>Télécharger un fichier Excel</h2>
          
          <form onSubmit={handleFileUpload} style={styles.form}>
            <div style={styles.fileInputContainer}>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.fileInput}
              />
            </div>

            <button 
              type="submit" 
              disabled={!file || isProcessing}
              style={{
                ...styles.submitButton,
                ...((!file || isProcessing) && styles.submitButtonDisabled)
              }}
            >
              {isProcessing ? 'Traitement en cours...' : 'Télécharger'}
            </button>
          </form>

          {uploadStatus && (
            <div style={styles.statusMessage}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  uploadContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  subtitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fileInputContainer: {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  fileInput: {
    width: '100%',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  statusMessage: {
    marginTop: '20px',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    color: '#333',
  },
};

export default DataUpload;