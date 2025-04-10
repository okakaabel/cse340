const pool = require("../database");

/* ***************************
 *  Create a New Support Ticket
 * ************************** */
async function createTicket(account_id, title, description, priority) {
    const sql = `
        INSERT INTO support_tickets (account_id, title, description, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const result = await pool.query(sql, [account_id, title, description, priority]);
    return result.rows[0];
}

/* ***************************
 *  Get Tickets for a User
 * ************************** */
async function getUserTickets(account_id) {
    const sql = `
        SELECT * FROM support_tickets
        WHERE account_id = $1
        ORDER BY created_at DESC;
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
}

/* ***************************
 *  Get All Tickets (Admin)
 * ************************** */
async function getAllTickets() {
    const sql = `
        SELECT * FROM support_tickets
        ORDER BY created_at DESC;
    `;
    const result = await pool.query(sql);
    return result.rows;
}

/* ***************************
 *  Update Ticket Status and Response
 * ************************** */
async function updateTicket(ticket_id, status, adminResponse) {
    const sql = `
        UPDATE support_tickets
        SET status = $1, admin_response = $2, updated_at = CURRENT_TIMESTAMP
        WHERE ticket_id = $3
        RETURNING *;
    `;
    const result = await pool.query(sql, [status, adminResponse, ticket_id]);
    return result.rows[0];
}

module.exports = { createTicket, getUserTickets, getAllTickets, updateTicket };
