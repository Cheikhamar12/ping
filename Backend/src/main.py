import os
from data_processing import process_file
from logger_config import setup_logger
from shutil import copy2
from datetime import datetime

logger = setup_logger()

def initialize_folders():
    """Crée les dossiers nécessaires"""
    folders = ['data/raw', 'data/processed']
    for folder in folders:
        os.makedirs(folder, exist_ok=True)

def setup_initial_data(initial_file_path: str):
    """Configure le fichier initial"""
    if not os.path.exists('data/processed/Excel_concatene.xlsx'):
        copy2(initial_file_path, 'data/processed/Excel_concatene.xlsx')
        logger.info("Fichier initial copié avec succès")

def handle_new_file(file_path: str):
    """Gère un nouveau fichier uploadé"""
    try:
        # Créer un nom unique pour le fichier
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"upload_{timestamp}.xlsx"
        
        # Sauvegarder dans raw
        raw_path = os.path.join('data/raw', filename)
        copy2(file_path, raw_path)
        
        # Traiter le fichier
        result = process_file(raw_path)
        
        if result['status'] == 'success':
            logger.info(f"Traitement réussi: {result['message']}")
            return True
        else:
            logger.error(f"Erreur de traitement: {result.get('error', 'Erreur inconnue')}")
            return False
            
    except Exception as e:
        logger.error(f"Erreur lors du traitement du fichier: {str(e)}")
        return False

def test_processing():
    """Test du processus complet"""
    try:
        # 1. Initialiser les dossiers
        initialize_folders()
        
        # 2. Configurer le fichier initial si nécessaire
        initial_file = "chemin/vers/votre/fichier_initial.xlsx"
        setup_initial_data(initial_file)
        
        # 3. Tester avec un nouveau fichier
        new_file = "chemin/vers/nouveau_fichier.xlsx"
        success = handle_new_file(new_file)
        
        if success:
            print("Test réussi !")
            print("Fichiers générés :")
            print("- data/processed/Excel_concatene.xlsx")
            print("- data/processed/Dataframe_par_jour_modele.csv")
        else:
            print("Le test a échoué")
            
    except Exception as e:
        print(f"Erreur lors du test: {str(e)}")

if __name__ == "__main__":
    test_processing()