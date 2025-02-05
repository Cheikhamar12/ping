import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
 
function Inscription() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
 
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
 
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 
  const validateName = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length < 2) {
      setNameError('Veuillez entrer votre prénom et votre nom.');
      return false;
    }
    setNameError('');
    return true;
  };
 
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      setEmailError('Veuillez entrer une adresse e-mail valide (ex : user@domain.com)');
      return false;
    }
    setEmailError('');
    return true;
  };
 
  const validatePhone = (phone) => {
    const regex = /^(\+?[0-9]{1,3})?([0-9]{10})$/;
    if (!regex.test(phone)) {
      setPhoneError('Veuillez entrer un numéro de téléphone valide (ex : 0123456789 ou +33XXXXXXXXX)');
      return false;
    }
    setPhoneError('');
    return true;
  };
 
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (
      !validateName(formData.name) ||
      !validateEmail(formData.email) ||
      !validatePhone(formData.phone) ||
      !validatePassword(formData.password)
    ) {
      return;
    }
 
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de l\'inscription:", errorData.message);
        alert(errorData.message || "Une erreur est survenue lors de l'inscription.");
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
<img src={logo} alt="Logo" style={{ width: '70px', marginBottom: '10px' }} />
<h1 style={{ fontSize: '1.5rem', color: '#333' }}>Créer un compte</h1>
</div>
<form onSubmit={handleSubmit}>
<input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Entrez votre prénom et nom"
            required
            onBlur={() => validateName(formData.name)}
            style={{
              width: '100%',
              padding: '5px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          {nameError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{nameError}</p>}
 
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez votre e-mail"
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
            placeholder="Entrez votre mot de passe"
            required
            style={{
              width: '100%',
              padding: '5px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          {passwordError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{passwordError}</p>}
 
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Entrez votre numéro de téléphone"
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