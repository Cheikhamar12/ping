import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Dict
import os
from pathlib import Path
from .logger_config import setup_logger
from unidecode import unidecode

logger = setup_logger()

def validate_excel_file(df: pd.DataFrame) -> List[str]:
    """Valide le format du fichier Excel"""
    errors = []
    required_columns = [
        'Date expédition', 'Désignation article', 
        'Poids', 'Qté cdée', 'Qté livrée', 'Poids total', 'Année semaine'
    ]
    
    for col in required_columns:
        if col not in df.columns:
            errors.append(f"Colonne manquante: {col}")
            logger.error(f"Validation: colonne manquante - {col}")
    
    return errors

def process_and_combine_data(new_df: pd.DataFrame) -> pd.DataFrame:
    """Combine et traite les nouvelles données"""
    try:
        logger.info(f"Début du traitement des nouvelles données. Lignes reçues: {len(new_df)}")
        
        # Chemin vers le fichier historique
        old_file_path = 'data/raw/Excel_concatene.xlsx'
        
        # Normaliser les colonnes du nouveau fichier
        new_df.columns = [unidecode(col) for col in new_df.columns]
        
        # Sélectionner uniquement les colonnes nécessaires
        columns_needed = ['Date expedition', 'Designation article', 'Poids', 
                         'Qte cdee', 'Qte livree', 'Poids total', 'Annee semaine']
        new_df = new_df[columns_needed]
        
        # Lire l'ancien fichier s'il existe
        if os.path.exists(old_file_path):
            old_df = pd.read_excel(old_file_path)
            old_df.columns = [unidecode(col) for col in old_df.columns]
            old_df = old_df[columns_needed]
            
            # Concaténer les fichiers
            combined_df = pd.concat([old_df, new_df], ignore_index=True)
        else:
            combined_df = new_df

        # Supprimer les doublons
        combined_df = combined_df.drop_duplicates()
        
        # Sauvegarder le fichier concaténé complet (écrase l'ancien)
        combined_df.to_excel('data/raw/Excel_concatene.xlsx', index=False)
        
        # Convertir les dates après la concaténation
        combined_df['Date expedition'] = pd.to_datetime(combined_df['Date expedition'], format='%d/%m/%Y')

        # Extraire les composants de date
        combined_df['Jour'] = combined_df['Date expedition'].dt.day
        combined_df['Mois'] = combined_df['Date expedition'].dt.month
        combined_df['Semaine'] = combined_df['Date expedition'].dt.isocalendar().week
        combined_df['Annee'] = combined_df['Date expedition'].dt.year

        # Grouper par date
        grouped = combined_df.groupby('Date expedition').agg({'Qte cdee': 'sum'}).reset_index()
        grouped.columns = ['Date', 'Total Qte Commandee']

        # Ajouter les composants de date
        grouped['Jour'] = grouped['Date'].dt.day
        grouped['Semaine'] = grouped['Date'].dt.isocalendar().week
        grouped['Annee'] = grouped['Date'].dt.year
        grouped['Mois'] = grouped['Date'].dt.month
        grouped['Jour_Semaine'] = grouped['Date'].dt.weekday

        # Filtrer les quantités non nulles
        grouped = grouped[grouped['Total Qte Commandee'] != 0]

        # Facteur jour de semaine
        grouped['Weekday_Factor'] = grouped['Jour_Semaine'].apply(
            lambda day: 2 if day in [0, 4] else (1 if day in [1, 2, 3] else 0)
        )

        # Filtrer à partir de juillet 2023
        df = grouped[grouped['Date'] >= '2023-07-01']

        # Créer les intervalles
        max_qte = df['Total Qte Commandee'].max()
        bins = list(range(0, int(max_qte) + 2000, 2000))
        labels = [f'{bins[i]}-{bins[i+1]}' for i in range(len(bins)-1)]
        df.loc[:, 'Intervalle_Qte'] = pd.cut(df['Total Qte Commandee'], 
                                            bins=bins, 
                                            labels=labels, 
                                            include_lowest=True)

        # Traiter les outliers
        Q1 = df.groupby('Jour_Semaine')['Total Qte Commandee'].quantile(0.25)
        Q3 = df.groupby('Jour_Semaine')['Total Qte Commandee'].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        # Identifier et remplacer les outliers
        outliers = ((df['Total Qte Commandee'] < df['Jour_Semaine'].map(lower_bound)) | 
                   (df['Total Qte Commandee'] > df['Jour_Semaine'].map(upper_bound)))
        median_values = df.groupby('Jour_Semaine')['Total Qte Commandee'].median()
        df.loc[outliers, 'Total Qte Commandee'] = df.loc[outliers, 'Jour_Semaine'].map(median_values)

        # Sauvegarder les fichiers
        os.makedirs('data/processed', exist_ok=True)
        df.to_csv('data/processed/Dataframe_par_jour_modele.csv', index=False)
        
        logger.info("Traitement terminé avec succès")
        return df

    except Exception as e:
        logger.error(f"Erreur lors du traitement: {str(e)}")
        raise

def process_file(file_path: str) -> Dict:
    """Traite le fichier Excel uploadé"""
    try:
        logger.info(f"Début du traitement du fichier: {file_path}")
        
        # Lire le fichier en sautant la première ligne
        df = pd.read_excel(file_path, skiprows=1)
        logger.info(f"Fichier lu avec succès. Nombre de lignes: {len(df)}")
        
        # Validation
        errors = validate_excel_file(df)
        if errors:
            return {'status': 'error', 'errors': errors}
        
        # Traitement
        processed_df = process_and_combine_data(df)
        
        return {
            'status': 'success',
            'message': 'Données traitées avec succès',
            'rows_processed': len(processed_df)
        }
        
    except Exception as e:
        logger.error(f"Erreur lors du traitement: {str(e)}")
        return {
            'status': 'error',
            'error': str(e)
        }