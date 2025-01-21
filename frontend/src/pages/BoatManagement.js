import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const BoatManagement = () => {
  const [boats, setBoats] = useState([]);
  const [newBoat, setNewBoat] = useState({
    boat_name: '',
    capacity: '',
    status: 'Active',
  });

  // State for the boat to update
  const [updateBoat, setUpdateBoat] = useState(null);

  // Fetch boats on initial render
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/boats')
      .then((response) => {
        setBoats(response.data); // Assuming the response contains a list of boats
      })
      .catch((error) => {
        console.error('Error fetching boats:', error);
      });
  }, []);

  // Handle boat creation
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (!newBoat.boat_name || !newBoat.capacity) {
      alert('Please fill in all the required fields');
      return;
    }

    axios
      .post('http://localhost:5000/api/boats', newBoat)
      .then((response) => {
        alert('Boat created successfully!');
        setBoats((prevBoats) => [
          ...prevBoats,
          { ...newBoat, boat_id: response.data.boat_id },
        ]);
        setNewBoat({ boat_name: '', capacity: '', status: 'Active' });
      })
      .catch((error) => {
        console.error('Error creating boat:', error);
        alert('Error creating the boat');
      });
  };

  // Handle boat update
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!updateBoat.boat_name || !updateBoat.capacity) {
      alert('Please fill in all the required fields');
      return;
    }

    axios
      .put(`http://localhost:5000/api/boats/${updateBoat.boat_id}`, updateBoat)
      .then(() => {
        alert('Boat updated successfully!');
        setBoats((prevBoats) =>
          prevBoats.map((boat) =>
            boat.boat_id === updateBoat.boat_id ? { ...updateBoat } : boat
          )
        );
        setUpdateBoat(null); // Clear the update form
      })
      .catch((error) => {
        console.error('Error updating boat:', error);
        alert('Error updating the boat');
      });
  };

  // Handle boat deletion
  const handleDelete = (boat_id) => {
    axios
      .delete(`http://localhost:5000/api/boats/${boat_id}`)
      .then(() => {
        alert('Boat deleted successfully!');
        setBoats((prevBoats) => prevBoats.filter((boat) => boat.boat_id !== boat_id));
      })
      .catch((error) => {
        console.error('Error deleting boat:', error);
        alert('Error deleting the boat');
      });
  };

  // Select boat to update
  const handleEdit = (boat) => {
    setUpdateBoat(boat);
  };

  return (
    <div>
      <AdminNavbar/>
      <h4>Boat Management</h4>

      {/* Boat Creation Form */}
      <form onSubmit={handleCreateSubmit}>
        <input
          type="text"
          placeholder="Boat Name"
          value={newBoat.boat_name}
          onChange={(e) => setNewBoat({ ...newBoat, boat_name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newBoat.capacity}
          onChange={(e) => setNewBoat({ ...newBoat, capacity: e.target.value })}
        />
        <select
          value={newBoat.status}
          onChange={(e) => setNewBoat({ ...newBoat, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit">Create Boat</button>
      </form>

      {/* Boat Update Form */}
      {updateBoat && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Update Boat</h2>
          <input
            type="text"
            placeholder="Boat Name"
            value={updateBoat.boat_name}
            onChange={(e) => setUpdateBoat({ ...updateBoat, boat_name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Capacity"
            value={updateBoat.capacity}
            onChange={(e) => setUpdateBoat({ ...updateBoat, capacity: e.target.value })}
          />
          <select
            value={updateBoat.status}
            onChange={(e) => setUpdateBoat({ ...updateBoat, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button type="submit">Update Boat</button>
        </form>
      )}

      {/* Boat List */}
      <ul>
        {boats.length === 0 ? (
          <p>No boats available</p>
        ) : (
          boats.map((boat) => (
            <li key={boat.boat_id}>
              {boat.boat_name} (Capacity: {boat.capacity}) - Status: {boat.status}
              <button onClick={() => handleEdit(boat)}>Edit</button>
              <button onClick={() => handleDelete(boat.boat_id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BoatManagement;
