import { useState } from "react";

function UpdateButton() {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch("/update-data", { method: "POST" });
            const data = await response.json();
            alert(data.status === "success" ? "Mise à jour réussie !" : "Erreur !");
        } catch (error) {
            alert("Erreur de connexion !");
        }
        setLoading(false);
    };

    return (
        <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Mise à jour en cours..." : "Mettre à jour"}
        </button>
    );
}

export default UpdateButton;
