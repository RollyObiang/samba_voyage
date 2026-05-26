import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, ShieldCheck, MapPin, Calendar, User } from 'lucide-react';
import logoSamba from '../assets/Logo Samba.jpeg';

const DetailContrat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contrat, setContrat] = useState(null);

    useEffect(() => {
        // Récupération du contrat spécifique par ID
        fetch(`http://localhost:3000/api/contrats/detail/${id}`)
            .then(res => res.json())
            .then(data => setContrat(data))
            .catch(err => console.error("Erreur récupération détail:", err));
    }, [id]);

    const imprimer = () => {
        window.print();
    };

    if (!contrat) return <div style={{padding: '50px', textAlign: 'center'}}>Chargement du contrat...</div>;

    return (
        <div style={styles.page}>
            {/* Barre d'outils (cachée à l'impression) */}
            <div style={styles.noPrint}>
                <button onClick={() => navigate(-1)} style={styles.btnBack}>
                    <ArrowLeft size={18} /> Retour
                </button>
                <button onClick={imprimer} style={styles.btnPrint}>
                    <Printer size={18} /> Imprimer le contrat
                </button>
            </div>

            {/* Zone du Contrat (Ce qui sera imprimé) */}
            <div style={styles.ticket} className="printable-area">
                <header style={styles.ticketHeader}>
                    <img src={logoSamba} alt="Samba Voyage" style={styles.logo} />
                    <div style={{textAlign: 'right'}}>
                        <h1 style={styles.ticketTitle}>ATTESTATION D'ASSURANCE</h1>
                        <p style={styles.policeNumber}>N° Police : {contrat.numero_police}</p>
                    </div>
                </header>

                <div style={styles.divider} />

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><User size={16} /> INFORMATIONS DE L'ASSURÉ</h2>
                    <div style={styles.grid}>
                        <p><strong>Nom complet :</strong> {contrat.nom_client}</p>
                        <p><strong>Passeport :</strong> {contrat.num_passeport || 'Non renseigné'}</p>
                        <p><strong>Date de naissance :</strong> {contrat.date_naissance || 'N/A'}</p>
                    </div>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><MapPin size={16} /> DÉTAILS DU VOYAGE</h2>
                    <div style={styles.grid}>
                        <p><strong>Destination :</strong> {contrat.destination}</p>
                        <p><strong>Zone :</strong> {contrat.zone_geographique || 'Monde'}</p>
                        <p><strong>Motif :</strong> {contrat.motif_voyage || 'Tourisme'}</p>
                    </div>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><Calendar size={16} /> PÉRIODE DE COUVERTURE</h2>
                    <div style={styles.validityBox}>
                        <p>Du <strong>{new Date(contrat.date_debut).toLocaleDateString()}</strong> au <strong>{new Date(contrat.date_fin).toLocaleDateString()}</strong></p>
                    </div>
                </section>

                <div style={styles.footerNote}>
                    <p><ShieldCheck size={14} /> Ce contrat est géré en partenariat avec <strong>Africa First Assist</strong>.</p>
                    <p style={{fontSize: '10px', marginTop: '10px'}}>Document généré le {new Date().toLocaleString()} par Samba Voyage.</p>
                </div>
            </div>

            {/* CSS spécifique pour l'impression */}
            <style>{`
                @media print {
                    .${styles.noPrint} { display: none !important; }
                    body { background: white !important; }
                    .${styles.page} { padding: 0 !important; }
                    .${styles.ticket} { box-shadow: none !important; border: none !important; }
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: { padding: '40px 5%', background: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    noPrint: { display: 'flex', gap: '15px', width: '100%', maxWidth: '800px', marginBottom: '20px' },
    btnBack: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    btnPrint: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#0070bb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    
    ticket: { background: 'white', width: '100%', maxWidth: '800px', padding: '50px', borderRadius: '5px', boxShadow: '0 0 20px rgba(0,0,0,0.1)', minHeight: '1000px' },
    ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    logo: { height: '60px' },
    ticketTitle: { color: '#1e293b', fontSize: '22px', margin: 0 },
    policeNumber: { color: '#0070bb', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' },
    divider: { height: '2px', background: '#f1f5f9', margin: '20px 0' },
    
    section: { marginBottom: '30px' },
    sectionTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '15px', textTransform: 'uppercase' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    validityBox: { background: '#f8fafc', padding: '20px', borderRadius: '10px', textAlign: 'center', border: '1px dashed #cbd5e1' },
    footerNote: { marginTop: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }
};

export default DetailContrat;