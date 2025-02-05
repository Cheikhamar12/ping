import os
import pandas as pd
from datetime import datetime, timedelta
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_absolute_error
import joblib
import matplotlib.pyplot as plt

# Chemin où enregistrer les modèles
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'models', 'sarima.pkl')

def year_week_to_date1(year, week):
    """Convertit une année et un numéro de semaine en une date (lundi de cette semaine)."""
    first_day = datetime(year, 1, 1)
    first_week_start = first_day + timedelta(days=(7 - first_day.weekday()))  # Premier lundi
    return first_week_start + timedelta(weeks=week - 1)

def train_model1():
    """Entraîne le modèle SARIMA avec les données de l'utilisateur."""
    try:
        # Charger les données
        df = pd.read_csv("Total_Presents_Final.xlsx")
        
        # Compléter les années manquantes et convertir la semaine en un numéro
        df['Annee'] = df['Annee'].fillna(method='ffill')
        df = df.dropna(subset=['Semaines', 'Presences'])
        df['Semaines'] = df['Semaines'].str.extract(r'(\d+)').astype(int)
        df['Date'] = df.apply(lambda row: year_week_to_date(int(row['Annee']), int(row['Semaines'])), axis=1)
        
        # Mettre la colonne "Date" comme index
        df.set_index('Date', inplace=True)
        
        # Séparer les données en train et test
        time_series = df['Presences']
        train = time_series[:-10]
        test = time_series[-10:]
        
        # Construire et ajuster le modèle SARIMA
        p, d, q = 2, 1, 2
        P, D, Q, s = 1, 1, 1, 52
        model = SARIMAX(train, order=(p, d, q), seasonal_order=(P, D, Q, s), enforce_stationarity=False, enforce_invertibility=False)
        sarima_model = model.fit(disp=False)
        
        # Sauvegarder le modèle
        joblib.dump(sarima_model, MODEL_PATH)
        print(f"Modèle sauvegardé dans : {MODEL_PATH}")
        
        return {'status': 'success', 'message': 'Modèle entraîné avec succès'}
    
    except Exception as e:
        print(f"Erreur lors de l'entraînement : {str(e)}")
        return {'status': 'error', 'error': str(e)}

def make_predictions1(start_date, end_date=None):
    """Génère des prédictions à partir du modèle SARIMA."""
    try:
        # Charger le modèle enregistré
        sarima_model = joblib.load(MODEL_PATH)
        
        # Récupérer les données pour la période demandée
        df = pd.read_csv("Total_Presents_Final.xlsx")
        df['Annee'] = df['Annee'].fillna(method='ffill')
        df = df.dropna(subset=['Semaines', 'Presences'])
        df['Semaines'] = df['Semaines'].str.extract(r'(\d+)').astype(int)
        df['Date'] = df.apply(lambda row: year_week_to_date(int(row['Annee']), int(row['Semaines'])), axis=1)
        df.set_index('Date', inplace=True)
        
        # Convertir les dates de start et end en objets datetime
        start_date = pd.to_datetime(start_date)
        if end_date:
            end_date = pd.to_datetime(end_date)
        
        # Prédictions futures
        forecast = sarima_model.get_forecast(steps=30)
        forecast_mean = forecast.predicted_mean
        forecast_ci = forecast.conf_int()
        
        # Afficher les prédictions futures
        future_index = pd.date_range(start=df.index[-1] + timedelta(weeks=1), periods=30, freq='W-MON')
        future_mean = forecast_mean
        future_ci = forecast_ci
        
        # Afficher le graphique
        plt.figure(figsize=(12, 6))
        plt.plot(df.index, df['Presences'], label='Données réelles', color='blue')
        plt.plot(future_index, future_mean, label='Prédictions futures', color='red')
        plt.fill_between(future_index, future_ci.iloc[:, 0], future_ci.iloc[:, 1], color='red', alpha=0.2)
        plt.title("Prédictions SARIMA")
        plt.xlabel("Date")
        plt.ylabel("Présences")
        plt.legend()
        plt.grid()
        plt.show()
        
        # Retourner les prédictions sous forme de JSON
        predictions = [{'date': date.strftime('%Y-%m-%d'), 'predictions': pred} for date, pred in zip(future_index, future_mean)]
        
        return {'status': 'success', 'predictions': predictions}
    
    except Exception as e:
        print(f"Erreur dans la génération des prédictions : {str(e)}")
        return {'status': 'error', 'error': str(e)}

def get_model_metrics1():
    try:
        # Charger le modèle
        model_path = "path_to_your_model/sarima.pkl"  # ou la variable où tu stockes le chemin du modèle
        model = load(model_path)

        # Charger les données de test
        data_path = "path_to_processed_data/processed_data.csv"
        df = pd.read_csv(data_path)
        df['Date'] = pd.to_datetime(df['Date'])

        # Utiliser les données réelles pour les prédictions et calculer les métriques
        time_series = df['Presences']
        train = time_series[:-10]  # Exemple: données d'entraînement
        test = time_series[-10:]  # Exemple: données de test

        # Effectuer des prédictions
        forecast = model.get_forecast(steps=len(test))
        forecast_mean = forecast.predicted_mean

        # Calculer les métriques
        mae = mean_absolute_error(test, forecast_mean)
        mae_percentage = (mae / test.mean()) * 100  # En pourcentage

        metrics = {
            "mae": mae,
            "mae_percentage": mae_percentage,
            "accuracy": 100 - mae_percentage
        }

        return {"status": "success", "metrics": metrics}

    except Exception as e:
        return {"status": "error", "error": str(e)}

def retrain_model1():
    try:
        # Charger les nouvelles données
        data_path = "path_to_processed_data/processed_data.csv"
        df = pd.read_csv(data_path)
        df['Date'] = pd.to_datetime(df['Date'])

        # Préparer les données pour l'entraînement
        time_series = df['Presences']
        train = time_series[:-10]  # Entraînement sur les données disponibles

        # Construire et ajuster un nouveau modèle SARIMA
        p, d, q = 2, 1, 2
        P, D, Q, s = 1, 1, 1, 52
        model = SARIMAX(train, order=(p, d, q), seasonal_order=(P, D, Q, s), enforce_stationarity=False, enforce_invertibility=False)
        sarima_model = model.fit(disp=False)

        # Sauvegarder le modèle réentraîné
        model_path = "path_to_your_model/sarima.pkl"
        dump(sarima_model, model_path)

        return {"status": "success", "message": "Modèle réentraîné avec succès et sauvegardé."}

    except Exception as e:
        return {"status": "error", "error": str(e)}
