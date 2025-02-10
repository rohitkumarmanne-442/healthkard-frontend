import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminChallengeDetails = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/admin/challenges/users/${challengeId}`, {
                withCredentials: true
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    }, [challengeId]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!userData) {
        return <div className="p-6">No user data found</div>;
    }

    const progressPercentage = userData.totalSteps && userData.dailyGoal 
        ? Math.min((userData.totalSteps / userData.dailyGoal) * 100, 100) 
        : 0;

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/adminChallenges')}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Back
                </button>
                <h1 className="text-2xl font-bold">User Challenge Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">User Information</h2>
                    <div className="space-y-3">
                        <p><span className="font-medium">Name:</span> {userData.name}</p>
                        <p><span className="font-medium">Email:</span> {userData.email}</p>
                        <p><span className="font-medium">Status:</span> {userData.status}</p>
                        <p>
                            <span className="font-medium">Registration Date:</span>{' '}
                            {new Date(userData.registrationDate).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Challenge Progress</h2>
                    <div className="space-y-3">
                        <p>
                            <span className="font-medium">Total Steps:</span>{' '}
                            {userData.totalSteps?.toLocaleString() || '0'}
                        </p>
                        <p>
                            <span className="font-medium">Daily Goal:</span>{' '}
                            {userData.dailyGoal?.toLocaleString() || '0'}
                        </p>
                        <p>
                            <span className="font-medium">Last Synced:</span>{' '}
                            {userData.lastSync ? new Date(userData.lastSync).toLocaleString() : 'Never'}
                        </p>
                        <div className="mt-4">
                            <p className="font-medium mb-2">Progress</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChallengeDetails;