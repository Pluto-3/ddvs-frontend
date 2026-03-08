import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function IssuerList() {
    const [issuers, setIssuers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', organizationType: '', contactEmail: '' });
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchIssuers();
    }, []);

    const fetchIssuers = async () => {
        try {
            const res = await api.get('/issuers');
            setIssuers(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/issuers', form);
            setForm({ name: '', organizationType: '', contactEmail: '' });
            setShowForm(false);
            fetchIssuers();
        } catch (err) {
            setError('Failed to create issuer.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this issuer?')) return;
        try {
            await api.delete(`/issuers/${id}`);
            fetchIssuers();
        } catch {
            alert('Failed to delete issuer.');
        }
    };

    if (loading) return <p className="text-gray-500 text-sm">Loading issuers...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Issuers</h2>
                <button onClick={() => setShowForm(!showForm)}
                    className="bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-800 transition">
                    {showForm ? 'Cancel' : '+ Add Issuer'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-4 space-y-3 max-w-md">
                    <input name="name" value={form.name} placeholder="Issuer name"
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required className="input" />
                    <input name="organizationType" value={form.organizationType} placeholder="Organization type"
                        onChange={e => setForm({ ...form, organizationType: e.target.value })}
                        required className="input" />
                    <input name="contactEmail" value={form.contactEmail} placeholder="Contact email"
                        onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                        required className="input" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit"
                        className="w-full bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
                        Create Issuer
                    </button>
                </form>
            )}

            <div className="grid gap-3">
                {issuers.map(issuer => (
                    <div key={issuer.id} className="bg-white rounded-xl shadow px-5 py-4 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800">{issuer.name}</p>
                            <p className="text-xs text-gray-500">{issuer.organizationType} · {issuer.contactEmail}</p>
                        </div>
                        <button onClick={() => handleDelete(issuer.id)}
                            className="text-red-500 text-xs hover:underline">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}