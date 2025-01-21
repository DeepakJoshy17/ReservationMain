import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const SeatManagement = () => {
  const [boats, setBoats] = useState([]);  // List of boats
  const [seats, setSeats] = useState([]);  // List of seats for the selected boat
  const [newSeat, setNewSeat] = useState({
    boat_id: '',
    seat_number: '',
    type: 'Regular', // Default seat type
  });
  const [updateSeat, setUpdateSeat] = useState(null);

  // Fetch boats on component load
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/boats')
      .then((response) => setBoats(response.data))
      .catch((error) => console.error('Error fetching boats:', error));
  }, []);

  // Fetch seats when a boat is selected
  const fetchSeatsForBoat = (boatId) => {
    axios
      .get(`http://localhost:5000/api/seats/${boatId}`)
      .then((response) => setSeats(response.data))
      .catch((error) => console.error('Error fetching seats:', error));
  };

  // Handle boat selection change
  const handleBoatChange = (e) => {
    const selectedBoatId = e.target.value;
    setNewSeat({ ...newSeat, boat_id: selectedBoatId });

    // Fetch seats for the selected boat
    fetchSeatsForBoat(selectedBoatId);
  };

  // Handle seat number change
  const handleSeatNumberChange = (e) => {
    setNewSeat({ ...newSeat, seat_number: e.target.value });
  };

  // Handle seat type change
  const handleSeatTypeChange = (e) => {
    setNewSeat({ ...newSeat, type: e.target.value });
  };

  // Create a new seat
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (!newSeat.seat_number || !newSeat.boat_id) {
      alert('Seat number and Boat are required');
      return;
    }

    axios
      .post('http://localhost:5000/api/seats', newSeat)
      .then((response) => {
        setSeats([...seats, { ...newSeat, seat_id: response.data.seat_id }]);
        setNewSeat({ boat_id: '', seat_number: '', type: 'Regular' });
      })
      .catch((error) => {
        console.error('Error creating seat:', error);
        alert('Failed to create seat');
      });
  };

  // Handle update form submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!updateSeat.seat_number || !updateSeat.boat_id) {
      alert('Seat number and Boat are required');
      return;
    }

    axios
      .put(`http://localhost:5000/api/seats/${updateSeat.seat_id}`, updateSeat)
      .then(() => {
        setSeats(
          seats.map((seat) =>
            seat.seat_id === updateSeat.seat_id ? updateSeat : seat
          )
        );
        setUpdateSeat(null);
      })
      .catch((error) => {
        console.error('Error updating seat:', error);
        alert('Failed to update seat');
      });
  };

  // Handle delete seat
  const handleDelete = (seat_id) => {
    axios
      .delete(`http://localhost:5000/api/seats/${seat_id}`)
      .then(() => {
        setSeats(seats.filter((seat) => seat.seat_id !== seat_id));
      })
      .catch((error) => {
        console.error('Error deleting seat:', error);
        alert('Failed to delete seat');
      });
  };

  return (
    <div>
      <AdminNavbar/>
      <h4>Seat Management</h4>

      {/* Boat Dropdown */}
      <select value={newSeat.boat_id} onChange={handleBoatChange}>
        <option value="">Select Boat</option>
        {boats.map((boat) => (
          <option key={boat.boat_id} value={boat.boat_id}>
            {boat.boat_name}
          </option>
        ))}
      </select>

      {/* Display seats for the selected boat */}
      {newSeat.boat_id && (
        <>
          <h4>Seats for {boats.find((boat) => boat.boat_id === newSeat.boat_id)?.boat_name}</h4>

          {/* Seats Table */}
          <table>
            <thead>
              <tr>
                <th>Seat Number</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((seat) => (
                <tr key={seat.seat_id}>
                  <td>{seat.seat_number}</td>
                  <td>{seat.type}</td>
                  <td>
                    <button onClick={() => setUpdateSeat(seat)}>Update</button>
                    <button onClick={() => handleDelete(seat.seat_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Create Seat Form */}
          <form onSubmit={handleCreateSubmit}>
            <input
              type="text"
              placeholder="Seat Number"
              value={newSeat.seat_number}
              onChange={handleSeatNumberChange}
            />
            <select value={newSeat.type} onChange={handleSeatTypeChange}>
              <option value="Regular">Regular</option>
              <option value="VIP">VIP</option>
            </select>
            <button type="submit">Create Seat</button>
          </form>

          {/* Update Seat Form */}
          {updateSeat && (
            <form onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                value={updateSeat.seat_number}
                onChange={(e) => setUpdateSeat({ ...updateSeat, seat_number: e.target.value })}
              />
              <select
                value={updateSeat.type}
                onChange={(e) => setUpdateSeat({ ...updateSeat, type: e.target.value })}
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
              </select>
              <button type="submit">Update Seat</button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default SeatManagement;
