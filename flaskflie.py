from flask import Flask, request,jsonify
import face_recognition
import cv2
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/add_data', methods=['GET'])
def add_data():
    print(request.data)


  

if __name__ == '__main__':
    app.run(port=443)
