from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from src.data_processing import process_file  # Import de la fonction de traitement

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'raw')
PROCESSED_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'processed')

# Création des dossiers nécessaires
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({"message": "Server is running!"})

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working!"})

@app.route('/api/upload-data', methods=['POST'])
def upload_data():
    print("Requête d'upload reçue")  # Debug
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Aucun fichier trouvé'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
            
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            print(f"Fichier sauvegardé: {filepath}")  # Debug
            
            # Traitement du fichier
            result = process_file(filepath)
            print(f"Résultat du traitement: {result}")  # Debug
            
            if result['status'] == 'success':
                return jsonify({
                    'message': 'Fichier traité avec succès',
                    'rows_processed': result.get('rows_processed', 0)
                })
            else:
                return jsonify({
                    'error': 'Erreur lors du traitement',
                    'details': result.get('errors', [])
                }), 400
            
    except Exception as e:
        print(f"Erreur: {str(e)}")  # Debug
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(f"Dossiers configurés:")
    print(f"- Upload: {UPLOAD_FOLDER}")
    print(f"- Processed: {PROCESSED_FOLDER}")
    print("Démarrage du serveur Flask sur http://localhost:5001")
    app.run(debug=True, port=5001)