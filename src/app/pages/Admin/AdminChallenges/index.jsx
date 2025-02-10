// src/app/pages/Admin/AdminChallenges/index.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../../components/TableContainer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminChallenges = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const columns = [
        {
            header: 'USER',
            accessor: 'userName',
        },
        {
            header: 'EMAIL',
            accessor: 'email',
        },
        {
            header: 'CHALLENGE',
            accessor: 'challengeName',
        },
        {
            header: 'PROGRESS',
            accessor: 'progress',
            Cell: ({ value }) => (
                <div className="w-full bg-gray-200 rounded">
                    <div 
                        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
                        style={{ width: `${value}%` }}
                    >
                        {value}%
                    </div>
                </div>
            )
        },
        {
            header: 'STATUS',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 rounded text-sm ${
                    value === 'completed' ? 'bg-green-100 text-green-800' :
                    value === 'active' ? 'bg-blue-100 text-blue-800' :
                    value === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
                </span>
            )
        },
        {
            header: 'START DATE',
            accessor: 'startDate',
            Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            header: 'TOTAL STEPS',
            accessor: 'totalSteps',
            Cell: ({ value }) => value?.toLocaleString() || '0'
        }
    ];

    const fetchData = async () => {
        try {
            console.log('Starting to fetch challenge data...');
            setLoading(true);
            setError(null);

            const response = await axios.get('http://localhost:5000/api/challenges/admin/challenges', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            console.log('Response received:', response);

            if (response.data && Array.isArray(response.data)) {
                // Process the data to ensure all required fields
                const processedData = response.data.map(item => ({
                    ...item,
                    progress: Math.round((item.totalSteps / (item.dailyGoal || 10000)) * 100) || 0,
                    status: item.status || 'pending',
                    startDate: item.startDate || new Date().toISOString()
                }));
                console.log('Setting processed data:', processedData);
                setData(processedData);
            } else {
                console.warn('Received non-array data:', response.data);
                setData([]);
            }
        } catch (err) {
            console.error('Detailed error:', {
                message: err.message,
                response: err.response,
                request: err.request
            });
            setError(err.response?.data?.error || err.message || 'Failed to fetch challenges');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('AdminChallenges component mounted');
        fetchData();

        // Auto-refresh every 30 seconds
        const intervalId = setInterval(fetchData, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const handleRowClick = (row) => {
        navigate(`/admin/challenges/${row.original.userId}`);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Challenge Participants</h1>
                <button 
                    onClick={fetchData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Refresh
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={fetchData}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        No challenge participants yet. When users register for challenges, they will appear here.
                    </div>
                ) : (
                    <Table 
                        columns={columns}
                        data={data}
                        className="w-full"
                        onRowClick={handleRowClick}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminChallenges;