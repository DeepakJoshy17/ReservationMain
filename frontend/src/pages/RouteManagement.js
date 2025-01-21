import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    route_name: '',
    start_location: '',
    end_location: '',
  });

  const [updateRoute, setUpdateRoute] = useState(null);

  // Fetch routes on initial render
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/routes')
      .then((response) => {
        setRoutes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching routes:', error);
      });
  }, []);

  // Create a new route
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (!newRoute.route_name || !newRoute.start_location || !newRoute.end_location) {
      alert('All fields are required');
      return;
    }

    axios
      .post('http://localhost:5000/api/routes', newRoute)
      .then((response) => {
        alert('Route created successfully!');
        setRoutes((prevRoutes) => [
          ...prevRoutes,
          { ...newRoute, route_id: response.data.route_id },
        ]);
        setNewRoute({
          route_name: '',
          start_location: '',
          end_location: '',
        });
      })
      .catch((error) => {
        console.error('Error creating route:', error);
        alert('Failed to create route');
      });
  };

  // Update a route
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!updateRoute.route_name || !updateRoute.start_location || !updateRoute.end_location) {
      alert('All fields are required');
      return;
    }

    axios
      .put(`http://localhost:5000/api/routes/${updateRoute.route_id}`, updateRoute)
      .then(() => {
        alert('Route updated successfully!');
        setRoutes((prevRoutes) =>
          prevRoutes.map((route) =>
            route.route_id === updateRoute.route_id ? { ...updateRoute } : route
          )
        );
        setUpdateRoute(null);
      })
      .catch((error) => {
        console.error('Error updating route:', error);
        alert('Failed to update route');
      });
  };

  // Delete a route
  const handleDelete = (route_id) => {
    axios
      .delete(`http://localhost:5000/api/routes/${route_id}`)
      .then(() => {
        alert('Route deleted successfully!');
        setRoutes((prevRoutes) =>
          prevRoutes.filter((route) => route.route_id !== route_id)
        );
      })
      .catch((error) => {
        console.error('Error deleting route:', error);
        alert('Failed to delete route');
      });
  };

  // Select route to update
  const handleEdit = (route) => {
    setUpdateRoute(route);
  };

  return (
    <div>
      <AdminNavbar/>
      <h4>Route Management</h4>

      {/* Create Route Form */}
      <form onSubmit={handleCreateSubmit}>
        <input
          type="text"
          placeholder="Route Name"
          value={newRoute.route_name}
          onChange={(e) => setNewRoute({ ...newRoute, route_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Start Location"
          value={newRoute.start_location}
          onChange={(e) => setNewRoute({ ...newRoute, start_location: e.target.value })}
        />
        <input
          type="text"
          placeholder="End Location"
          value={newRoute.end_location}
          onChange={(e) => setNewRoute({ ...newRoute, end_location: e.target.value })}
        />
        <button type="submit">Create Route</button>
      </form>

      {/* Update Route Form */}
      {updateRoute && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Update Route</h2>
          <input
            type="text"
            placeholder="Route Name"
            value={updateRoute.route_name}
            onChange={(e) =>
              setUpdateRoute({ ...updateRoute, route_name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Start Location"
            value={updateRoute.start_location}
            onChange={(e) =>
              setUpdateRoute({ ...updateRoute, start_location: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="End Location"
            value={updateRoute.end_location}
            onChange={(e) =>
              setUpdateRoute({ ...updateRoute, end_location: e.target.value })
            }
          />
          <button type="submit">Update Route</button>
        </form>
      )}

      {/* Route List */}
      <ul>
        {routes.length === 0 ? (
          <p>No routes available</p>
        ) : (
          routes.map((route) => (
            <li key={route.route_id}>
              {route.route_name} ({route.start_location} → {route.end_location})
              <button onClick={() => handleEdit(route)}>Edit</button>
              <button onClick={() => handleDelete(route.route_id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RouteManagement;
