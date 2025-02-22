import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Input, Modal } from "antd";
import AdminNavbar from "../components/AdminNavbar";

const API_URL = "http://localhost:5000/api/knowledge";

const AdminKnowledgeBase = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ question: "", answer: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!form.question || !form.answer) return alert("Please fill in all fields");

        try {
            if (editingItem) {
                await axios.put(`${API_URL}/${editingItem.id}`, form);
            } else {
                await axios.post(API_URL, form);
            }
            setModalVisible(false);
            setEditingItem(null);
            setForm({ question: "", answer: "" });
            fetchData();
        } catch (err) {
            console.error("Error saving data:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchData();
        } catch (err) {
            console.error("Error deleting data:", err);
        }
    };

    return (
        <div>
            <AdminNavbar/>
            <h2>Admin Knowledge Base</h2>
            <Button type="primary" onClick={() => { setModalVisible(true); setEditingItem(null); setForm({ question: "", answer: "" }); }}>Add New</Button>

            <Table dataSource={data} rowKey="id" loading={loading} style={{ marginTop: 20 }} bordered>
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column title="Question" dataIndex="question" />
                <Table.Column title="Answer" dataIndex="answer" />
                <Table.Column title="Actions" render={(record) => (
                    <>
                        <Button onClick={() => { setEditingItem(record); setForm(record); setModalVisible(true); }}>Edit</Button>
                        <Button danger onClick={() => handleDelete(record.id)} style={{ marginLeft: 8 }}>Delete</Button>
                    </>
                )} />
            </Table>

            <Modal title={editingItem ? "Edit Question" : "Add New Question"} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleSave}>
                <Input placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} style={{ marginBottom: 10 }} />
                <Input.TextArea placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            </Modal>
        </div>
    );
};

export default AdminKnowledgeBase;
