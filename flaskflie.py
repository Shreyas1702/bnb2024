from flask import Flask, request,jsonify
import face_recognition
import cv2
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    if 'photo' not in request.files:
        return jsonify({'error': 'No photo provided'}), 400
    else:
        photo1 = request.files.get('photo')
        photo2=request.files.get('photo2')
        photo1.save('phot1.jpg')
        photo2.save('phot2.jpg')
    


        image1 = face_recognition.load_image_file("./phot2.jpg")
        image2 = face_recognition.load_image_file("./phot1.jpg")

        # image1 = face_recognition.load_image_file("./image1.jpg")
        # image2 = face_recognition.load_image_file("./image.jpg")
        # image2 = face_recognition.load_image_file("./image2.png")

        #Locate the faces in the images
        face_locations1 = face_recognition.face_locations(image1)
        face_locations2 = face_recognition.face_locations(image2)

        #Encode the faces
        face_encodings1 = face_recognition.face_encodings(image1, face_locations1)
        face_encodings2 = face_recognition.face_encodings(image2, face_locations2)

        #Compare the face encodings using a distance metric
        match_found = False
        for face_encoding1 in face_encodings1:
            for face_encoding2 in face_encodings2:
                results = face_recognition.compare_faces([face_encoding1], face_encoding2)
                if results[0] == True:
                    match_found = True
                    return("Match found!",200)
                    break
            if match_found:
                break
        if not match_found:
            return("Match not found",400)

    # Process the photo (optional)
    # ...

  

if __name__ == '__main__':
    app.run(port=443)
