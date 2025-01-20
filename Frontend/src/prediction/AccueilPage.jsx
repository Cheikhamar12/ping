import React from 'react';
import logo from '../assets/logo.png';

const AccueilPage = () => {
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
              <a href="/" style={styles.activeLink}>
                Accueil
              </a>
            </li>
            <li>
              <a href="/predictions" style={styles.link}>
                Prédictions
              </a>
            </li>
            <li>
              <a href="/documentation" style={styles.link}>
                Documentation
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenu principal */}
      <div style={styles.mainContent}>
        <h1 style={styles.title}>Tableau de bord</h1>
        <p style={styles.subtitle}>
          Système de gestion intelligente du linge - CHU de Rouen
        </p>

        {/* Aperçu des prédictions */}
        <div style={styles.grid}>
          {/* Carte 1 */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Aperçu des prédictions</h2>
            <p style={styles.cardSubtitle}>Graphique des prédictions</p>
            <div style={styles.cardContent}>
              <span style={styles.placeholderText}>
                Graphique à insérer ici
              </span>
            </div>
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
  },
  link: {
    color: '#666666',
    textDecoration: 'none',
    margin: '0 10px',
    fontSize: '16px',
  },
  activeLink: {
    color: '#007bff',
    textDecoration: 'none',
    margin: '0 10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '0 20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
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
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333333',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#666666',
    marginBottom: '10px',
  },
  cardContent: {
    height: '150px',
    backgroundColor: '#f1f1f1',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999999',
  },
};

export default AccueilPage;
