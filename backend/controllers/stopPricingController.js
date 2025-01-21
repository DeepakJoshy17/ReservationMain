const db = require('../database/db');

// Get all pricing entries
exports.getAllPricing = (req, res) => {
  const query = `
    SELECT sp.pricing_id, sp.start_stop_id, sp.end_stop_id, sp.price, 
           rs1.location AS start_location, rs2.location AS end_location
    FROM Stop_Pricing sp
    JOIN Route_Stops rs1 ON sp.start_stop_id = rs1.stop_id
    JOIN Route_Stops rs2 ON sp.end_stop_id = rs2.stop_id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching pricing data:', err);
      return res.status(500).json({ error: 'Failed to fetch pricing data' });
    }
    res.json(rows);
  });
};

// Create new pricing entry
// Create new pricing entry
exports.createPricing = (req, res) => {
    const { start_stop_id, end_stop_id, price } = req.body;
  
    if (!start_stop_id || !end_stop_id || price === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    // Insert the new pricing entry into the database
    const query = `INSERT INTO Stop_Pricing (start_stop_id, end_stop_id, price) VALUES (?, ?, ?)`;
    db.run(query, [start_stop_id, end_stop_id, price], function (err) {
      if (err) {
        console.error('Error creating pricing entry:', err);
        return res.status(500).json({ error: 'Failed to create pricing entry' });
      }
  
      // Query to get the start_location and end_location after insertion
      const selectQuery = `
        SELECT sp.pricing_id, sp.start_stop_id, sp.end_stop_id, sp.price,
               rs1.location AS start_location, rs2.location AS end_location
        FROM Stop_Pricing sp
        JOIN Route_Stops rs1 ON sp.start_stop_id = rs1.stop_id
        JOIN Route_Stops rs2 ON sp.end_stop_id = rs2.stop_id
        WHERE sp.pricing_id = ?`;
  
      db.get(selectQuery, [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching pricing entry details:', err);
          return res.status(500).json({ error: 'Failed to fetch pricing entry details' });
        }
  
        // Return the full entry with locations
        res.status(201).json(row);
      });
    });
  };
  
// Update pricing entry
exports.updatePricing = (req, res) => {
  const { pricing_id } = req.params;
  const { start_stop_id, end_stop_id, price } = req.body;

  if (!start_stop_id || !end_stop_id || price === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    UPDATE Stop_Pricing 
    SET start_stop_id = ?, end_stop_id = ?, price = ? 
    WHERE pricing_id = ?
  `;
  db.run(query, [start_stop_id, end_stop_id, price, pricing_id], function (err) {
    if (err) {
      console.error('Error updating pricing entry:', err);
      return res.status(500).json({ error: 'Failed to update pricing entry' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pricing entry not found' });
    }

    res.json({ message: 'Pricing entry updated successfully' });
  });
};

// Delete pricing entry
exports.deletePricing = (req, res) => {
  const { pricing_id } = req.params;

  const query = `DELETE FROM Stop_Pricing WHERE pricing_id = ?`;
  db.run(query, [pricing_id], function (err) {
    if (err) {
      console.error('Error deleting pricing entry:', err);
      return res.status(500).json({ error: 'Failed to delete pricing entry' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pricing entry not found' });
    }

    res.json({ message: 'Pricing entry deleted successfully' });
  });
};
