import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, FileText, AlertCircle, Upload } from 'lucide-react';
import logoSamba from '../assets/samb-assurances.png'; 

const ValiderSinistre = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sinistre, setSinistre] = useState(null);
    const [commentaire, setCommentaire] = useState("");
    const [fichier, setFichier] = useState(null); // Pour le fichier
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetch(`https://sambavoyage.vercel.app/api/contrats/sinistre/${id}`) 
            .then(res => res.json())
            .then(data => {
                setSinistre(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur:", err);
                setLoading(false);
            });
    }, [id]);

    const repondreALafa = async () => {
        // VALIDATION
        if (!commentaire.trim()) {
            alert("Veuillez saisir un commentaire pour plus de précision.");
            return;
        }

        if (!window.confirm("Voulez-vous renvoyer ce dossier à l'AFA avec les compléments ?")) return;

        setSending(true);
        
        // Utilisation de FormData pour envoyer texte + fichier
        const formData = new FormData();
        formData.append('nouveauStatut', 'ATTENTE_AFA');
        formData.append('commentaire', commentaire);
        if (fichier) {
            formData.append('document', fichier);
        }

        try {
            const res = await fetch(`https://sambavoyage.vercel.app/api/contrats/valider-sinistre/${id}`, {
                method: 'PUT',
                // Note: Ne pas mettre 'Content-Type' header quand on utilise FormData
                body: formData 
            });

            if (res.ok) {
                alert("✅ Dossier complété et renvoyé à l'AFA !");
                navigate('/dashboard-agence'); 
            } else {
                alert("Erreur lors de la mise à jour du dossier.");
            }
        } catch (error) {
            console.error("Erreur technique:", error);
            alert("Erreur lors de l'envoi au serveur");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div style={styles.loader}>Chargement du dossier...</div>;
    if (!sinistre) return <div style={styles.loader}>Dossier introuvable.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <button onClick={() => navigate(-1)} style={styles.btnBack}>
                    <ArrowLeft size={18} /> Retour
                </button>
                <img src={logoSamba} alt="Samba Assurances" style={styles.logo} />
            </div>

            <div style={styles.card}>
                <div style={styles.header}>
                    <div>
                        <h2 style={{ margin: 0, color: '#1e293b' }}>Dossier Sinistre #{sinistre.id}</h2>
                        <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '15px' }}>
                            Client : <strong>{sinistre.nom_client}</strong>
                        </p>
                    </div>
                    <span style={styles.statusBadge(sinistre.statut)}>
                        {sinistre.statut === 'AFA_DEMANDE_INFOS_SAMBA' ? 'Infos Requises' : sinistre.statut}
                    </span>
                </div>

                <hr style={styles.hr} />

                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}><FileText size={16} /> Détails de l'incident</h4>
                    <div style={styles.infoRow}>
                        <strong>Type :</strong> {sinistre.type_incident}
                    </div>
                    <div style={styles.infoRow}>
                        <strong>Description :</strong> 
                        <p style={styles.descriptionText}>{sinistre.description}</p>
                    </div>
                </div>

                {sinistre.statut === 'AFA_DEMANDE_INFOS_SAMBA' ? (
                    <div style={styles.replyBox}>
                        <h3 style={styles.replyTitle}>
                            <AlertCircle size={20} /> Action Requise : Compléments pour l'AFA
                        </h3>

                                                <div style={{ marginBottom: '20px' }}>
                            <label style={styles.label}>Pièce jointe (Optionnel) :</label>
                            <div style={styles.fileInputWrapper}>
                                <input 
                                    type="file" 
                                    onChange={(e) => setFichier(e.target.files[0])}
                                    style={styles.fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={styles.fileLabel}>
                                    <Upload size={18} /> {fichier ? fichier.name : "Choisir un document (PDF, Image...)"}
                                </label>
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={styles.label}>Explications des modifications :</label>
                            <textarea 
                                style={styles.textarea}
                                placeholder="Ex: Ajoutée un commentaire pour plus de précision..."
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                            />
                        </div>

                        <button onClick={repondreALafa} disabled={sending} style={styles.btnSubmit}>
                            <Send size={18} /> {sending ? "Envoi en cours..." : "Confirmer et renvoyer à l'AFA"}
                        </button>
                    </div>
                ) : (
                    <div style={styles.infoFooter}>
                        ✅ Ce dossier a déjà été transmis à l'AFA.
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px 5%', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '900px', margin: '0 auto 20px auto' },
    logo: { height: '45px', width: 'auto', borderRadius: '5px' },
    btnBack: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontWeight: '600' },
    card: { background: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '900px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    hr: { border: 'none', borderBottom: '1px solid #e2e8f0', margin: '20px 0' },
    section: { marginBottom: '25px' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    infoRow: { marginBottom: '10px', fontSize: '15px', color: '#1e293b' },
    descriptionText: { background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginTop: '8px', lineHeight: '1.5' },
    replyBox: { marginTop: '40px', padding: '25px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' },
    replyTitle: { color: '#b45309', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px 0', fontSize: '18px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#92400e' },
    textarea: { width: '100%', minHeight: '100px', padding: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' },
    fileInputWrapper: { position: 'relative' },
    fileInput: { display: 'none' },
    fileLabel: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'white', border: '2px dashed #cbd5e1', borderRadius: '10px', cursor: 'pointer', color: '#64748b', fontSize: '14px' },
    btnSubmit: { marginTop: '20px', width: '100%', padding: '14px', background: '#ed1c24', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
    infoFooter: { textAlign: 'center', marginTop: '30px', color: '#10b981', fontSize: '14px', fontWeight: 'bold', padding: '15px', background: '#dcfce7', borderRadius: '8px' },
    loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' },
    statusBadge: (statut) => {
        const isInfo = statut === 'AFA_DEMANDE_INFOS_SAMBA';
        return {
            background: isInfo ? '#fef3c7' : '#dcfce7',
            color: isInfo ? '#d97706' : '#15803d',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            border: isInfo ? '1px solid #fde68a' : '1px solid #bbf7d0'
        };
    }
};

export default ValiderSinistre;