import React from 'react';
import { motion } from 'framer-motion'; // Importer motion ici
import logo from '../assets/logo.png';

const Bienvenu = () => {
  const sections = [
    {
      title: 'Prédiction des commandes',
      text: `Prévision des commandes clients sur 15 jours grâce à l'analyse de l'historique des commandes. Le modèle utilisé se met à jour automatiquement avec les données récentes.`,
    },
    {
      title: 'Besoin RH',
      text: `Prédire le nombre de personnes nécessaires pour ajuster la planification des congés en fonction de la charge de travail.`,
    },
    {
      title: 'Solution achat de linge',
      text: `Conception d'une solution dédiée à la prévision des achats de linge, visant à optimiser les approvisionnements et réduire les risques de pénuries.`,
    },
    {
      title: 'Site web',
      text: `Vous disposez de ce site web intuitif, permettant de visualiser les prédictions du modèle, avec des graphiques clairs.`,
    },
  ];

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
            {/* Liens de navigation ici */}
          </ul>
        </div>
      </nav>

      {/* Contenu principal */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={styles.mainContent}
      >
        <motion.h1 
          style={styles.title}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Bienvenue sur le site de Mikana
        </motion.h1>
        <p style={styles.subtitle}>
          Gestion intelligente du linge - CHU de Rouen
        </p>

        {/* Section de texte explicatif */}
        <p style={styles.description}>
          "Mikana" est un système avancé d'intelligence artificielle qui permet de prédire les besoins en linge et optimiser les livraisons pour le CHU de Rouen.
        </p>

        {/* Sections détaillées */}
        <motion.div
          style={styles.sectionsContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              style={styles.section}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
            >
              <h3 style={styles.sectionTitle}>{section.title}</h3>
              <p style={styles.sectionText}>{section.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Boutons */}
        <div style={styles.buttonContainer}>
          <button style={styles.buttonPrimary} onClick={() => (window.location.href = '/connexion')}>
            Se connecter
          </button>
          <button style={styles.buttonSecondary} onClick={() => (window.location.href = '/inscription')}>
            S'inscrire
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'white', // Fond blanc
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  navbar: {
    background: '#87CEFA', // Bleu ciel
    padding: '10px 20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    top: 0,
    width: '100%',
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
    fontSize: '24px',
    fontWeight: '600',
    color: '#fff',
  },
  navLinks: {
    display: 'flex',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  mainContent: {
    maxWidth: '1200px',
    marginTop: '80px', // pour ne pas que le contenu soit caché sous la navbar
    padding: '20px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.9)', // Fond plus clair pour améliorer la lisibilité
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#555',
    marginBottom: '30px',
    fontStyle: 'italic',
  },
  description: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '40px',
    lineHeight: '1.6',
  },
  sectionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Deux colonnes pour le texte
    gap: '30px',
    marginBottom: '40px',
  },
  section: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#007bff',
    marginBottom: '15px',
  },
  sectionText: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.5',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '40px',
  },
  buttonPrimary: {
    padding: '12px 25px',
    backgroundColor: '#6a5acd',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonSecondary: {
    padding: '12px 25px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Bienvenu;