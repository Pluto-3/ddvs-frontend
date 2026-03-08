import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const statusStyles = {
    VALID: 'bg-green-100 text-green-700 border border-green-300',
    EXPIRED: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    REVOKED: 'bg-red-100 text-red-700 border border-red-300',
    NOT_FOUND: 'bg-gray-100 text-gray-600 border border-gray-300',
};

export default function VerifyPage() {
    const { code } = useParams();
    const [input, setInput] = useState(code || '');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (code) handleVerify(code);
    }, []);

    const handleVerify = async (verifyCode) => {
        const target = verifyCode || input;
        if (!target.trim()) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await api.get(`/verify/${target.trim()}`);
            setResult(res.data);
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-700">DDVS</h1>
                    <p className="text-gray-500 text-sm mt-1">Document Verification Portal</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter verification code e.g. TZ-EDU-60828"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handleVerify()}
                        disabled={loading}
                        className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50"
                    >
                        {loading ? '...' : 'Verify'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {result && (
                    <div className="border border-gray-200 rounded-xl p-5 space-y-3">

                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[result.status]}`}>
                            {result.status}
                        </div>

                        <p className="text-sm text-gray-600 italic">{result.message}</p>

                        {result.status !== 'NOT_FOUND' && (
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <Row label="Document" value={result.title} />
                                <Row label="Type" value={result.documentType} />
                                <Row label="Owner" value={result.ownerName} />
                                <Row label="Issued By" value={result.issuedBy} />
                                <Row label="Issued Date" value={result.issuedDate} />
                                <Row label="Expiration" value={result.expirationDate || 'N/A'} />
                                <Row label="Code" value={result.verificationCode} />
                            </div>
                        )}
                    </div>
                )}

                <p className="text-center text-sm text-gray-400 mt-6">
                    Are you an issuer?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
                </p>
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-800">{value}</span>
        </div>
    );
}