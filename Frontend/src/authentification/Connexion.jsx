import React, { useState } from 'react';
import logo from '../assets/logo.png'; // Assurez-vous d'utiliser l'import correct
import { useNavigate } from 'react-router-dom';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Erreur de connexion');
        return;
      }
  
      const data = await response.json();
      localStorage.setItem('userId', data.userId); // Stocker l'ID de l'utilisateur
      alert('Connexion réussie');
      navigate('/accueil'); // Rediriger vers la page d'accueil
    } catch (error) {
      console.error('Erreur :', error);
      alert('Impossible de se connecter. Réessayez plus tard.');
    }
  };
  

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f7fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw', 
        margin: '0',
        padding: '0',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: '70px', marginBottom: '10px' }}
          />
          <h1 style={{ fontSize: '1.5rem', color: '#333' }}>Bienvenue</h1>
          <p style={{ color: '#666', margin: '10px 0' }}>
            Connectez-vous à votre compte
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Se connecter
          </button>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
            }}
          >
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
