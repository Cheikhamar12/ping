from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
from werkzeug.utils import secure_filename
from src.data_processing import process_file
from src.prediction import make_predictions, train_model, get_model_metrics, retrain_model
import subprocess

app = Flask(__name__)
CORS(app)

# Configuration des dossiers
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'raw')
PROCESSED_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'processed')
MODELS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'models')

# Création des dossiers nécessaires
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(MODELS_FOLDER, exist_ok=True)

# Configuration de l'application
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

# Extensions autorisées
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-data', methods=['POST'])
def upload_file():
    """Route pour uploader un fichier de données"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Aucun fichier trouvé'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Type de fichier non autorisé'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Traiter le fichier
        result = process_file(filepath)
        
        if result.get('status') == 'success':
            # Réentraîner le modèle avec les nouvelles données
            retrain_result = retrain_model()
            if retrain_result.get('status') == 'success':
                return jsonify({
                    'message': 'Fichier traité et modèle réentraîné avec succès',
                    'filename': filename
                })
            else:
                return jsonify({
                    'warning': 'Fichier traité mais erreur lors du réentraînement du modèle',
                    'filename': filename,
                    'retrain_error': retrain_result.get('error')
                })
        else:
            return jsonify({
                'error': 'Erreur lors du traitement',
                'details': result.get('errors', [])
            }), 400
            
    except Exception as e:
        print(f"Erreur: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['GET'])
def predict():
    """Route pour générer les prédictions"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date', None)
        
        if not start_date:
            return jsonify({'status': 'error', 'error': 'Date de début requise'}), 400

        result = make_predictions(start_date, end_date)
        return jsonify(result)
    except Exception as e:
        print(f"Erreur dans la route predict: {str(e)}")
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train():
    """Route pour entraîner le modèle initial"""
    try:
        result = train_model()
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/api/retrain', methods=['POST'])
def retrain():
    """Route pour forcer le réentraînement du modèle"""
    try:
        result = retrain_model()
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/api/metrics', methods=['GET'])
def metrics():
    """Route pour récupérer les métriques du modèle"""
    try:
        result = get_model_metrics()
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/api/last-available-date', methods=['GET'])
def get_last_available_date():
    """Retourne la dernière date disponible dans les données"""
    try:
        data_path = os.path.join(PROCESSED_FOLDER, 'Dataframe_par_jour_modele.csv')
        if not os.path.exists(data_path):
            return jsonify({
                'status': 'error',
                'error': 'Aucune donnée disponible'
            }), 404

        df = pd.read_csv(data_path)
        df['Date'] = pd.to_datetime(df['Date'])
        last_date = df['Date'].max().strftime('%Y-%m-%d')
        
        return jsonify({
            'status': 'success',
            'last_date': last_date
        })
    except Exception as e:
        print(f"Erreur lors de la récupération de la dernière date: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/data-info', methods=['GET'])
def get_data_info():
    """Retourne des informations sur les données disponibles"""
    try:
        data_path = os.path.join(PROCESSED_FOLDER, 'Dataframe_par_jour_modele.csv')
        if not os.path.exists(data_path):
            return jsonify({
                'status': 'error',
                'error': 'Aucune donnée disponible'
            }), 404

        df = pd.read_csv(data_path)
        df['Date'] = pd.to_datetime(df['Date'])
        
        info = {
            'start_date': df['Date'].min().strftime('%Y-%m-%d'),
            'end_date': df['Date'].max().strftime('%Y-%m-%d'),
            'total_days': len(df),
            'total_orders': df['Total Qte Commandee'].sum(),
            'avg_daily_orders': df['Total Qte Commandee'].mean()
        }
        
        return jsonify({
            'status': 'success',
            'data': info
        })
    except Exception as e:
        print(f"Erreur lors de la récupération des informations: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/update-data', methods=['POST'])
def update_data():
    """Exécute le script script_db.py pour mettre à jour les données"""
    try:
        script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'script_db.py')
        result = subprocess.run(['python', script_path], capture_output=True, text=True)

        return jsonify({
            "status": "success",
            "output": result.stdout,
            "error": result.stderr if result.stderr else None
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    print(f"Dossiers configurés:")
    print(f"- Upload: {UPLOAD_FOLDER}")
    print(f"- Processed: {PROCESSED_FOLDER}")
    print(f"- Models: {MODELS_FOLDER}")
    print("Démarrage du serveur Flask sur http://localhost:5001")
    app.run(host='0.0.0.0', port=5001)