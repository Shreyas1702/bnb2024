from flask import Flask, request

app = Flask(__name__)

@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    photo = request.files.get('photo')
    if not photo:
        return 'No photo provided', 400

    # Save photo to disk (optional)
    photo.save('photo.jpg')

    # Process the photo (optional)
    # ...

    return 'Photo received', 200

if __name__ == '_main_':
    app.run(port=5000)