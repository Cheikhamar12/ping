import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Inscription from './authentification/Inscription';
import Connexion from './authentification/Connexion';
import AccueilPage from './prediction/AccueilPage';
import DataUpload from './pages/DataUpload';
import Bienvenue from './authentification/Bienvenu';
import UpdateButton from './pages/db';

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
        {/* Route de base : Redirige vers bienvenue */}
        <Route path="/" element={<Navigate to="/bienvenu" replace />} />

        {/* Routes accessibles à tous */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/bienvenu" element={<Bienvenue />} />


        {/* Routes protégées */}
        <Route
          path="/predictions"
          element={
            userId ? (
              <AccueilPage />
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />
        <Route
          path="/update"
          element={
            userId ? <UpdateButton /> : <Navigate to="/connexion" replace />
          }
        />
        {/* Nouvelle route pour DataUpload */}
        <Route
          path="/upload"
          element={
            userId ? (
              <DataUpload />
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
