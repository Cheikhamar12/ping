import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Supprime l'ID utilisateur
    navigate('/connexion', { replace: true }); // Remplace l'entrée actuelle dans l'historique
  };
  

  return (
    <div style={styles.container}>
      {/* Barre de navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo} />
            <span style={styles.brand}>MIKANA</span>
          </div>
          <ul style={styles.navLinks}>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/predictions');
                }} 
                style={styles.link}
              >
                Prédictions
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/upload');
                }} 
                style={styles.link}
              >
                Dépôt de données
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/update');
                }} 
                style={styles.link}
              >
                Base de données
              </a>
            </li>
            {/* Bouton de déconnexion en rouge */}
            <li>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenu de la page */}
      <div style={styles.mainContent}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: 'Arial, sans-serif',
  },
  navbar: {
    backgroundColor: '#ffffff',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '10px 20px',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '30px',
    marginRight: '10px',
  },
  brand: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333333',
  },
  navLinks: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    alignItems: 'center',
  },
  link: {
    color: '#666666',
    textDecoration: 'none',
    margin: '0 10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d', // Rouge vif
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '4px',
    marginLeft: '15px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  logoutButtonHover: {
    backgroundColor: '#cc0000', // Rouge plus foncé au survol
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '0 20px',
  },
};

export default Layout;
