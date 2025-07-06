from fastapi import APIRouter, File, UploadFile, HTTPException
from .utils import predict_disease
from .constants import class_names
import tensorflow as tf

router = APIRouter()

model = tf.keras.models.load_model("app/ml/models/plant_disease_model.h5")

@router.post("/predict")
async def predict_disease_endpoint(file: UploadFile = File(...)):
    try:
        predicted_class, confidence = predict_disease(file, model, class_names)
        return {
            "predicted_class": predicted_class,
            "confidence": float(confidence),
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


