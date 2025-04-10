-- Insert new record for Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
-- Update Tony Stark's account_type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- Delete Tony Stark's record from the account table
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Update the GM Hummer description from 'small interiors' to 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', ' a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

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

-- Remove '/images/vehicles/vehiclesvehicles' from inv_image and inv_thumbnail paths then replacing with /images/vehicles/
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
