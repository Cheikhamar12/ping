import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Inscription from './authentification/Inscription';
import Connexion from './authentification/Connexion';
import AccueilPage from './prediction/AccueilPage';
import Rhpredictionpage from './prediction/Rhpredictionpage'; // Import de la nouvelle page
import Bienvenue from './authentification/Bienvenu';  //Test Divine

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Vérifiez si un ID utilisateur est stocké
    const storedUserId = localStorage.getItem('userId');
    console.log('User ID récupéré dans useEffect :', storedUserId);
    setUserId(storedUserId); // Met à jour l'état
    console.log('Etat de userId dans App.jsx :', userId);

  }, []);
  // Afficher un chargement tant que userId est null
  if (userId === null) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Route accessible à tous */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/bienvenu" element={<Bienvenue />} />

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
                <Route
          path="/rh-predictions"
          element={
            userId ? (
              <Rhpredictionpage />
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />
                

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/bienvenu" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;

