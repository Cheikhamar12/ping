import pandas as pd
import mysql.connector
import os

# Paramètres de la base de données
DB_CONFIG = {
    "host": "db",
    "user": "root",
    "password": "root",
    "database": "ping"
}

# Chemin du fichier CSV
CSV_FILE = "Backend/data/raw/Excel_concatene.xlsx"

# Vérifier si le fichier existe
if not os.path.exists(CSV_FILE):
    print("⚠️ Fichier introuvable :", CSV_FILE)
    exit()

# Charger le CSV
df = pd.read_csv(CSV_FILE, delimiter=";", dtype=str)

# Correction des formats
df["poids"] = df["poids"].str.replace(",", ".").astype(float)
df["poids_total"] = df["poids_total"].str.replace(",", ".").astype(float)

# Connexion à la base de données
conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()

# Insertion des nouvelles données en évitant les doublons
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO Logistique (date_expedition, designation_article, poids, qte_cdee, qte_livree, poids_total, annee_semaine)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE poids=VALUES(poids), qte_cdee=VALUES(qte_cdee), qte_livree=VALUES(qte_livree), poids_total=VALUES(poids_total);
    """, tuple(row))

# Valider et fermer la connexion
conn.commit()
cursor.close()
conn.close()

print("✅ Données importées avec succès !")
