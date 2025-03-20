-- Ensure the account table exists before inserting
CREATE TABLE IF NOT EXISTS account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(255) NOT NULL,
    account_lastname VARCHAR(255) NOT NULL,
    account_email VARCHAR(255) UNIQUE NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) DEFAULT 'User' -- Default value if not set
);

-- Insert new record for Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')
ON CONFLICT (account_email) DO NOTHING;

-- Ensure Tony Stark's account exists before updating
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Ensure Tony Stark's account exists before deleting
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Ensure the inventory table exists before updating
CREATE TABLE IF NOT EXISTS inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(255) NOT NULL,
    inv_model VARCHAR(255) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image TEXT NOT NULL,
    inv_thumbnail TEXT NOT NULL,
    classification_id INT NOT NULL
);

-- Update the GM Hummer description from 'small interiors' to 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Ensure the classification table exists before the SELECT query
CREATE TABLE IF NOT EXISTS classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(255) UNIQUE NOT NULL
);

-- Select make and model from inventory and classification name from classification table for "Sport" category
SELECT 
    inventory.inv_make, 
    inventory.inv_model, 
    classification.classification_name
FROM 
    inventory
INNER JOIN 
    classification
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';

-- Remove incorrect '/images/vehicles/vehiclesvehicles' from inv_image and inv_thumbnail paths
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/vehicles/vehiclesvehicles', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/vehicles/vehiclesvehicles', '/images/vehicles/');
