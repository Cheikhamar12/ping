import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Inscription from './authentification/Inscription';
import Connexion from './authentification/Connexion';
import AccueilPage from './prediction/AccueilPage';
import DBPage from './BDD/db'; 

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
        {/* Routes accessibles à tous */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* Routes protégées */}
        <Route
          path="/accueil"
          element={userId ? <AccueilPage /> : <Navigate to="/connexion" replace />}
        />
        <Route
          path="/db"
          element={userId ? <DBPage /> : <Navigate to="/connexion" replace />}
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
