import pandas as pd
import mysql.connector
import os

DB_CONFIG = {
    "host": "db",
    "user": "root",
    "password": "root",
    "database": "ping"
}

XLSX_FILE = "data/raw/Excel_concatene.xlsx"

print("🚀 Début du script...")

if not os.path.exists(XLSX_FILE):
    print("⚠️ Fichier introuvable :", XLSX_FILE)
    exit()

print("📂 Chargement du fichier :", XLSX_FILE)
df = pd.read_excel(XLSX_FILE, dtype=str)

print("🔍 Colonnes disponibles :", df.columns.tolist())

df["Poids"] = df["Poids"].str.replace(",", ".").astype(float)
df["Poids total"] = df["Poids total"].str.replace(",", ".").astype(float)

print(f"📊 {len(df)} lignes chargées dans le dataframe.")

df = df.fillna(0)  # Remplace tous les NaN par 0, les NaN se trouvent dans la colonne poids et poids total

# Vérifier s'il reste encore des NaN
print("Vérification après nettoyage :", df.isna().sum().sum(), "NaN restants")

print("🔗 Connexion à la base de données...")
conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()

cursor.execute("DELETE FROM Logistique")

# Insertion avec transformation des NaN
for index, row in df.iterrows():
    cleaned_row = tuple(None if (x is None or str(x).lower() == "nan") else x for x in row)

    cursor.execute("""
        INSERT INTO Logistique (date_expedition, designation_article, poids, qte_cdee, qte_livree, poids_total, annee_semaine)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE poids=VALUES(poids), qte_cdee=VALUES(qte_cdee), qte_livree=VALUES(qte_livree), poids_total=VALUES(poids_total);
    """, cleaned_row)

conn.commit()
cursor.close()
conn.close()

print("✅ Données importées avec succès !")