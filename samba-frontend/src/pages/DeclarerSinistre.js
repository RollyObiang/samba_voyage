import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction de l'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DeclarerSinistre = () => {
    const navigate = useNavigate();
    const [position, setPosition] = useState([0.4061, 9.4673]); // Libreville par défaut
    const [typeIncident, setTypeIncident] = useState('Maladie/Hospitalisation');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(null);

    // Récupération du client & Tentative de géolocalisation automatique de l'urgence
    useEffect(() => {
        const savedClient = localStorage.getItem('clientConnecte');
        if (savedClient) {
            setClient(JSON.parse(savedClient));
        } else {
            navigate('/espace-client');
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
                    console.log("Géolocalisation refusée ou indisponible, utilisation de Libreville.");
                }
            );
        }
    }, [navigate]);

    // Composant interne pour intercepter les clics sur la carte
    const LocationFinderDummy = () => {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!client) {
            alert("❌ Erreur : Aucun client détecté.");
            return;
        }

        if (!description.trim()) {
            alert("⚠️ Veuillez remplir le champ 'Précisions'. Ce champ est obligatoire pour l'assistance.");
            return;
        }

        setLoading(true);

        const donneesSinistre = {
            police_id: client.numero_police,
            nom_client: `${client.prenom} ${client.nom}`,
            latitude: position[0],
            longitude: position[1],
            type_incident: typeIncident,
            description: description.trim(),
            statut: 'OUVERT'
        };

        try {
            const response = await fetch('https://sambavoyage.vercel.app/api/contrats/declarer-sinistre', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donneesSinistre)
            });

            if (response.ok) {
                alert("✅ Votre position et votre déclaration ont été envoyées avec succès !");
                navigate('/dashboard-client');
            } else {
                const errorData = await response.json();
                alert("❌ Erreur : " + (errorData.error || "Problème serveur"));
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            alert("❌ Impossible de joindre le serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Déclarer un Sinistre / Assistance</h2>
            <p style={styles.subtitle}>
                Client : <strong>{client?.prenom} {client?.nom}</strong> (Police: {client?.numero_police})
            </p>

            <div style={styles.card} className="sinistre-card">
                {/* --- BLOC CARTE LEAFLET --- */}
                <div style={styles.mapWrapper} className="sinistre-map">
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} key={`${position[0]}-${position[1]}`}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={position} />
                        <LocationFinderDummy />
                    </MapContainer>
                </div>

                {/* --- BLOC FORMULAIRE D'URGENCE --- */}
                <form onSubmit={handleSubmit} style={styles.form} className="sinistre-form">
                    <div style={styles.infoBox}>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Position de l'incident :</span>
                        <div style={{ fontWeight: 'bold', marginTop: '4px', fontSize: '13px' }}>
                            Lat: {position[0].toFixed(5)} | Long: {position[1].toFixed(5)}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', opacity: 0.8 }}>Vous pouvez cliquer sur la carte pour ajuster le repère.</p>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Type d'incident :</label>
                        <select 
                            value={typeIncident} 
                            onChange={(e) => setTypeIncident(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Maladie">Maladie / Hospitalisation</option>
                            <option value="Accident">Accident / Perte de documents</option>
                            <option value="Rapatriement">Rapatriement</option>
                            <option value="Vol">Vol de bagages</option>
                        </select>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Précisions (obligatoire) :</label>
                        <textarea 
                            placeholder="Décrivez l'urgence, les symptômes, ou le besoin exact d'assistance..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{...styles.input, ...styles.textarea, borderColor: description.trim() === '' ? '#f43f5e' : '#cbd5e1'}}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? "Envoi du signal..." : "ENVOYER LA DEMANDE D'ASSISTANCE"}
                    </button>
                    
                    <button type="button" onClick={() => navigate('/dashboard-client')} style={styles.cancelBtn}>
                        Retour au tableau de bord
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- DESIGN SYSTEM (PC PAR DÉFAUT : CÔTE À CÔTE) ---
const styles = {
    container: { padding: '30px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Segoe UI, system-ui, sans-serif', boxSizing: 'border-box' },
    title: { color: '#1e293b', textAlign: 'center', margin: '0 0 4px 0', fontWeight: '800', fontSize: '26px' },
    subtitle: { color: '#64748b', textAlign: 'center', margin: '0 0 25px 0', fontSize: '15px' },
    card: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'row', minHeight: '520px' },
    mapWrapper: { flex: 1.2, position: 'relative', minHeight: '350px', zIndex: 1 },
    form: { flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#ffffff', boxSizing: 'border-box', justifyContent: 'center' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontWeight: '700', color: '#334155', fontSize: '13px' },
    input: { padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#1e293b', outline: 'none', background: '#f8fafc', transition: 'border-color 0.2s' },
    textarea: { height: '100px', resize: 'none', background: '#fff' },
    infoBox: { background: '#f0f9ff', padding: '14px', borderRadius: '10px', color: '#0369a1', border: '1px solid #bae6fd' },
    submitBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', transition: 'background-color 0.2s', letterSpacing: '0.3px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' },
    cancelBtn: { background: 'none', color: '#64748b', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500', fontSize: '14px', alignSelf: 'center', marginTop: '5px' }
};

// --- MULTI-SUPPORT CSS (MOBILE & RESPONSIVE) ---
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
/* Transition focus des champs */
.sinistre-form select:focus, .sinistre-form textarea:focus {
    border-color: #3b82f6 !important;
    background-color: #fff !important;
}

/* Bascule mobile */
@media (max-width: 850px) {
    .sinistre-card {
        flex-direction: column !important;
        min-height: auto !important;
    }
    .sinistre-map {
        height: 280px !important;
        flex: none !important;
        width: 100% !important;
    }
    .sinistre-form {
        padding: 20px !important;
        flex: none !important;
        width: 100% !important;
    }
}
`;
document.head.appendChild(styleSheet);

export default DeclarerSinistre;