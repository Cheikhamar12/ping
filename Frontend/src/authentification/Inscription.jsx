import React, { useState } from 'react';
import logo from '../assets/logo.png'; // Assurez-vous d'utiliser l'import direct
import { useNavigate } from 'react-router-dom';

function Inscription() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState(''); // Pour l'erreur du téléphone

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    // Expression régulière pour valider le format email : localpart@domain.extension
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      setEmailError('Veuillez entrer une adresse e-mail valide (ex : user@domain.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone) => {
    // Expression régulière pour valider un numéro de téléphone
    const regex = /^(\+?[0-9]{1,3})?([0-9]{10})$/; // Validation pour un numéro avec ou sans code pays (ex: +1234567890 ou 0123456789)
    if (!regex.test(phone)) {
      setPhoneError('Veuillez entrer un numéro de téléphone valide (ex : 0123456789 ou +33XXXXXXXXX)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider l'email et le téléphone avant de soumettre
    if (!validateEmail(formData.email) || !validatePhone(formData.phone)) {
      return; // Ne pas soumettre si l'email ou le téléphone ne sont pas valides
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur lors de l\'inscription:', errorData.message);
        alert(errorData.message || 'Une erreur est survenue lors de l\'inscription.');
        return;
      }

      const data = await response.json();
      console.log('Inscription réussie:', data.message);
      alert('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');

      navigate('/connexion');
    } catch (error) {
      console.error('Erreur lors de la connexion au serveur:', error);
      alert('Impossible de se connecter au serveur. Veuillez réessayer plus tard.');
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
          <h1 style={{ fontSize: '1.5rem', color: '#333' }}>Create Account</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            style={{
              width: '100%',
              padding: '5px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={{
              width: '100%',
              padding: '5px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          {emailError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{emailError}</p>}
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            style={{
              width: '100%',
              padding: '5px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            style={{
              width: '100%',
              padding: '5px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          {phoneError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{phoneError}</p>}
          
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
            }}
          >
            S'INSCRIRE 
          </button>
        </form>
      </div>
    </div>
  );
}

export default Inscription;
