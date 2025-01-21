import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const StopPricingManagement = () => {
  const [routeStops, setRouteStops] = useState([]);
  const [pricingEntries, setPricingEntries] = useState([]);
  const [newPricing, setNewPricing] = useState({
    start_stop_id: '',
    end_stop_id: '',
    price: 0.0,
  });
  const [updatePricing, setUpdatePricing] = useState(null);

  // Fetch route stops and pricing entries on initial render
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/route_stops')
      .then((response) => {
        setRouteStops(response.data);
      })
      .catch((error) => {
        console.error('Error fetching route stops:', error);
      });

    axios
      .get('http://localhost:5000/api/stop_pricing')
      .then((response) => {
        setPricingEntries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching pricing entries:', error);
      });
  }, []);

  // Create a new pricing entry
  const handleCreateSubmit = (e) => {
    e.preventDefault();
  
    if (!newPricing.start_stop_id || !newPricing.end_stop_id || newPricing.price === undefined) {
      alert('All fields are required');
      return;
    }
  
    axios
      .post('http://localhost:5000/api/stop_pricing', newPricing)
      .then((response) => {
        alert('Pricing entry created successfully!');
  
        // Add the full entry to the pricingEntries state, including start and end location
        setPricingEntries((prevEntries) => [
          ...prevEntries,
          response.data, // Full data including start and end location
        ]);
  
        setNewPricing({ start_stop_id: '', end_stop_id: '', price: 0.0 });
      })
      .catch((error) => {
        console.error('Error creating pricing entry:', error);
        alert('Failed to create pricing entry');
      });
  };
  
  

  // Update a pricing entry
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!updatePricing.start_stop_id || !updatePricing.end_stop_id || updatePricing.price === undefined) {
      alert('All fields are required');
      return;
    }

    axios
      .put(`http://localhost:5000/api/stop_pricing/${updatePricing.pricing_id}`, updatePricing)
      .then(() => {
        alert('Pricing entry updated successfully!');
        setPricingEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.pricing_id === updatePricing.pricing_id ? { ...updatePricing } : entry
          )
        );
        setUpdatePricing(null);
      })
      .catch((error) => {
        console.error('Error updating pricing entry:', error);
        alert('Failed to update pricing entry');
      });
  };

  // Delete a pricing entry
  const handleDelete = (pricing_id) => {
    axios
      .delete(`http://localhost:5000/api/stop_pricing/${pricing_id}`)
      .then(() => {
        alert('Pricing entry deleted successfully!');
        setPricingEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.pricing_id !== pricing_id)
        );
      })
      .catch((error) => {
        console.error('Error deleting pricing entry:', error);
        alert('Failed to delete pricing entry');
      });
  };

  // Select pricing entry to update
  const handleEdit = (entry) => {
    setUpdatePricing(entry);
  };

  return (
    <div>
      <AdminNavbar/>
      <h4>Stop Pricing Management</h4>

      {/* Create Pricing Form */}
      <form onSubmit={handleCreateSubmit}>
        <select
          value={newPricing.start_stop_id}
          onChange={(e) => setNewPricing({ ...newPricing, start_stop_id: e.target.value })}
        >
          <option value="">Select Start Stop</option>
          {routeStops.map((stop) => (
            <option key={stop.stop_id} value={stop.stop_id}>
              {stop.location}
            </option>
          ))}
        </select>

        <select
          value={newPricing.end_stop_id}
          onChange={(e) => setNewPricing({ ...newPricing, end_stop_id: e.target.value })}
        >
          <option value="">Select End Stop</option>
          {routeStops.map((stop) => (
            <option key={stop.stop_id} value={stop.stop_id}>
              {stop.location}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          value={newPricing.price}
          onChange={(e) => setNewPricing({ ...newPricing, price: e.target.value })}
        />

        <button type="submit">Create Pricing</button>
      </form>

      {/* Update Pricing Form */}
      {updatePricing && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Update Pricing</h2>
          <select
            value={updatePricing.start_stop_id}
            onChange={(e) => setUpdatePricing({ ...updatePricing, start_stop_id: e.target.value })}
          >
            <option value="">Select Start Stop</option>
            {routeStops.map((stop) => (
              <option key={stop.stop_id} value={stop.stop_id}>
                {stop.location}
              </option>
            ))}
          </select>

          <select
            value={updatePricing.end_stop_id}
            onChange={(e) => setUpdatePricing({ ...updatePricing, end_stop_id: e.target.value })}
          >
            <option value="">Select End Stop</option>
            {routeStops.map((stop) => (
              <option key={stop.stop_id} value={stop.stop_id}>
                {stop.location}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={updatePricing.price}
            onChange={(e) => setUpdatePricing({ ...updatePricing, price: e.target.value })}
          />

          <button type="submit">Update Pricing</button>
        </form>
      )}

      {/* Pricing List */}
      <ul>
  {pricingEntries.length === 0 ? (
    <p>No pricing entries available</p>
  ) : (
    pricingEntries.map((entry) => (
      <li key={entry.pricing_id}>
        {entry.start_location} - {entry.end_location}: ${(Number(entry.price) || 0).toFixed(2)}
        <button onClick={() => handleEdit(entry)}>Edit</button>
        <button onClick={() => handleDelete(entry.pricing_id)}>Delete</button>
      </li>
    ))
  )}
</ul>

    </div>
  );
};

export default StopPricingManagement;
