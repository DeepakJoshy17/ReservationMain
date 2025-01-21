import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    role: 'User',
  });

  const [updateUser, setUpdateUser] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users/all')
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Error fetching users!', error);
      });
  }, []);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    axios
      .post('http://localhost:5000/api/users/create', newUser)
      .then((response) => {
        alert('User created successfully!');
        setUsers((prevUsers) => [...prevUsers, { ...newUser, user_id: response.data.userId }]);
        setNewUser({
          name: '',
          email: '',
          password: '',
          phone_number: '',
          address: '',
          role: 'User',
        });
      })
      .catch((error) => {
        console.error('Error creating user!', error);
        alert('Error creating user');
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateUser.name || !updateUser.email || !updateUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    axios
      .put('http://localhost:5000/api/users/update', updateUser)
      .then((response) => {
        alert('User updated successfully!');
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === updateUser.user_id ? { ...updateUser } : user
          )
        );
        setUpdateUser(null);
      })
      .catch((error) => {
        console.error('Error updating user!', error);
        alert('Error updating user');
      });
  };

  const handleDelete = (user_id) => {
    axios
      .delete(`http://localhost:5000/api/users/delete/${user_id}`)
      .then(() => {
        alert('User deleted successfully!');
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== user_id));
      })
      .catch((error) => {
        console.error('Error deleting user!', error);
        alert('Error deleting user');
      });
  };

  const handleEdit = (user) => {
    setUpdateUser(user);
  };

  return (
    <div className="p-6">
      <AdminNavbar/>
      <h4 className="text-3xl font-semibold text-gray-800 mb-6">User Management</h4>

      {/* User Creation Form */}
      <form onSubmit={handleCreateSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={newUser.phone_number}
          onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Create User
        </button>
      </form>

      {/* User Update Form */}
      {updateUser && (
        <form onSubmit={handleUpdateSubmit} className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update User</h2>
          <input
            type="text"
            placeholder="Name"
            value={updateUser.name}
            onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={updateUser.email}
            onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={updateUser.password}
            onChange={(e) => setUpdateUser({ ...updateUser, password: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={updateUser.phone_number}
            onChange={(e) => setUpdateUser({ ...updateUser, phone_number: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Address"
            value={updateUser.address}
            onChange={(e) => setUpdateUser({ ...updateUser, address: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <select
            value={updateUser.role}
            onChange={(e) => setUpdateUser({ ...updateUser, role: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
          >
            Update User
          </button>
        </form>
      )}

      {/* User List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 text-left text-gray-800">Name</th>
              <th className="p-2 text-left text-gray-800">Email</th>
              <th className="p-2 text-left text-gray-800">Role</th>
              <th className="p-2 text-left text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-2 text-center text-gray-500">No users available</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
