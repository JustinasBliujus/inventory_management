import { QueryTypes } from "sequelize";
import db from "../db.js"; 

export async function searchAll(term) {
  try {
    const query = `
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.surname AS user_surname,
        u.email AS user_email,
        i.id AS inventory_id,
        i.name AS inventory_name,
        i.description AS inventory_description,
        (
          MATCH(u.name, u.surname, u.email) AGAINST(:term IN NATURAL LANGUAGE MODE)
          +
          MATCH(i.name, i.description) AGAINST(:term IN NATURAL LANGUAGE MODE)
        ) AS relevance
      FROM user u
      LEFT JOIN inventory i ON u.id = i.user_id
      WHERE
        MATCH(u.name, u.surname, u.email) AGAINST(:term IN NATURAL LANGUAGE MODE)
        OR
        MATCH(i.name, i.description) AGAINST(:term IN NATURAL LANGUAGE MODE)
      LIMIT 10;
    `;

    const results = await db.query(query, {
      replacements: { term },
      type: QueryTypes.SELECT,
    });
    
    return results;
  } catch (err) {
    throw err;
  }
}
