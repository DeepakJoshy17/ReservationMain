import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [boats, setBoats] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    boat_id: '',
    route_id: '',
    departure_time: '',
    arrival_time: '',
    status: 'Scheduled',
  });
  const [updateSchedule, setUpdateSchedule] = useState(null);

  // Fetch schedules, boats, and routes on component mount
  useEffect(() => {
    fetchSchedules();
    fetchBoats();
    fetchRoutes();
  }, []);

  const fetchSchedules = () => {
    axios
      .get('http://localhost:5000/api/schedules')
      .then((response) => {
        setSchedules(response.data);
      })
      .catch((error) => console.error('Error fetching schedules:', error));
  };

  const fetchBoats = () => {
    axios
      .get('http://localhost:5000/api/boats')
      .then((response) => {
        setBoats(response.data);
      })
      .catch((error) => console.error('Error fetching boats:', error));
  };

  const fetchRoutes = () => {
    axios
      .get('http://localhost:5000/api/routes')
      .then((response) => {
        setRoutes(response.data);
      })
      .catch((error) => console.error('Error fetching routes:', error));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/schedules', newSchedule)
      .then(() => {
        alert('Schedule added successfully!');
        fetchSchedules();
        setNewSchedule({
          boat_id: '',
          route_id: '',
          departure_time: '',
          arrival_time: '',
          status: 'Scheduled',
        });
      })
      .catch((error) => {
        console.error('Error adding schedule:', error);
        alert('Failed to add schedule.');
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/schedules/${updateSchedule.schedule_id}`, updateSchedule)
      .then(() => {
        alert('Schedule updated successfully!');
        fetchSchedules();
        setUpdateSchedule(null);
      })
      .catch((error) => {
        console.error('Error updating schedule:', error);
        alert('Failed to update schedule.');
      });
  };

  const handleDelete = (schedule_id) => {
    axios
      .delete(`http://localhost:5000/api/schedules/${schedule_id}`)
      .then(() => {
        alert('Schedule deleted successfully!');
        fetchSchedules();
      })
      .catch((error) => {
        console.error('Error deleting schedule:', error);
        alert('Failed to delete schedule.');
      });
  };

  return (
    <div>
      <AdminNavbar/>
      <h1>Schedule Management</h1>

      {/* Create Schedule Form */}
      <form onSubmit={handleCreateSubmit}>
        <h2>Add New Schedule</h2>
        <select
          value={newSchedule.boat_id}
          onChange={(e) => setNewSchedule({ ...newSchedule, boat_id: e.target.value })}
        >
          <option value="">Select Boat</option>
          {boats.map((boat) => (
            <option key={boat.boat_id} value={boat.boat_id}>
              {boat.boat_name}
            </option>
          ))}
        </select>

        <select
          value={newSchedule.route_id}
          onChange={(e) => setNewSchedule({ ...newSchedule, route_id: e.target.value })}
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route.route_id} value={route.route_id}>
              {route.route_name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={newSchedule.departure_time}
          onChange={(e) => setNewSchedule({ ...newSchedule, departure_time: e.target.value })}
          placeholder="Departure Time"
        />

        <input
          type="datetime-local"
          value={newSchedule.arrival_time}
          onChange={(e) => setNewSchedule({ ...newSchedule, arrival_time: e.target.value })}
          placeholder="Arrival Time"
        />

        <select
          value={newSchedule.status}
          onChange={(e) => setNewSchedule({ ...newSchedule, status: e.target.value })}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">Add Schedule</button>
      </form>

      {/* Update Schedule Form */}
      {updateSchedule && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Update Schedule</h2>
          <select
            value={updateSchedule.boat_id}
            onChange={(e) => setUpdateSchedule({ ...updateSchedule, boat_id: e.target.value })}
          >
            <option value="">Select Boat</option>
            {boats.map((boat) => (
              <option key={boat.boat_id} value={boat.boat_id}>
                {boat.boat_name}
              </option>
            ))}
          </select>

          <select
            value={updateSchedule.route_id}
            onChange={(e) => setUpdateSchedule({ ...updateSchedule, route_id: e.target.value })}
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.route_id} value={route.route_id}>
                {route.route_name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={updateSchedule.departure_time}
            onChange={(e) => setUpdateSchedule({ ...updateSchedule, departure_time: e.target.value })}
          />

          <input
            type="datetime-local"
            value={updateSchedule.arrival_time}
            onChange={(e) => setUpdateSchedule({ ...updateSchedule, arrival_time: e.target.value })}
          />

          <select
            value={updateSchedule.status}
            onChange={(e) => setUpdateSchedule({ ...updateSchedule, status: e.target.value })}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button type="submit">Update Schedule</button>
        </form>
      )}

      {/* Schedule List */}
      <h2>Schedules</h2>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.schedule_id}>
            Boat: {schedule.boat_name}, Route: {schedule.route_name}, Departure: {schedule.departure_time}, Arrival: {schedule.arrival_time}, Status: {schedule.status}
            <button onClick={() => setUpdateSchedule(schedule)}>Edit</button>
            <button onClick={() => handleDelete(schedule.schedule_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleManagement;
