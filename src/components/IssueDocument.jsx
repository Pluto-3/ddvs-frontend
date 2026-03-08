import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function IssueDocument({ onSuccess }) {
    const [issuers, setIssuers] = useState([]);
    const [form, setForm] = useState({
        title: '',
        documentType: '',
        ownerName: '',
        issuerId: '',
        expirationDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/issuers').then(res => setIssuers(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await api.post('/documents', {
                ...form,
                issuerId: parseInt(form.issuerId),
            });
            setSuccess(`Document issued. Verification code: ${res.data.verificationCode}`);
            setForm({ title: '', documentType: '', ownerName: '', issuerId: '', expirationDate: '' });
        } catch (err) {
            setError('Failed to issue document.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Issue New Document</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Document Title">
                    <input name="title" value={form.title} onChange={handleChange} required
                        className="input" placeholder="Bachelor of Science in Computer Science" />
                </Field>

                <Field label="Document Type">
                    <select name="documentType" value={form.documentType} onChange={handleChange} required className="input">
                        <option value="">Select type</option>
                        <option value="CERTIFICATE">Certificate</option>
                        <option value="LICENSE">License</option>
                        <option value="PERMIT">Permit</option>
                        <option value="TAX_CLEARANCE">Tax Clearance</option>
                        <option value="IMMIGRATION">Immigration</option>
                    </select>
                </Field>

                <Field label="Owner Name">
                    <input name="ownerName" value={form.ownerName} onChange={handleChange} required
                        className="input" placeholder="John Doe" />
                </Field>

                <Field label="Issuer">
                    <select name="issuerId" value={form.issuerId} onChange={handleChange} required className="input">
                        <option value="">Select issuer</option>
                        {issuers.map(i => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Expiration Date (optional)">
                    <input type="date" name="expirationDate" value={form.expirationDate}
                        onChange={handleChange} className="input" />
                </Field>

                {success && <p className="text-green-600 text-sm">{success}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" disabled={loading}
                    className="w-full bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50">
                    {loading ? 'Issuing...' : 'Issue Document'}
                </button>
            </form>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    );
}