import pandas as pd
from prophet import Prophet
import joblib
import os
from datetime import datetime
from typing import Dict
import numpy as np

def train_model() -> Dict:
    """Entraîne le modèle Prophet"""
    try:
        # Créer le dossier models s'il n'existe pas
        models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        model_path = os.path.join(models_dir, 'prophet_model.pkl')
        
        # Charger les données
        data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'processed', 'Dataframe_par_jour_modele.csv')
        df = pd.read_csv(data_path)
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values('Date')

        # Préparer les données pour Prophet
        df_prophet = df[['Date', 'Total Qte Commandee']].rename(
            columns={'Date': 'ds', 'Total Qte Commandee': 'y'}
        )

        # Entraîner le modèle
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            seasonality_mode='multiplicative'
        )
        model.add_country_holidays(country_name='FR')
        model.fit(df_prophet)

        # Sauvegarder le modèle
        joblib.dump(model, model_path)
        print(f"Modèle sauvegardé dans : {model_path}")

        return {'status': 'success', 'message': 'Modèle entraîné avec succès'}
    except Exception as e:
        print(f"Erreur lors de l'entraînement : {str(e)}")
        return {'status': 'error', 'error': str(e)}

def make_predictions(start_date: str, end_date: str = None) -> Dict:
    """Génère les prédictions pour une période donnée"""
    try:
        # Chemins des fichiers
        models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'models')
        model_path = os.path.join(models_dir, 'prophet_model.pkl')
        data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'processed', 'Dataframe_par_jour_modele.csv')

        # Charger les données originales pour obtenir la dernière date
        df = pd.read_csv(data_path)
        df['Date'] = pd.to_datetime(df['Date'])
        last_date = df['Date'].max()

        # Vérifier si le modèle existe
        if not os.path.exists(model_path):
            train_result = train_model()
            if train_result['status'] == 'error':
                return train_result

        # Charger le modèle
        model = joblib.load(model_path)

        # Calculer le nombre de jours pour la prédiction depuis la dernière date connue
        start = pd.to_datetime(start_date)
        if end_date:
            end = pd.to_datetime(end_date)
            max_future_date = last_date + pd.Timedelta(days=30)
            
            if end > max_future_date:
                return {
                    'status': 'error',
                    'error': f'Les prédictions ne sont disponibles que jusqu\'au {max_future_date.strftime("%Y-%m-%d")}'
                }
            
            periods = (end - last_date).days + 1
        else:
            if start > last_date + pd.Timedelta(days=30):
                return {
                    'status': 'error',
                    'error': f'Les prédictions ne sont disponibles que jusqu\'au {(last_date + pd.Timedelta(days=30)).strftime("%Y-%m-%d")}'
                }
            periods = (start - last_date).days + 1

        # Générer les dates futures
        future = model.make_future_dataframe(periods=periods)
        
        # Faire les prédictions
        forecast = model.predict(future)

        # Filtrer les prédictions pour la période demandée
        mask = (forecast['ds'] >= start)
        if end_date:
            mask &= (forecast['ds'] <= end)
        future_predictions = forecast[mask][['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
        
        # Formater les résultats
        predictions = []
        for _, row in future_predictions.iterrows():
            # Arrondir les prédictions et s'assurer qu'elles ne sont pas négatives
            prediction = max(0, round(row['yhat'], 0))
            lower_bound = max(0, round(row['yhat_lower'], 0))
            upper_bound = max(0, round(row['yhat_upper'], 0))
            
            predictions.append({
                'date': row['ds'].strftime('%Y-%m-%d'),
                'prediction': prediction,
                'lower_bound': lower_bound,
                'upper_bound': upper_bound
            })

        return {
            'status': 'success',
            'predictions': predictions
        }
    except Exception as e:
        print(f"Erreur lors de la prédiction : {str(e)}")
        return {
            'status': 'error',
            'error': str(e)
        }

def get_model_metrics() -> Dict:
    """Retourne les métriques du modèle"""
    try:
        data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'processed', 'Dataframe_par_jour_modele.csv')
        models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'models')
        model_path = os.path.join(models_dir, 'prophet_model.pkl')
        
        if not os.path.exists(model_path):
            return {
                'status': 'error',
                'error': 'Le modèle n\'existe pas encore'
            }
            
        # Charger les données et le modèle
        df = pd.read_csv(data_path)
        df['Date'] = pd.to_datetime(df['Date'])
        model = joblib.load(model_path)
        
        # Faire des prédictions sur les données historiques
        historical_dates = pd.DataFrame({'ds': df['Date']})
        predictions = model.predict(historical_dates)
        
        # Calculer les métriques
        actual = df['Total Qte Commandee'].values
        predicted = predictions['yhat'].values
        
        mse = np.mean((actual - predicted) ** 2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(actual - predicted))
        mape = np.mean(np.abs((actual - predicted) / actual)) * 100
        
        return {
            'status': 'success',
            'metrics': {
                'mse': round(mse, 2),
                'rmse': round(rmse, 2),
                'mae': round(mae, 2),
                'mape': round(mape, 2)
            }
        }
        
    except Exception as e:
        print(f"Erreur lors du calcul des métriques : {str(e)}")
        return {
            'status': 'error',
            'error': str(e)
        }

def retrain_model() -> Dict:
    """Force le réentraînement du modèle"""
    try:
        # Supprimer l'ancien modèle s'il existe
        models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'models')
        model_path = os.path.join(models_dir, 'prophet_model.pkl')
        
        if os.path.exists(model_path):
            os.remove(model_path)
            
        # Entraîner un nouveau modèle
        return train_model()
        
    except Exception as e:
        print(f"Erreur lors du réentraînement : {str(e)}")
        return {
            'status': 'error',
            'error': str(e)
        }