import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const StopManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [newStop, setNewStop] = useState({
    route_id: '',
    location: '',
    stop_order: 0,
    distance_km: 0.0,
  });

  const [updateStop, setUpdateStop] = useState(null);

  // Fetch routes and route stops on initial render
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/routes')  // Get all routes for the dropdown
      .then((response) => {
        setRoutes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching routes:', error);
      });

    axios
      .get('http://localhost:5000/api/route_stops')  // Get all route stops
      .then((response) => {
        setRouteStops(response.data);
      })
      .catch((error) => {
        console.error('Error fetching route stops:', error);
      });
  }, []);

  // Create a new route stop
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (!newStop.route_id || !newStop.location || newStop.stop_order === undefined || newStop.distance_km === undefined) {
      alert('All fields are required');
      return;
    }

    axios
      .post('http://localhost:5000/api/route_stops', newStop)
      .then((response) => {
        alert('Route stop created successfully!');
        setRouteStops((prevStops) => [
          ...prevStops,
          { ...newStop, stop_id: response.data.stop_id },
        ]);
        setNewStop({
          route_id: '',
          location: '',
          stop_order: 0,
          distance_km: 0.0,
        });
      })
      .catch((error) => {
        console.error('Error creating route stop:', error);
        alert('Failed to create route stop');
      });
  };

  // Update a route stop
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!updateStop.route_id || !updateStop.location || updateStop.stop_order === undefined || updateStop.distance_km === undefined) {
      alert('All fields are required');
      return;
    }

    axios
      .put(`http://localhost:5000/api/route_stops/${updateStop.stop_id}`, updateStop)
      .then(() => {
        alert('Route stop updated successfully!');
        setRouteStops((prevStops) =>
          prevStops.map((stop) =>
            stop.stop_id === updateStop.stop_id ? { ...updateStop } : stop
          )
        );
        setUpdateStop(null);
      })
      .catch((error) => {
        console.error('Error updating route stop:', error);
        alert('Failed to update route stop');
      });
  };

  // Delete a route stop
  const handleDelete = (stop_id) => {
    axios
      .delete(`http://localhost:5000/api/route_stops/${stop_id}`)
      .then(() => {
        alert('Route stop deleted successfully!');
        setRouteStops((prevStops) =>
          prevStops.filter((stop) => stop.stop_id !== stop_id)
        );
      })
      .catch((error) => {
        console.error('Error deleting route stop:', error);
        alert('Failed to delete route stop');
      });
  };

  // Select stop to update
  const handleEdit = (stop) => {
    setUpdateStop(stop);
  };

  // Function to get route name by route_id
  const getRouteName = (route_id) => {
    const route = routes.find((r) => r.route_id === route_id);
    return route ? route.route_name : 'Unknown Route';
  };

  return (
    <div>
      <AdminNavbar/>
      <h4>Route Stop Management</h4>

      {/* Create Route Stop Form */}
      <form onSubmit={handleCreateSubmit}>
        <select
          value={newStop.route_id}
          onChange={(e) => setNewStop({ ...newStop, route_id: e.target.value })}
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route.route_id} value={route.route_id}>
              {route.route_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={newStop.location}
          onChange={(e) => setNewStop({ ...newStop, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stop Order"
          value={newStop.stop_order}
          onChange={(e) => setNewStop({ ...newStop, stop_order: e.target.value })}
        />
        <input
          type="number"
          placeholder="Distance (km)"
          value={newStop.distance_km}
          onChange={(e) => setNewStop({ ...newStop, distance_km: e.target.value })}
        />
        <button type="submit">Create Route Stop</button>
      </form>

      {/* Update Route Stop Form */}
      {updateStop && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Update Route Stop</h2>
          <select
            value={updateStop.route_id}
            onChange={(e) => setUpdateStop({ ...updateStop, route_id: e.target.value })}
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.route_id} value={route.route_id}>
                {route.route_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Location"
            value={updateStop.location}
            onChange={(e) => setUpdateStop({ ...updateStop, location: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stop Order"
            value={updateStop.stop_order}
            onChange={(e) => setUpdateStop({ ...updateStop, stop_order: e.target.value })}
          />
          <input
            type="number"
            placeholder="Distance (km)"
            value={updateStop.distance_km}
            onChange={(e) => setUpdateStop({ ...updateStop, distance_km: e.target.value })}
          />
          <button type="submit">Update Route Stop</button>
        </form>
      )}

      {/* Route Stops List */}
      <ul>
        {routeStops.length === 0 ? (
          <p>No route stops available</p>
        ) : (
          routeStops.map((stop) => (
            <li key={stop.stop_id}>
              {getRouteName(stop.route_id)} - {stop.location} (Order: {stop.stop_order}, Distance: {stop.distance_km} km)
              <button onClick={() => handleEdit(stop)}>Edit</button>
              <button onClick={() => handleDelete(stop.stop_id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StopManagement;
