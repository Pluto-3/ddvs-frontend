import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../utils/auth';
import DocumentList from '../../components/DocumentList';
import IssueDocument from '../../components/IssueDocument';
import IssuerList from '../../components/IssuerList';
import VerificationLogs from '../../components/VerificationLogs';

const tabs = ['Documents', 'Issue Document', 'Issuers', 'Verification Logs'];

export default function DashboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Documents');

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
                <div>
                    <h1 className="text-xl font-bold">DDVS</h1>
                    <p className="text-xs text-blue-200">Digital Document Verification System</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm">
                        {user?.name}{' '}
                        <span className="bg-blue-500 text-xs px-2 py-0.5 rounded-full ml-1">
                            {user?.role}
                        </span>
                    </span>
                    <button
                        onClick={logout}
                        className="bg-white text-blue-700 text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6">
                <div className="flex gap-6">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 text-sm font-medium border-b-2 transition ${
                                activeTab === tab
                                    ? 'border-blue-700 text-blue-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'Documents' && <DocumentList />}
                {activeTab === 'Issue Document' && (
                    <IssueDocument onSuccess={() => setActiveTab('Documents')} />
                )}
                {activeTab === 'Issuers' && <IssuerList />}
                {activeTab === 'Verification Logs' && <VerificationLogs />}
            </div>
        </div>
    );
}