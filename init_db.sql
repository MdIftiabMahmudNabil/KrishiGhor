CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    region VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO crops (name, type, quantity, price, region, description) VALUES
('BRRI Dhan 28', 'Rice', 15000.00, 35.50, 'Rajshahi', 'High-yielding Boro rice variety'),
('Hybrid Maize', 'Cereal', 8000.00, 28.75, 'Rangpur', 'High-protein hybrid maize'),
('Mango (Amrapali)', 'Fruit', 5000.00, 95.00, 'Chapai Nawabganj', 'Sweet with rich flavor'),
('Potato (Diamant)', 'Vegetable', 12000.00, 15.25, 'Bogra', 'High-yielding potato variety'),
('Jute (Tossa)', 'Fiber', 10000.00, 45.00, 'Faridpur', 'Golden fiber of Bangladesh'),
('Banana (Sagar)', 'Fruit', 9000.00, 22.00, 'Jessore', 'Popular local variety'),
('Onion (BARI Piaz-1)', 'Vegetable', 7000.00, 40.75, 'Pabna', 'Red onion with long shelf life'),
('Lentil (Masur)', 'Pulse', 6000.00, 85.00, 'Dinajpur', 'Protein-rich lentil variety'),
('Tea (BT-2)', 'Beverage', 4000.00, 180.00, 'Moulvibazar', 'Premium quality tea leaves'),
('Chili (BARI Morich-1)', 'Spice', 3000.00, 125.00, 'Kushtia', 'High-capsicum chili variety');