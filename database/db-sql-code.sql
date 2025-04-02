-- Ensure the role exists before assigning ownership
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cse340') THEN
        CREATE ROLE cse340 WITH LOGIN PASSWORD 'yourpassword';
        ALTER ROLE cse340 CREATEDB;
    END IF;
END $$;

-- Type: account_type
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE public.account_type AS ENUM ('Client', 'Employee', 'Admin');
    END IF;
END $$;

-- Ownership assignment removed to avoid permission issues

-- Table structure for table `classification`
CREATE TABLE IF NOT EXISTS public.classification (
    classification_id INT GENERATED BY DEFAULT AS IDENTITY,
    classification_name CHARACTER VARYING NOT NULL,
    CONSTRAINT classification_pk PRIMARY KEY (classification_id)
);

-- Table structure for table 'inventory'
CREATE TABLE IF NOT EXISTS public.inventory (
    inv_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    inv_make character varying NOT NULL,
    inv_model character varying NOT NULL,
    inv_year character (4) NOT NULL,
    inv_description text NOT NULL,
    inv_image character varying NOT NULL,
    inv_thumbnail character varying NOT NULL,
    inv_price numeric (9, 0) NOT NULL,
    inv_miles integer NOT NULL,
    inv_color character varying NOT NULL,
    classification_id integer NOT NULL,
    CONSTRAINT inventory_pkey PRIMARY KEY (inv_id)
);

-- Ensure the foreign key constraint exists before adding it
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_classification' 
        AND table_name = 'inventory'
    ) THEN
        ALTER TABLE public.inventory
            ADD CONSTRAINT fk_classification FOREIGN KEY (classification_id)
            REFERENCES public.classification (classification_id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE NO ACTION;
    END IF;
END $$;

-- Table structure for table `account`
CREATE TABLE IF NOT EXISTS public.account (
    account_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'::account_type,
    CONSTRAINT account_pkey PRIMARY KEY (account_id)
);

-- Data for table `classification`
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan')
ON CONFLICT DO NOTHING; -- Avoid duplicate inserts

-- Update the GM Hummer description from 'small interiors' to 'a huge interior'
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', ' a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Remove '/images/vehicles/vehiclesvehicles' from inv_image and inv_thumbnail paths
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles/');
