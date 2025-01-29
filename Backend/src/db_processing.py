from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/update-data', methods=['POST'])
def update_data():
    try:
        result = subprocess.run(['python3', 'Backend/src/script_db.py'], capture_output=True, text=True)
        return jsonify({"status": "success", "output": result.stdout})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
