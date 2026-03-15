import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusStyles = {
    VALID: 'bg-green-100 text-green-700',
    EXPIRED: 'bg-yellow-100 text-yellow-700',
    REVOKED: 'bg-red-100 text-red-700',
};

const BASE_URL = 'https://ddvs-backend.onrender.com';

export default function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (id) => {
        const reason = prompt('Enter revocation reason:');
        if (!reason) return;
        try {
            await api.put('/documents/' + id + '/revoke', { reason });
            fetchDocuments();
        } catch (err) {
            alert('Failed to revoke document.');
        }
    };

    const openLink = (path) => {
        window.open(BASE_URL + path, '_blank');
    };

    if (loading) return <p className="text-gray-500 text-sm">Loading documents...</p>;

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Issued Documents</h2>
            {documents.length === 0 ? (
                <p className="text-gray-500 text-sm">No documents found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-xl shadow text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Owner</th>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Issuer</th>
                                <th className="px-4 py-3 text-left">Code</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Issued</th>
                                <th className="px-4 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {documents.map(doc => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{doc.ownerName}</td>
                                    <td className="px-4 py-3">{doc.title}</td>
                                    <td className="px-4 py-3">{doc.documentType}</td>
                                    <td className="px-4 py-3">{doc.issuerName}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{doc.verificationCode}</td>
                                    <td className="px-4 py-3">
                                        <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + statusStyles[doc.status]}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{doc.issuedDate}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3 items-center">
                                            <button
                                                onClick={() => openLink('/qr/' + doc.verificationCode)}
                                                className="text-blue-600 hover:underline text-xs"
                                            >
                                                QR Code
                                            </button>
                                            <button
                                                onClick={() => openLink('/certificates/' + doc.verificationCode)}
                                                className="text-green-600 hover:underline text-xs"
                                            >
                                                Certificate
                                            </button>
                                            {doc.status === 'VALID' && (
                                                <button
                                                    onClick={() => handleRevoke(doc.id)}
                                                    className="text-red-600 hover:underline text-xs"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
