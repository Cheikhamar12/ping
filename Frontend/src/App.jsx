import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Inscription from './authentification/Inscription';
import Connexion from './authentification/Connexion';
import AccueilPage from './prediction/AccueilPage';

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Vérifiez si un ID utilisateur est stocké
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId); // Met à jour l'état
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route de base : Redirige vers Inscription */}
        <Route path="/" element={<Navigate to="/inscription" replace />} />

        {/* Route accessible à tous */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* Route protégée */}
        <Route
          path="/accueil"
          element={
            userId ? (
              <AccueilPage />
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />

        {/* Redirection par défaut pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
