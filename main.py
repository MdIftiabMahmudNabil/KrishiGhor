from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from datetime import datetime
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

app = FastAPI()

# Supabase Config
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Model Training
def train_price_model():
    data = supabase.table("price_history").select("*").execute()
    df = pd.DataFrame(data.data)
    
    if len(df) < 100:  # Minimum data points
        return None
        
    model = RandomForestRegressor()
    model.fit(df[['crop_id', 'days_since_recorded']], df['price'])
    joblib.dump(model, 'price_model.joblib')
    return model

# API Endpoints
@app.get("/api/crops")
async def get_crops(region: str = None, type: str = None):
    query = supabase.table("crops").select("*")
    if region:
        query = query.eq("region", region)
    if type:
        query = query.eq("type", type)
    return query.execute().data

@app.get("/api/price-trends/{crop_id}")
async def get_price_trends(crop_id: int):
    data = supabase.table("price_history") \
           .select("*") \
           .eq("crop_id", crop_id) \
           .order("recorded_at") \
           .execute()
    return data.data

@app.post("/api/predict-price")
async def predict_price(crop_id: int):
    model = joblib.load('price_model.joblib')
    prediction = model.predict([[crop_id, 0]])[0]
    return {"predicted_price": round(float(prediction), 2)}

# Run: uvicorn main:app --reload