import numpy as np
from supabase import create_client
import os
from sklearn.neighbors import NearestNeighbors
import joblib

# Load or train simple ML model
def load_model():
    try:
        model = joblib.load('crop_recommender.joblib')
        return model
    except:
        return None

def train_model(crop_data):
    # Simple feature engineering
    X = []
    for crop in crop_data:
        # Convert crop features to numerical values
        features = [
            len(crop['name']),  # Name length as proxy for popularity
            1 if 'rice' in crop['type'].lower() else 0,  # Is rice
            1 if 'vegetable' in crop['type'].lower() else 0,  # Is vegetable
            crop['quantity'],  # Available quantity
        ]
        X.append(features)
    
    X = np.array(X)
    
    # Simple KNN model
    model = NearestNeighbors(n_neighbors=3, algorithm='ball_tree')
    model.fit(X)
    
    # Save the model
    joblib.dump(model, 'crop_recommender.joblib')
    return model

def get_ai_recommendations(cart_items, supabase):
    # Get all crops from Supabase
    all_crops = supabase.table('crops').select('*').execute().data
    
    # Prepare model
    model = load_model()
    if not model:
        model = train_model(all_crops)
    
    # Get recommendations for each item in cart
    recommendations = []
    for item in cart_items:
        # Find similar crops to the current cart item
        item_features = [
            len(item['name']),
            1 if 'rice' in item['type'].lower() else 0,
            1 if 'vegetable' in item['type'].lower() else 0,
            item['quantity'],
        ]
        
        distances, indices = model.kneighbors([item_features])
        
        # Add recommendations (excluding the item itself)
        for i in indices[0]:
            if all_crops[i]['id'] != item['id']:
                recommendations.append(all_crops[i])
    
    # Remove duplicates
    unique_recommendations = []
    seen_ids = set()
    for crop in recommendations:
        if crop['id'] not in seen_ids:
            unique_recommendations.append(crop)
            seen_ids.add(crop['id'])
    
    return unique_recommendations[:5]  # Return top 5 recommendations