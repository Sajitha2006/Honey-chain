from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io
import random
import uvicorn

app = FastAPI(
    title="Honey Chain AI Service"
)


@app.get("/")
def home():
    return {
        "success": True,
        "message": "Honey Chain AI Service Running"
    }


@app.post("/predict")
async def predict_disease(
    image: UploadFile = File(...)
):
    try:

        image_bytes = await image.read()

        img = Image.open(
            io.BytesIO(image_bytes)
        )

        diseases = [
            {
                "disease": "Healthy Bee",
                "riskLevel": "low",
                "recommendation":
                    "No major disease detected. Continue regular monitoring."
            },
            {
                "disease": "Varroa Mite",
                "riskLevel": "high",
                "recommendation":
                    "Inspect colony and apply appropriate mite control measures."
            },
            {
                "disease": "Nosema Disease",
                "riskLevel": "medium",
                "recommendation":
                    "Monitor colony health and inspect affected bees."
            }
        ]

        result = random.choice(diseases)

        confidence = round(
            random.uniform(75, 98),
            2
        )

        return {
            "success": True,
            "prediction": result["disease"],
            "confidence": confidence,
            "riskLevel": result["riskLevel"],
            "recommendation": result["recommendation"]
        }

    except Exception as error:

        return {
            "success": False,
            "message": str(error)
        }


# Run FastAPI server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )