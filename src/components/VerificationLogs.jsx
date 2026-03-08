import { useEffect, useState } from 'react';
import api from '../api/axios';

const resultStyles = {
    VALID: 'bg-green-100 text-green-700',
    EXPIRED: 'bg-yellow-100 text-yellow-700',
    REVOKED: 'bg-red-100 text-red-700',
    NOT_FOUND: 'bg-gray-100 text-gray-600',
};

export default function VerificationLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/verification-logs')
            .then(res => setLogs(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-gray-500 text-sm">Loading logs...</p>;

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Verification Logs</h2>
            {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">No logs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-xl shadow text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Verification Code</th>
                                <th className="px-4 py-3 text-left">IP Address</th>
                                <th className="px-4 py-3 text-left">Result</th>
                                <th className="px-4 py-3 text-left">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-400">{log.id}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{log.verificationCode}</td>
                                    <td className="px-4 py-3">{log.ipAddress}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${resultStyles[log.result]}`}>
                                            {log.result}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}