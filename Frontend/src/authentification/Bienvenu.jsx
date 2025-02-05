import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
const Bienvenu = () => {
 const [isAnimating, setIsAnimating] = useState(true);
 // Arrêter l'animation après 5 secondes
 useEffect(() => {
   console.log("🕒 Animation démarrée...");
   const timer = setTimeout(() => {
     console.log("❌ Animation stoppée !");
     setIsAnimating(false);
   }, 5000);
   return () => clearTimeout(timer);
 }, []);
 return (
<div style={styles.container}>
<nav style={styles.navbar}>
<div style={styles.navContent}>
<div style={styles.logoContainer}>
<img src={logo} alt="Logo" style={styles.logo} />
<span style={styles.brand}>MIKANA</span>
</div>
</div>
</nav>
<motion.div
       initial={{ opacity: 0, y: -50 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 1 }}
       style={styles.mainContent}
>
<motion.h1
         key={isAnimating} // Force le rechargement de l'élément
         style={styles.title}
         animate={isAnimating ? { x: [-10, 10, -10] } : {}}
         transition={
           isAnimating
             ? { repeat: Math.floor(5 / 2), duration: 2, ease: "easeInOut" } // Stop après 5 sec
             : {}
         }
>
         Bienvenue sur le site de Mikana
</motion.h1>
<p style={styles.subtitle}>Gestion intelligente du linge - CHU de Rouen</p>
</motion.div>
</div>
 );
};
const styles = {
 container: {
   minHeight: '100vh',
   backgroundColor: 'white',
   fontFamily: "'Poppins', sans-serif",
   color: '#333',
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
   padding: '20px',
 },
 navbar: {
   background: '#87CEFA',
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
 mainContent: {
   maxWidth: '1200px',
   marginTop: '80px',
   padding: '20px',
   textAlign: 'center',
   background: 'rgba(255, 255, 255, 0.9)',
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
};
export default Bienvenu;


