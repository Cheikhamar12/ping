import { useState } from "react";
import Layout from '../components/Layout';

function UpdateButton() {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/update-data", { method: "POST" });
            const data = await response.json();
            
            console.log("🚀 Réponse du backend :", data);
            alert(data.status === "success" ? "Mise à jour réussie !" : `Erreur ! ${data.error}`);
    
            if (data.output) {
                console.log("📜 Output du script :", data.output);
            }
            if (data.error) {
                console.error("❌ Erreur du script :", data.error);
            }
        } catch (error) {
            console.error("❌ Erreur de connexion :", error);
            alert("Erreur de connexion !");
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="updateButtonPage">
                <div className="updateButtonBox">
                    <h2 style={styles.subtitle}>Mettre à jour les données</h2>
                    
                    <div style={styles.buttonContainer}>
                        <button 
                            onClick={handleUpdate} 
                            disabled={loading} 
                            style={{
                                ...styles.submitButton,
                                ...((loading) && styles.submitButtonDisabled)
                            }}
                        >
                            {loading ? "Mise à jour en cours..." : "Mettre à jour"}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    updateButtonPage: {
        maxWidth: '800px',
        minHeight: '120vh', // S'assure qu'il occupe toute la hauteur de l'écran
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centre verticalement
    },
    updateButtonBox: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    subtitle: {
        fontSize: '18px',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    submitButton: {
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
};



export default UpdateButton;