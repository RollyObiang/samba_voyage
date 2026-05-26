const DetailsSinistre = () => {
    const { id } = useParams();
    const [sinistre, setSinistre] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/contrats/sinistre/${id}`)
            .then(res => res.json())
            .then(data => setSinistre(data));
    }, [id]);

    if (!sinistre) return <div>Chargement...</div>;

    return (
        <div style={styles.container}>
            <h2>Détails du Sinistre Traité #{sinistre.id}</h2>
            <div style={styles.infoBox}>
                <p><strong>Statut Final :</strong> {sinistre.statut}</p>
                <p><strong>Client :</strong> {sinistre.nom_client}</p>
                <p><strong>Date de l'incident :</strong> {new Date(sinistre.created_at).toLocaleDateString()}</p>
                <hr />
                <p><strong>Description :</strong> {sinistre.description}</p>
                {/* On n'affiche pas de boutons d'action ici, c'est de l'archive */}
            </div>
            <button onClick={() => navigate(-1)}>Retour à l'historique</button>
        </div>
    );
};