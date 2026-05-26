import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, FileText, Calendar, MapPin, ShieldCheck, Phone } from 'lucide-react';
import logoSamba from '../assets/Logo Samba.jpeg'; // Chemin mis à jour vers src/assets

const SuiviClient = () => {
    const [recherche, setRecherche] = useState('');
    const [resultats, setResultats] = useState([]);
    const [chargement, setChargement] = useState(false);
    const navigate = useNavigate();

    const rechercherDossier = async (e) => {
        e.preventDefault();
        setChargement(true);
        try {
            const res = await fetch(`http://localhost:3000/api/recherche-client?q=${recherche}`);
            const data = await res.json();
            setResultats(data);
        } catch (err) {
            console.error("Erreur de recherche", err);
        } finally {
            setChargement(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* LOGO CLIQUABLE POUR RETOUR ACCUEIL */}
            <div style={styles.topBar}>
                <img 
                    src={logoSamba} 
                    alt="Logo Samba" 
                    style={styles.logo} 
                    onClick={() => navigate('/')}
                    title="Retour à l'accueil"
                />
            </div>

            <div style={styles.header}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
                    <Search color="#0070bb" /> Suivi et Recherche Client
                </h2>
                <p style={{ color: '#64748b' }}>Retrouvez un contrat ou un historique de sinistre en un instant.</p>
            </div>

            {/* Barre de recherche */}
            <form onSubmit={rechercherDossier} style={styles.searchBox}>
                <input 
                    type="text" 
                    placeholder="Nom du client, N° de police ou Passeport..." 
                    style={styles.input}
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                />
                <button type="submit" style={styles.btnSearch}>
                    {chargement ? 'Recherche...' : 'RECHERCHER'}
                </button>
            </form>

            {/* Résultats */}
            <div style={styles.resultsList}>
                {resultats.length > 0 ? (
                    resultats.map((res) => (
                        <div key={res.id} style={styles.resultCard}>
                            <div style={styles.cardHeader}>
                                <div style={styles.clientInfo}>
                                    <User size={20} color="#0070bb" />
                                    <h3 style={{ margin: 0 }}>{res.souscripteur_nom}</h3>
                                </div>
                                <span style={styles.policeBadge}>{res.numero_police}</span>
                            </div>

                            <div style={styles.detailsGrid}>
                                <div style={styles.detailItem}>
                                    <MapPin size={16} /> <span>Destination : {res.destination}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <Calendar size={16} /> <span>Échéance : {new Date(res.date_echeance).toLocaleDateString()}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <ShieldCheck size={16} /> <span style={{color: '#39b54a'}}>Statut : {res.statut_police}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <FileText size={16} /> <span>Produit : {res.nom_produit}</span>
                                </div>
                            </div>

                            <div style={styles.actionRow}>
                                <button style={styles.btnAction}><Phone size={14} /> Contacter</button>
                                <button style={{ ...styles.btnAction, background: '#f1f5f9', color: '#1e293b' }}>Voir Historique</button>
                            </div>
                        </div>
                    ))
                ) : (
                    !chargement && recherche && <p style={styles.empty}>Aucun dossier trouvé pour "{recherche}"</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '30px 10%', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Segoe UI' },
    topBar: { marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' },
    logo: { height: '50px', cursor: 'pointer', borderRadius: '8px' },
    header: { marginBottom: '30px' },
    searchBox: { display: 'flex', gap: '10px', background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '40px' },
    input: { flex: 1, padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '16px' },
    btnSearch: { padding: '0 30px', background: '#0070bb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    resultsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    resultCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
    clientInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    policeBadge: { background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
    detailItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569' },
    actionRow: { marginTop: '20px', display: 'flex', gap: '10px' },
    btnAction: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#0070bb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
    empty: { textAlign: 'center', color: '#94a3b8', marginTop: '50px' }
};

export default SuiviClient;