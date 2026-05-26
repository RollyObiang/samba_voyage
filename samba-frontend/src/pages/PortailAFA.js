import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowLeft, Send, Paperclip, ExternalLink, MapPin, XCircle, HelpCircle, Check } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import logoAFA from '../assets/Africa First Assist_.jpeg';

const PortailAFA = () => {
    const [sinistres, setSinistres] = useState([]);
    const [dossierSelectionne, setDossierSelectionne] = useState(null);
    const [ongletHistorique, setOngletHistorique] = useState(false); 
    const navigate = useNavigate();

    const chargerDonnees = () => {
        fetch('http://localhost:3000/api/contrats/liste-sinistres')
            .then(res => res.json())
            .then(data => {
                setSinistres(Array.isArray(data) ? data : []);
                if (dossierSelectionne) {
                    const misAJour = data.find(d => d.id === dossierSelectionne.id);
                    if (misAJour) setDossierSelectionne(misAJour);
                }
            })
            .catch(err => console.error("Erreur chargement :", err));
    };

    useEffect(() => {
        chargerDonnees();
        const interval = setInterval(chargerDonnees, 30000);
        return () => clearInterval(interval);
    }, [dossierSelectionne]);

   const gererActionAFA = async (id, action) => {
        let url = '';
        let messageSucces = '';

        if (action === 'INFOS') {
            url = `http://localhost:3000/api/contrats/valider-sinistre/${id}`;
            messageSucces = "✅ Demande d'informations envoyée !";
        } else if (action === 'REFUSER') {
            url = `http://localhost:3000/api/contrats/rejeter-sinistre/${id}`;
            messageSucces = "🚫 Sinistre rejeté.";
        } else if (action === 'CONFIRMER') {
            url = `http://localhost:3000/api/contrats/valider-paiement/${id}`; 
            messageSucces = "💰 Paiement confirmé !";
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                // 1. On ferme immédiatement la vue détaillée pour éviter le blocage visuel
                setDossierSelectionne(null);
                
                // 2. On bascule sur l'onglet historique car le dossier n'est plus une "alerte"
                setOngletHistorique(true);

                // 3. On informe l'utilisateur
                alert(messageSucces);

                // 4. On force le rechargement des données depuis le serveur
                setTimeout(() => {
                    chargerDonnees();
                }, 100); 
            } else {
                alert("Erreur lors de l'action.");
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
            alert("Impossible de contacter le serveur.");
        }
    };

    // --- FILTRAGE DES DOSSIERS ---
    const dossiersEnAttente = sinistres.filter(s => {
        const stat = (s.statut || "").toUpperCase();
        const enCours = ['TRANSMIS', 'ATTENTE_AFA', 'OUVERT', 'EN_ATTENTE_SAMBA'].includes(stat);
        const dejaFini = ['APPROUVE', 'APPROUVÉ', 'REJETE', 'REFUSE_AFA'].includes(stat);
        return enCours && !dejaFini;
    });

    const dossiersTraites = sinistres.filter(s => {
        const stat = (s.statut || "").toUpperCase();
        return ['APPROUVE', 'APPROUVÉ', 'REJETE', 'REFUSE_AFA', 'AFA_DEMANDE_INFOS_SAMBA', 'VALIDE', 'TERMINE'].includes(stat);
    });

    // --- VUE DÉTAILLÉE ---
    if (dossierSelectionne) {
        const statutHaut = (dossierSelectionne.statut || "").toUpperCase();
        const estDejaTraite = ['APPROUVE', 'APPROUVÉ', 'REJETE', 'REFUSE_AFA'].includes(statutHaut);

        return (
            <div style={styles.container}>
                <button 
                    onClick={() => {
                        setDossierSelectionne(null);
                        // Si le dossier est traité, on s'assure d'être sur l'onglet historique
                        if (estDejaTraite) setOngletHistorique(true);
                    }} 
                    style={styles.btnRetour}
                >
                    <ArrowLeft size={18} /> Retour à la liste
                </button>
                
                <div style={styles.detailCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{margin: 0}}>Dossier Client : {dossierSelectionne.nom_client}</h2>
                            <p style={{color: '#64748b', fontSize: '14px'}}>ID Sinistre: #{dossierSelectionne.id}</p>
                        </div>
                        <span style={styles.statusBadge(dossierSelectionne.statut)}>{dossierSelectionne.statut}</span>
                    </div>
                    
                    <hr style={{ margin: '20px 0', opacity: 0.1 }} />
                    
                    <div style={styles.infoGrid}>
                        <div style={styles.infoRow}><strong>N° Police :</strong> {dossierSelectionne.police_id}</div>
                        <div style={styles.infoRow}><strong>Type Incident :</strong> {dossierSelectionne.type_incident}</div>
                        <div style={styles.infoRow}><strong>Détails :</strong> {dossierSelectionne.description}</div>
                    </div>

                    {dossierSelectionne.justificatif_url && (
                        <div style={styles.attachmentBox}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Paperclip size={18} color="#0070bb" />
                                <strong>Document joint :</strong>
                            </div>
                            <a href={`http://localhost:3000/${dossierSelectionne.justificatif_url}`} target="_blank" rel="noreferrer" style={styles.linkFile}>
                                <ExternalLink size={14} /> Consulter la pièce jointe
                            </a>
                        </div>
                    )}
                    
                    {/* Les actions ne s'affichent QUE si on n'est pas dans l'historique et pas déjà traité */}
                    {!ongletHistorique && !estDejaTraite && (
                        <div style={styles.afaActionsContainer}>
                            {(statutHaut === 'OUVERT' || statutHaut === 'ATTENTE_AFA' || statutHaut === 'TRANSMIS') && (
                                <button 
                                    onClick={() => gererActionAFA(dossierSelectionne.id, 'CONFIRMER')} 
                                    style={{...styles.btnAfa, background: '#10b981'}}
                                >
                                    <Check size={20} /> Confirmer Paiement
                                </button>
                            )}

                            <button 
                                onClick={() => gererActionAFA(dossierSelectionne.id, 'REFUSER')} 
                                style={{...styles.btnAfa, background: '#ef4444'}}
                            >
                                <XCircle size={20} /> Refus de Sinistre
                            </button>

                            {(statutHaut === 'OUVERT' || statutHaut === 'TRANSMIS') && (
                                <button 
                                    onClick={() => gererActionAFA(dossierSelectionne.id, 'INFOS')} 
                                    style={{...styles.btnAfa, background: '#f59e0b'}}
                                >
                                    <HelpCircle size={20} /> Demande Infos
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- VUE LISTE ---
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src={logoAFA} alt="Logo AFA" style={styles.logo} onClick={() => navigate('/')} />
                    <div>
                        <h1 style={{ margin: 0, fontSize: '22px', color: '#1e293b' }}>Portail Assistance Africa First Assist</h1>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Interface de gestion des sinistres</p>
                    </div>
                </div>
            </div>

            <div style={styles.tabs}>
                <button style={!ongletHistorique ? styles.tabActive : styles.tab} onClick={() => setOngletHistorique(false)}>
                    <Clock size={18} /> Alertes à traiter ({dossiersEnAttente.length})
                </button>
                <button style={ongletHistorique ? styles.tabActive : styles.tab} onClick={() => setOngletHistorique(true)}>
                    <CheckCircle size={18} /> Suivi & Historique ({dossiersTraites.length})
                </button>
            </div>

            <div style={styles.grid}>
                {(ongletHistorique ? dossiersTraites : dossiersEnAttente).map(s => (
                    <div key={s.id} style={styles.card} onClick={() => setDossierSelectionne(s)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>REF: {s.id}</span>
                            <div style={styles.statusBadge(s.statut)}>{s.statut}</div>
                        </div>
                        <h3 style={{ margin: '10px 0', color: '#1e293b', fontSize: '16px' }}>{s.nom_client}</h3>
                        <p style={styles.p}><strong>Incident :</strong> {s.type_incident}</p>
                        <div style={styles.btnConsulter}>Ouvrir le dossier</div>
                    </div>
                ))}
            </div>

            {(ongletHistorique ? dossiersTraites : dossiersEnAttente).length === 0 && (
                <div style={styles.empty}>Aucun dossier à afficher dans cette section.</div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '30px 5%', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    header: { display: 'flex', alignItems: 'center', marginBottom: '30px', background: 'white', padding: '15px 25px', borderRadius: '15px', border: '1px solid #e2e8f0' },
    logo: { height: '50px', borderRadius: '6px', cursor: 'pointer' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '25px' },
    tab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#64748b' },
    tabActive: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#0070bb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    detailCard: { background: 'white', padding: '40px', borderRadius: '15px', border: '1px solid #e2e8f0', maxWidth: '900px', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    infoGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
    infoRow: { fontSize: '15px', color: '#1e293b' },
    attachmentBox: { marginTop: '25px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' },
    linkFile: { color: '#0070bb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' },
    btnRetour: { background: 'none', border: 'none', color: '#0070bb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontWeight: '600' },
    btnConsulter: { marginTop: '15px', textAlign: 'center', background: '#f8fafc', padding: '8px', borderRadius: '6px', color: '#0070bb', fontSize: '13px', fontWeight: 'bold' },
    afaActionsContainer: { display: 'flex', gap: '12px', marginTop: '40px' },
    btnAfa: { flex: 1, padding: '14px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' },
    p: { margin: '4px 0', color: '#475569', fontSize: '13px' },
    empty: { textAlign: 'center', marginTop: '60px', color: '#94a3b8' },
    statusBadge: (statut) => {
        const s = statut ? statut.toUpperCase() : '';
        let bg = '#f1f5f9'; let co = '#475569';
        
        if (['OUVERT', 'ATTENTE_AFA', 'TRANSMIS'].includes(s)) { bg = '#fee2e2'; co = '#ef4444'; }
        else if (s === 'AFA_DEMANDE_INFOS_SAMBA') { bg = '#fef3c7'; co = '#d97706'; }
        else if (s === 'REFUSE_AFA' || s === 'REJETE') { bg = '#fd9f9f'; co = '#e60d0d'; }
        else if (s === 'EN_ATTENTE_SAMBA') { bg = '#e0f2fe'; co = '#0369a1'; }
        else if (s === 'VALIDE' || s === 'TERMINE' || s === 'APPROUVE' || s === 'APPROUVÉ') { bg = '#dcfce7'; co = '#15803d'; }

        return { display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800', background: bg, color: co, textTransform: 'uppercase' };
    }
};

export default PortailAFA;