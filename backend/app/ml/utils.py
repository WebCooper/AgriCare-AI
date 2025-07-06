import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import io

def predict_disease(file, model, class_names):
    # Convert UploadFile to BytesIO for image loading
    file_content = file.file.read()
    file.file.seek(0)  # Reset file pointer for potential future reads
    
    img = image.load_img(io.BytesIO(file_content), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # Create batch axis
    img_array = img_array / 255.0  # Normalize to [0,1]

    predictions = model.predict(img_array)
    predicted_index = np.argmax(predictions[0])
    confidence = np.max(predictions[0])

    predicted_class = class_names[predicted_index]

    return predicted_class, confidence