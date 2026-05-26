import React, { useEffect, useState } from 'react';
import { RefreshCcw, Eye, Search, Clock, CheckCircle } from 'lucide-react';

const MesContrats = () => { // On a renommé le composant ici
    const [contrats, setContrats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recherche, setRecherche] = useState('');

    const chargerMesContrats = async () => {
        setLoading(true);
        try {
            const savedData = localStorage.getItem('clientConnecte');
            if (!savedData) return;
            
            const user = JSON.parse(savedData);
            
            // CORRECTION : On utilise la nouvelle route /mes-contrats/
            // On vérifie si on a l'id_client, sinon on peut utiliser un paramètre de secours
            const targetId = user.id_client; 
            
            const res = await fetch(`http://localhost:3000/api/contrats/mes-contrats/${targetId}`);
            const data = await res.json();
            
            // On s'assure que data est bien un tableau
            setContrats(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur de chargement des contrats :", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerMesContrats();
    }, []);

    const contratsFiltres = contrats.filter(c => 
        c.numero_police?.toLowerCase().includes(recherche.toLowerCase()) ||
        c.destination?.toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Mes Contrats d'Assurance</h2>
                    <p style={styles.subtitle}>Retrouvez ici l'historique de vos couvertures Samba Voyage.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={styles.searchContainer}>
                        <Search size={18} color="#94a3b8" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une police..." 
                            style={styles.inputSearch}
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                        />
                    </div>
                    <button onClick={chargerMesContrats} style={styles.btnRefresh} title="Actualiser">
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={styles.loader}>Chargement de vos contrats...</div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th>N° POLICE</th>
                                <th>DESTINATION</th>
                                <th>DATE D'EFFET</th>
                                <th>MONTANT</th>
                                <th>STATUT</th>
                                <th style={{textAlign: 'center'}}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contratsFiltres.length > 0 ? (
                                contratsFiltres.map((c, index) => (
                                    <tr key={index} style={styles.tr}>
                                        <td style={styles.police}>{c.numero_police}</td>
                                        <td>{c.destination}</td>
                                        <td>{new Date(c.date_effet).toLocaleDateString()}</td>
                                        <td style={styles.montant}>{Number(c.montant).toLocaleString()} FCFA</td>
                                        <td>
                                            <span style={styles.statusBadge}>
                                                <CheckCircle size={14} /> {c.statut_police || 'Validé'}
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'center'}}>
                                            <button style={styles.btnView} title="Voir détails">
                                                <Eye size={18} color="#64748b" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={styles.empty}>
                                        <Clock size={48} color="#cbd5e1" style={{marginBottom: '10px'}} />
                                        <p>Aucun contrat trouvé.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ... (Garder les mêmes styles que tu as fournis)
const styles = {
    container: { padding: '40px', background: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' },
    title: { margin: 0, color: '#1e293b', fontSize: '24px' },
    subtitle: { margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' },
    searchContainer: { display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 15px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    inputSearch: { border: 'none', background: 'transparent', outline: 'none', width: '200px', color: '#1e293b' },
    btnRefresh: { background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', color: '#64748b' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    thead: { background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '12px', letterSpacing: '1px' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: '0.2s' },
    police: { fontWeight: 'bold', color: '#e11d48', padding: '20px 0' },
    montant: { fontWeight: 'bold', color: '#1e293b' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#dcfce7', color: '#15803d', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    btnView: { border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
    empty: { textAlign: 'center', padding: '60px', color: '#94a3b8' },
    loader: { textAlign: 'center', padding: '40px', color: '#64748b' }
};

export default MesContrats;