const pool = require("../database");

/* ***************************
 *  Get all classifications
 * *************************** */
class Classification {
    static async findAllClassifications() {
        try {
            const query = 'SELECT * FROM public.classification ORDER BY classification_name'; 
            const { rows } = await pool.query(query);
            return rows; // Return the fetched classifications
        } catch (error) {
            console.error("findAllClassifications error: " + error);
            throw error; // Re-throw the error for handling in the controller
        }
    }

    /* ***************************
     *  Add a new classification
     * *************************** */
    static async addClassification(classificationName) {
        try {
            const query = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
            const { rows } = await pool.query(query, [classificationName]);
            return rows[0]; // Return the newly added classification
        } catch (error) {
            console.error("addClassification error: " + error);
            throw error; // Re-throw the error for handling in the controller
        }
    }

    /* ***************************
     *  Get classification by ID
     * *************************** */
    static async getClassificationById(classificationId) {
        try {
            const query = 'SELECT * FROM public.classification WHERE classification_id = $1';
            const { rows } = await pool.query(query, [classificationId]);
            return rows[0]; // Return the classification data
        } catch (error) {
            console.error("getClassificationById error: " + error);
            throw error; // Re-throw the error for handling in the controller
        }
    }

    
}

module.exports = Classification;