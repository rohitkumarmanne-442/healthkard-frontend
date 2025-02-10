// src/app/pages/Public/Challenges/index.jsx
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import axios from 'axios';

function Challenges() {
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                console.log('Fetching current challenge...');
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/challenges/admin/check-current-challenge');
                
                if (response.data && response.data.challenge) {
                    // Transform backend data to match your Card component's expected format
                    const challengeData = {
                        id: response.data.challenge._id, // Use the actual MongoDB _id
                        title: response.data.challenge.title,
                        description: response.data.challenge.description,
                        duration: response.data.challenge.duration,
                        prize: parseInt(response.data.challenge.reward.replace(/[^0-9]/g, '')), // Extract number from "₹ 10000"
                        image: "/step-challenge.jpg"
                    };
                    setChallenge(challengeData);
                }
            } catch (err) {
                console.error('Error fetching challenge:', err);
                setError(err.message);
                // Fallback to default data if fetch fails
                setChallenge({
                    id: 1,
                    title: "30-Day Step Challenge",
                    description: "Walk 10,000 steps every day for 30 days to improve your fitness and win exciting prizes!",
                    duration: 30,
                    prize: 10000,
                    image: "/step-challenge.jpg"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, []);

    if (loading) {
        return <div className="w-full min-h-full flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        console.warn('Using fallback challenge data due to error:', error);
    }

    return (
        <div className='w-full min-h-full'>
            {challenge && <Card challenge={challenge} />}
        </div>
    );
}

export default Challenges;