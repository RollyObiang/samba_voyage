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

    useEffect(() => {
        const savedClient = localStorage.getItem('clientConnecte');
        if (savedClient) {
            setClient(JSON.parse(savedClient));
        } else {
            navigate('/espace-client');
        }
    }, [navigate]);

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
        
        // --- VÉRIFICATION DES CHAMPS ---
        if (!client) {
            alert("❌ Erreur : Aucun client détecté.");
            return;
        }

        if (!description.trim()) {
            alert("⚠️ Veuillez remplir le champ 'Précisions'. Ce champ est obligatoire pour l'assistance.");
            return;
        }
        // -------------------------------

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
            const response = await fetch('http://localhost:3000/api/contrats/declarer-sinistre', {
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

            <div style={styles.card}>
                <div style={styles.mapWrapper}>
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={position} />
                        <LocationFinderDummy />
                    </MapContainer>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.infoBox}>
                        <strong>Coordonnées sélectionnées :</strong><br/>
                        Lat: {position[0].toFixed(4)} | Long: {position[1].toFixed(4)}
                    </div>

                    <label style={styles.label}>Type d'incident :</label>
                    <select 
                        value={typeIncident} 
                        onChange={(e) => setTypeIncident(e.target.value)}
                        style={styles.input}
                    >
                        <option value="Maladie">Maladie/Hospitalisation</option>
                        <option value="Accident">Accident/Perte de documents</option>
                        <option value="Rapatriement">Rapatriement</option>
                        <option value="Vol">Vol de bagages</option>
                    </select>

                    <label style={styles.label}>Précisions (obligatoire) :</label>
                    <textarea 
                        placeholder="Détaillez l'urgence ici..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{...styles.input, height: '80px', borderColor: description.trim() === '' ? '#ef4444' : '#ccc'}}
                        required
                    />

                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? "Envoi en cours..." : "ENVOYER L'ASSISTANCE"}
                    </button>
                    
                    <button type="button" onClick={() => navigate('/dashboard-client')} style={styles.cancelBtn}>
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial' },
    title: { color: '#1e293b', textAlign: 'center', marginBottom: '5px' },
    subtitle: { color: '#64748b', textAlign: 'center', marginBottom: '20px' },
    card: { background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
    mapWrapper: { height: '350px', width: '100%', borderBottom: '2px solid #eee' },
    form: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' },
    label: { fontWeight: 'bold', color: '#333' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    infoBox: { background: '#f0f9ff', padding: '10px', borderRadius: '5px', color: '#0369a1', border: '1px solid #bae6fd' },
    submitBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
    cancelBtn: { background: 'none', color: '#64748b', border: 'none', cursor: 'pointer', textDecoration: 'underline' }
};

export default DeclarerSinistre;