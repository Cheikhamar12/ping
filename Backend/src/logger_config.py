import logging
import os
from datetime import datetime

def setup_logger():
    # Créer le dossier logs s'il n'existe pas
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Configurer le logger
    logger = logging.getLogger('data_processing')
    logger.setLevel(logging.INFO)
    
    # Créer un fichier de log avec la date
    log_filename = f"logs/processing_{datetime.now().strftime('%Y%m%d')}.log"
    file_handler = logging.FileHandler(log_filename)
    
    # Définir le format des logs
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    return logger
