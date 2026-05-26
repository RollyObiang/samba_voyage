import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { X } from 'lucide-react'; // On garde X pour fermer la bulle

// Import de tes pages
import Accueil from './pages/Accueil';
import APropos from './pages/APropos';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import EspaceClient from './pages/EspaceClient';
import SuiviClient from './pages/SuiviClient';
import Souscription from './pages/Souscription';
import DashboardAgence from './pages/DashboardAgence';
import PortailAFA from './pages/PortailAFA';
import AdminSamba from './pages/AdminSamba'; 
import DeclarerSinistre from './pages/DeclarerSinistre';
import DashboardClient from './pages/DashboardClient';
import MesContrats from './pages/MesContrats';
import ValiderSinistre from './pages/ValiderSinistre'; 

// Imports AUTHENTIFICATION
import LoginAgence from './pages/auth/LoginAgence';
import LoginAFA from './pages/auth/LoginAFA';
import LoginAdmin from './pages/auth/LoginAdmin';
import RegisterAgence from './pages/auth/RegisterAgence';
import RegisterAFA from './pages/auth/RegisterAFA';

import logoFond from './assets/samb-assurances.png';
import Footer from './components/Footer';

// --- COMPOSANT : PrivateRoute ---
const PrivateRoute = ({ children, roleRequired, redirectTo }) => {
  const userRole = localStorage.getItem('role');
  if (userRole === roleRequired) return children;
  return <Navigate to={redirectTo} />;
};

function App() {
  const [showHelpBubble, setShowHelpBubble] = useState(true);

  return (
    <Router>
      <div style={appStyles.container}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/espace-client" element={<EspaceClient />} />
            <Route path="/suivi-client" element={<SuiviClient />} />
            <Route path="/souscription" element={<Souscription />} />
            <Route path="/declarer-sinistre" element={<DeclarerSinistre />} />
            <Route path="/dashboard-client" element={<DashboardClient />} />
            <Route path="/mes-contrats" element={<MesContrats />} />
            <Route path="/login-agence" element={<LoginAgence />} />
            <Route path="/login-afa" element={<LoginAFA />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/inscription-agence" element={<RegisterAgence />} />
            <Route path="/inscription-afa" element={<RegisterAFA />} />

            <Route path="/dashboard-agence" element={
                <PrivateRoute roleRequired="agence" redirectTo="/login-agence">
                  <DashboardAgence />
                </PrivateRoute>
              } 
            />
            <Route path="/valider-sinistre/:id" element={
                <PrivateRoute roleRequired="agence" redirectTo="/login-agence">
                  <ValiderSinistre />
                </PrivateRoute>
              } 
            />
            <Route path="/portail-afa" element={
                <PrivateRoute roleRequired="afa" redirectTo="/login-afa">
                  <PortailAFA />
                </PrivateRoute>
              } 
            />
            <Route path="/admin-samba" element={
                <PrivateRoute roleRequired="admin" redirectTo="/login-admin">
                  <AdminSamba />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>

        {/* --- BOUTON WHATSAPP BUSINESS AVEC LE VRAI DESSIN --- */}
        <div style={appStyles.whatsappContainer}>
          
          {showHelpBubble && (
            <div style={appStyles.helpBubble}>
              <div style={appStyles.helpHeader}>
                <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                   {/* Mini icône dans le header */}
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="wa" style={{width: '15px'}} />
                  <span style={{fontWeight: 'bold', fontSize: '11px', color: 'white'}}>WhatsApp Business</span>
                </div>
                <button onClick={() => setShowHelpBubble(false)} style={appStyles.closeBubbleBtn}>
                  <X size={12} color="white" />
                </button>
              </div>
              <p style={appStyles.helpText}>Besoin d'aide ? Discutez avec nous ! 👋</p>
              <div style={appStyles.bubbleTriangle}></div>
            </div>
          )}

          <a 
            href="https://wa.me/24165650000" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={appStyles.whatsappBtn}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
          >
            {/* ICI LE VRAI DESSIN DU TÉLÉPHONE */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
              alt="WhatsApp" 
              style={{ width: '100%', height: '100%' }} 
            />
          </a>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

const appStyles = {
    container: {
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97)), url(${logoFond})`,
        backgroundAttachment: 'fixed', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '40%',
    },
    whatsappContainer: {
        position: 'fixed', 
        bottom: '30px', 
        right: '30px', 
        zIndex: 2000, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-end', 
        gap: '10px'
    },
    helpBubble: {
        background: 'white', 
        padding: '12px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)', 
        maxWidth: '220px', 
        position: 'relative'
    },
    helpHeader: {
        background: '#25D366', 
        padding: '5px 10px', 
        borderRadius: '8px 8px 0 0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        margin: '-12px -12px 10px -12px'
    },
    helpText: {
        margin: 0, fontSize: '13px', color: '#1e293b', lineHeight: '1.4'
    },
    closeBubbleBtn: {
        background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex'
    },
    bubbleTriangle: {
        width: 0, height: 0, 
        borderLeft: '10px solid transparent', borderRight: '10px solid transparent', 
        borderTop: '10px solid white', position: 'absolute', bottom: '-8px', right: '20px'
    },
    whatsappBtn: {
        width: '60px', 
        height: '60px', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center', 
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        borderRadius: '50%',
        backgroundColor: 'transparent' // Le SVG a déjà le fond vert 
    }
};

export default App;