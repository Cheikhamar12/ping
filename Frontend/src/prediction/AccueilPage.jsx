import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';

const AccueilPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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

          {/* Icône du menu */}
          <div style={styles.menuIcon} onClick={toggleMenu}>
            {menuOpen ? <FaTimes size={30} color="#fff" /> : <FaBars size={30} color="#fff" />}
          </div>
        </div>

        {/* Menu dynamique */}
        <div style={{ ...styles.menu, ...(menuOpen ? styles.menuOpen : {}) }}>
          <ul style={styles.menuLinks}>
            <li>
              <Link to="/" style={styles.link} onClick={toggleMenu}>
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/rh-predictions" style={styles.link} onClick={toggleMenu}>
                Besoin RH
              </Link>
            </li>
            <li>
              <Link to="/predictions" style={styles.link} onClick={toggleMenu}>
                Prédictions
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenu principal */}
      <div style={styles.mainContent}>
        <h1 style={styles.title}>ACCUEIL</h1>
        <p style={styles.subtitle}>
          Un système avancé d'intelligence artificielle qui permet de prédire les besoins de la blanchisserie du CHU de Rouen
        </p>

        {/* Section des prédictions */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Vous pouvez accedé aux prédictions dans la barre de menu </h2>
            
          </div>
        </div>
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
    backgroundColor: '#87CEFA',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '20px 30px',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 100,
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
    height: '40px',
    marginRight: '10px',
  },
  brand: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
  },
  menuIcon: {
    cursor: 'pointer',
  },
  menu: {
    position: 'fixed',
    top: 0,
    right: '-100%',
    height: '100vh',
    width: '250px',
    backgroundColor: '#87CEFA',
    transition: 'right 0.4s ease-in-out',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 99,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOpen: {
    right: 0,
  },
  menuLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'center',
  },
  link: {
    display: 'block',
    color: '#000000',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '15px 0',
    transition: 'color 0.3s ease',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '100px auto 0',
    padding: '0 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666666',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '20px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '50px',
    textDecoration: 'none',
    textAlign: 'center',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
};

export default AccueilPage;
