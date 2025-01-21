import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const StopTimeManagement = () => {
  const [routes, setRoutes] = useState([]);  // List of routes
  const [stops, setStops] = useState([]);  // List of stops for the selected route
  const [newStopTime, setNewStopTime] = useState({
    route_id: '',
    stop_id: '',
    arrival_time: ''
  });
  const [stopTimes, setStopTimes] = useState([]);
  const [editingStopTime, setEditingStopTime] = useState(null);  // Track stop time being edited

  // Fetch all routes when component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/routes')
      .then((response) => setRoutes(response.data))
      .catch((error) => console.error('Error fetching routes:', error));
  }, []);

  // Fetch stops for the selected route
  const fetchStopsForRoute = (routeId) => {
    axios
      .get(`http://localhost:5000/api/stops/${routeId}`)
      .then((response) => setStops(response.data))
      .catch((error) => console.error('Error fetching stops:', error));
  };

  // Fetch stop times for the selected route
  const fetchStopTimes = (routeId) => {
    axios
      .get(`http://localhost:5000/api/stop-times/${routeId}`)
      .then((response) => setStopTimes(response.data))
      .catch((error) => console.error('Error fetching stop times:', error));
  };

  const handleRouteChange = (e) => {
    const selectedRouteId = e.target.value;
    setNewStopTime({ ...newStopTime, route_id: selectedRouteId, stop_id: '' }); // Reset stop_id when route changes
    fetchStopsForRoute(selectedRouteId); // Fetch stops for the selected route
    fetchStopTimes(selectedRouteId); // Fetch stop times for the selected route
  };

  const handleStopChange = (e) => {
    setNewStopTime({ ...newStopTime, stop_id: e.target.value });
  };

  const handleTimeChange = (e) => {
    setNewStopTime({ ...newStopTime, arrival_time: e.target.value });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newStopTime.route_id || !newStopTime.stop_id || !newStopTime.arrival_time) {
      alert('Route, Stop, and Time are required');
      return;
    }

    axios
      .post('http://localhost:5000/api/stop-times', newStopTime)
      .then((response) => {
        setStopTimes([...stopTimes, { ...newStopTime, stop_time_id: response.data.stop_time_id }]);
        setNewStopTime({ route_id: '', stop_id: '', arrival_time: '' });
      })
      .catch((error) => {
        console.error('Error creating stop time:', error);
        alert('Failed to create stop time');
      });
  };

  // Handle edit action for stop time
  const handleEdit = (stopTime) => {
    setEditingStopTime(stopTime);
    setNewStopTime({
      route_id: stopTime.route_id,
      stop_id: stopTime.stop_id,
      arrival_time: stopTime.arrival_time
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!newStopTime.route_id || !newStopTime.stop_id || !newStopTime.arrival_time) {
      alert('Route, Stop, and Time are required');
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/stop-times/${newStopTime.route_id}/${newStopTime.stop_id}`,
        { arrival_time: newStopTime.arrival_time }
      )
      .then(() => {
        const updatedStopTimes = stopTimes.map((time) =>
          time.route_id === newStopTime.route_id && time.stop_id === newStopTime.stop_id
            ? { ...time, arrival_time: newStopTime.arrival_time }
            : time
        );
        setStopTimes(updatedStopTimes);
        setNewStopTime({ route_id: '', stop_id: '', arrival_time: '' });
        setEditingStopTime(null);  // Clear editing state
      })
      .catch((error) => {
        console.error('Error updating stop time:', error);
        alert('Failed to update stop time');
      });
  };

  // Handle delete action for stop time
  const handleDelete = (route_id, stop_id) => {
    if (window.confirm('Are you sure you want to delete this stop time?')) {
      axios
        .delete(`http://localhost:5000/api/stop-times/${route_id}/${stop_id}`)
        .then(() => {
          const updatedStopTimes = stopTimes.filter(
            (time) => !(time.route_id === route_id && time.stop_id === stop_id)
          );
          setStopTimes(updatedStopTimes);
        })
        .catch((error) => {
          console.error('Error deleting stop time:', error);
          alert('Failed to delete stop time');
        });
    }
  };

  return (
    <div>
      <AdminNavbar/>
      <h4>Stop Time Management</h4>

      {/* Route Dropdown */}
      <select value={newStopTime.route_id} onChange={handleRouteChange}>
        <option value="">Select Route</option>
        {routes.map((route) => (
          <option key={route.route_id} value={route.route_id}>
            {route.route_name}
          </option>
        ))}
      </select>

      {/* Stop Dropdown */}
      <select value={newStopTime.stop_id} onChange={handleStopChange} disabled={!newStopTime.route_id}>
        <option value="">Select Stop</option>
        {stops.map((stop) => (
          <option key={stop.stop_id} value={stop.stop_id}>
            {stop.location}
          </option>
        ))}
      </select>

      {/* Arrival Time */}
      <input
        type="time"
        value={newStopTime.arrival_time}
        onChange={handleTimeChange}
      />

      {/* Create or Update Stop Time */}
      <button onClick={editingStopTime ? handleUpdateSubmit : handleCreateSubmit}>
        {editingStopTime ? 'Update Stop Time' : 'Create Stop Time'}
      </button>

      {/* Stop Times Table */}
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Stop</th>
            <th>Arrival Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stopTimes.map((time) => (
            <tr key={`${time.route_id}-${time.stop_id}`}>
              <td>{time.route_name}</td>
              <td>{time.stop_name}</td>
              <td>{time.arrival_time}</td>
              <td>
                <button onClick={() => handleEdit(time)}>Edit</button>
                <button onClick={() => handleDelete(time.route_id, time.stop_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StopTimeManagement;
