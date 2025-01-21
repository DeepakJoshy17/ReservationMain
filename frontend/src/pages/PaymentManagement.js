import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ amount: '', payment_method: '', payment_status: 'Pending', transaction_id: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments'); // Update this if necessary
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/payments/${editId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/payments', form);
      }
      fetchPayments();
      setForm({ amount: '', payment_method: '', payment_status: 'Pending', transaction_id: '' });
      setEditId(null);
    } catch (err) {
      console.error('Error saving payment:', err);
    }
  };

  const handleEdit = (payment) => {
    setEditId(payment.payment_id);
    setForm({ ...payment });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/payments/${id}`);
      fetchPayments();
    } catch (err) {
      console.error('Error deleting payment:', err);
    }
  };

  return (
    <div>
      <AdminNavbar/>
      <h2>Payments</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
        />
        <input
          name="payment_method"
          value={form.payment_method}
          onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
          placeholder="Payment Method"
        />
        <select
          name="payment_status"
          value={form.payment_status}
          onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
        <input
          name="transaction_id"
          value={form.transaction_id}
          onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
          placeholder="Transaction ID"
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <h3>Existing Payments</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Transaction ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.payment_id}>
              <td>{p.payment_id}</td>
              <td>{p.amount}</td>
              <td>{p.payment_method}</td>
              <td>{p.payment_status}</td>
              <td>{p.transaction_id}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.payment_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManagement;
