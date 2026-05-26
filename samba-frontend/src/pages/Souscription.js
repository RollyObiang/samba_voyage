import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Wallet, Banknote, X, Home, ShieldCheck } from 'lucide-react';
import logoSamba from '../assets/Logo Samba.jpeg'; 

const Souscription = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Analyse de l'URL pour savoir si c'est une agence
    const queryParams = new URLSearchParams(location.search);
    const isModeAgence = queryParams.get('mode') === 'agence';

    // Récupération de la date du jour au format YYYY-MM-DD (2026)
    const aujourdhui = new Date().toISOString().split('T')[0];

    // States pour l'agence
    const [codeAgent, setCodeAgent] = useState('');
    const [infosAgence, setInfosAgence] = useState({
        nom: "SAMBA ASSURANCES GABON",
        adresse: "Libreville, Centre-Ville",
        telephone: "+241 01 02 03 04",
        email: "contact@samba-assurances.ga"
    });

    // States du formulaire
    const [nom, setNom] = useState('');
    const [passeport, setPasseport] = useState('');
    const [zone, setZone] = useState('2'); 
    const [destination, setDestination] = useState('Gabon');
    const [dateEffet, setDateEffet] = useState(aujourdhui); // Initialisé à aujourd'hui
    const [dateEcheance, setDateEcheance] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [totalTTC, setTotalTTC] = useState(27000);
    const [showModal, setShowModal] = useState(false);
    const [ageError, setAgeError] = useState('');
    const [accepteDonnees, setAccepteDonnees] = useState(false);

    // Sécurité supplémentaire : si l'utilisateur change la date d'effet, 
    // on vérifie qu'elle n'est pas antérieure à aujourd'hui
    const handleDateEffetChange = (e) => {
        const nouvelleDate = e.target.value;
        if (nouvelleDate < aujourdhui) {
            setDateEffet(aujourdhui);
        } else {
            setDateEffet(nouvelleDate);
        }
    };

    const paysCIMA = [
        "Gabon", "Bénin", "Burkina Faso", "Cameroun", "Centrafrique", 
        "Congo", "Côte d'Ivoire", "Guinée Bissau", "Guinée Équatoriale", 
        "Mali", "Niger", "Sénégal", "Tchad", "Togo"
    ];

    const enregistrerContrat = async (modePaiement) => {
        if (ageError || !dateNaissance) {
            alert(ageError || "Veuillez saisir une date de naissance valide.");
            return;
        }

        const partiesNom = nom.trim().split(' ');
        const leNom = partiesNom[0] || 'Client'; 
        const lePrenom = partiesNom.slice(1).join(' ') || 'Inconnu';
        const idGenere = leNom.charAt(0).toUpperCase() + lePrenom.charAt(0).toUpperCase() + (passeport.slice(-3) || "000");

        const contratData = {
            nom: leNom,
            prenom: lePrenom,
            passeport_numero: passeport,
            destination: destination,
            montant: parseFloat(totalTTC),
            identifiant_client: idGenere,
            date_effet: dateEffet,
            date_echeance: dateEcheance,
            mode_paiement: modePaiement,
            code_agent: isModeAgence ? codeAgent : "CLIENT_DIRECT",
            password: "Password1234" 
        };

        try {
            const response = await fetch('http://localhost:3000/api/contrats/creer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contratData),
            });

            if (response.ok) {
                const data = await response.json();
                navigate('/espace-client', { 
                    state: { 
                        nouveauClient: true, 
                        info: { ...contratData, souscripteur_nom: nom, agence: infosAgence }, 
                        police: data.numero_police 
                    } 
                });
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert("Erreur : " + (errorData.error || "Vérifiez vos champs."));
            }
        } catch (error) {
            alert("Impossible de joindre le serveur.");
        }
    };

    const handleZoneChange = (e) => {
        const nouvelleZone = e.target.value;
        setZone(nouvelleZone);
        if (nouvelleZone === "2") {
            setDestination('Gabon');
            setTotalTTC(27000);
        } else {
            setDestination('France');
            setTotalTTC(52500);
        }
    };

    const verifierAge = (date) => {
        setDateNaissance(date);
        setAgeError("");
        if (!date || date.length < 10) return; 
        const birthDate = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age >= 60) setAgeError(`Âge limite (60 ans) dépassé ! Actuellement : ${age} ans.`);
        else if (age < 0) setAgeError("Date de naissance incohérente.");
    };

    return (
        <div style={styles.body}>
            <div style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => navigate('/')} style={styles.btnHome}>
                    <Home size={18} /> 
                </button>
            </div>

            {isModeAgence && (
                <div style={styles.agentBar}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <ShieldCheck color="#3b82f6" />
                        <input 
                            placeholder="SAISIR CODE AGENT" 
                            style={styles.agentInput} 
                            value={codeAgent} 
                            onChange={(e) => setCodeAgent(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div style={{fontSize: '12px', color: '#1e40af'}}>
                        Mode de vente : <strong>AGENCE PARTENAIRE</strong>
                    </div>
                </div>
            )}

            <div style={styles.a4Page}>
                <table style={styles.headerTable}>
                    <tbody>
                        <tr>
                            <td width="20%"><img src={logoSamba} style={styles.logo} alt="Logo" /></td>
                            <td style={styles.contractTitle}>
                                <h2 style={styles.h2}>CONTRAT ASSURANCE VOYAGE : SAMBA VOYAGE</h2>
                                <p style={styles.p}>Régi par le Code des assurances CIMA</p>
                                <div style={{ fontWeight: 'bold', marginTop: '10px' }}>CONDITIONS PARTICULIERES</div>
                            </td>
                            <td width="20%" style={styles.serialNumber}>SV-{Date.now().toString().slice(-6)}</td>
                        </tr>
                    </tbody>
                </table>

                <table style={styles.mainTable}>
                    <tbody>
                        <tr>
                            <td style={styles.sectionTitle} rowSpan="3">Couverture</td>
                            <td style={styles.cellLabel}>Zone :</td>
                            <td style={styles.cellInput}>
                                <select style={styles.invisibleInput} value={zone} onChange={handleZoneChange}>
                                    <option value="2">Zone CIMA (Afrique)</option>
                                    <option value="3">Zone Europe (France)</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.cellLabel}>Pays Destination :</td>
                            <td style={styles.cellInput}>
                                {zone === "2" ? (
                                    <select style={styles.invisibleInput} value={destination} onChange={(e) => setDestination(e.target.value)}>
                                        {paysCIMA.map((pays) => <option key={pays} value={pays}>{pays}</option>)}
                                    </select>
                                ) : (
                                    <input style={styles.invisibleInput} value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ex: France" />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.cellLabel}>Période :</td>
                            <td style={styles.cellInput}>
                                effet <input 
                                        type="date" 
                                        style={styles.dateField} 
                                        value={dateEffet} 
                                        min={aujourdhui} // Bloque les dates passées
                                        onChange={handleDateEffetChange} 
                                      /> 
                                échéance <input 
                                            type="date" 
                                            style={styles.dateField} 
                                            value={dateEcheance} 
                                            min={dateEffet} // L'échéance doit être après l'effet
                                            onChange={(e) => setDateEcheance(e.target.value)} 
                                         />
                            </td>
                        </tr>

                        <tr>
                            <td style={styles.sectionTitle} rowSpan="3">Souscripteur</td>
                            <td style={styles.cellLabel}>Nom & Prénom :</td>
                            <td style={styles.cellInput}><input style={styles.invisibleInput} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Saisir..." /></td>
                        </tr>
                        <tr>
                            <td style={styles.cellLabel}>N° Passeport :</td>
                            <td style={styles.cellInput}><input style={styles.invisibleInput} value={passeport} onChange={(e) => setPasseport(e.target.value)} placeholder="Saisir..." /></td>
                        </tr>
                        <tr>
                            <td style={styles.cellLabel}>Né(e) le :</td>
                            <td style={styles.cellInput}>
                                <input type="date" style={styles.dateField} value={dateNaissance} onChange={(e) => verifierAge(e.target.value)} />
                                {ageError && <div style={{ color: 'red', fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>⚠️ {ageError}</div>}
                            </td>
                        </tr>

                        <tr>
                            <td style={styles.sectionTitle}>Prestataire</td>
                            <td style={styles.cellLabel}>Assistance :</td>
                            <td style={styles.cellInput}>
                                <div style={{fontSize: '13px', fontWeight: 'bold'}}>AFRICA FIRST ASSIST (AFA)</div>
                                <div style={{fontSize: '10px', color: '#475569'}}>Assistance médicale 24h/24 mondiale.</div>
                            </td>
                        </tr>

                        <tr>
                            <td style={styles.sectionTitle}>Cotisations</td>
                            <td style={styles.cellLabel}>Total TTC :</td>
                            <td style={styles.cellInput}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <input type="number" style={{...styles.invisibleInput, fontWeight: 'bold', width: '100px'}} value={totalTTC} readOnly />
                                    <span style={{fontWeight: 'bold', marginLeft: '5px'}}>FCFA</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={styles.rgpdBox}>
                    <input type="checkbox" id="rgpd" checked={accepteDonnees} onChange={(e) => setAccepteDonnees(e.target.checked)} />
                    <label htmlFor="rgpd" style={{fontSize: '11px', marginLeft: '10px', cursor: 'pointer'}}>
                        J'accepte le traitement de mes données par <strong>SAG</strong> conformément à la réglementation en vigueur.
                    </label>
                </div>

                <div style={styles.signatureSection}>
                    <div><strong>Le Souscripteur</strong><div style={styles.signatureBox}></div></div>
                    <div style={{ textAlign: 'center', fontSize: '8px', color: '#64748b', alignSelf: 'flex-end' }}>F1: SAMB'A | F2: AFA | F3: ASSURÉ</div>
                    <div><strong>L'Assureur (Samba)</strong><div style={styles.signatureBox}></div></div>
                </div>
            </div>

            <div style={styles.btnContainer}>
                <button onClick={() => window.print()} style={styles.btnPrint}>Imprimer</button>
                <button 
                    onClick={() => {
                        if(!ageError && dateNaissance && (!isModeAgence || codeAgent)) {
                            setShowModal(true);
                        } else {
                            alert(isModeAgence && !codeAgent ? "Veuillez saisir votre code agent" : ageError || "Veuillez remplir ces champs.");
                        }
                    }} 
                    style={(accepteDonnees && !ageError && (!isModeAgence || codeAgent)) ? styles.btnValidate : styles.btnDisabled}
                    disabled={!accepteDonnees || ageError !== "" || (isModeAgence && !codeAgent)}
                >
                    Valider & Payer
                </button>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Mode de paiement</h3>
                        <div style={styles.paymentOptions}>
                            <button style={styles.payBtn} onClick={() => enregistrerContrat('Airtel Money')}><Smartphone /><span>Airtel</span></button>
                            <button style={styles.payBtn} onClick={() => enregistrerContrat('Moov Money')}><Wallet /><span>Moov</span></button>
                            <button style={styles.payBtn} onClick={() => enregistrerContrat('Espèces')}><Banknote /><span>Espèces</span></button>
                            <button style={{...styles.payBtn, color: 'red'}} onClick={() => setShowModal(false)}><X /><span>Annuler</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    body: { background: '#f0f2f5', padding: '20px', minHeight: '100vh', fontFamily: 'sans-serif' },
    btnHome: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    agentBar: { maxWidth: '800px', margin: '0 auto 20px auto', background: '#eff6ff', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #3b82f6' },
    agentInput: { border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', fontWeight: 'bold', width: '200px', color: '#1e40af' },
    a4Page: { background: 'white', width: '800px', margin: '0 auto', padding: '30px', border: '1px solid #d1d5db', boxSizing: 'border-box' },
    headerTable: { width: '100%', marginBottom: '20px' },
    logo: { width: '100px' },
    contractTitle: { textAlign: 'center' },
    h2: { margin: 0, fontSize: '16px' },
    p: { margin: 0, fontSize: '10px' },
    serialNumber: { color: '#e11d48', fontWeight: 'bold', textAlign: 'right' },
    mainTable: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
    sectionTitle: { border: '1px solid #000', background: '#f8fafc', fontWeight: 'bold', fontSize: '11px', width: '110px', textAlign: 'center', textTransform: 'uppercase' },
    cellLabel: { border: '1px solid #000', padding: '8px', fontSize: '11px', fontWeight: '500', width: '130px' },
    cellInput: { border: '1px solid #000', padding: '5px 10px' },
    invisibleInput: { border: 'none', width: '100%', outline: 'none', fontSize: '13px', background: 'transparent', cursor: 'pointer' },
    dateField: { border: 'none', fontSize: '12px', outline: 'none', background: 'transparent', cursor: 'pointer' },
    rgpdBox: { marginTop: '20px', display: 'flex', alignItems: 'center', padding: '10px', background: '#f1f5f9', borderRadius: '5px' },
    signatureSection: { display: 'flex', justifyContent: 'space-between', marginTop: '30px' },
    signatureBox: { border: '1px solid #000', width: '180px', height: '70px', marginTop: '5px' },
    btnContainer: { textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' },
    btnPrint: { padding: '12px 30px', background: '#64748b', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none' },
    btnValidate: { padding: '12px 30px', background: '#39b54a', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold' },
    btnDisabled: { padding: '12px 30px', background: '#cbd5e1', color: '#94a3b8', borderRadius: '8px', cursor: 'not-allowed', border: 'none' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { background: 'white', padding: '30px', borderRadius: '15px', width: '350px', textAlign: 'center' },
    paymentOptions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' },
    payBtn: { border: '1px solid #e2e8f0', background: '#f8fafc', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }
};

export default Souscription;