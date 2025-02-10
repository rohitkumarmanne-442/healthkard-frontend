import React, { useEffect, useState } from 'react';
import { challenges as defaultChallenges } from '../constants';
import Card from '../components/Card';
import axios from 'axios';

function ChallengesContainer() {
    const [challenges, setChallenges] = useState(defaultChallenges);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    'http://localhost:5000/api/challenges/admin/check-current-challenge',
                    { withCredentials: true }
                );
                
                if (response.data && response.data.challenge) {
                    // Transform backend data to match your existing challenge format
                    const activeChallenge = {
                        ...defaultChallenges[0], // Keep default image and other UI properties
                        id: response.data.challenge._id,
                        title: response.data.challenge.title,
                        description: response.data.challenge.description,
                        duration: response.data.challenge.duration,
                        prize: parseInt(response.data.challenge.reward?.replace(/[^0-9]/g, '') || '10000')
                    };
                    
                    setChallenges([activeChallenge]);
                }
            } catch (error) {
                console.error('Error fetching challenges:', error);
                // Fallback to default challenges if fetch fails
                setChallenges(defaultChallenges);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    return (
        <div className='w-full min-h-full flex flex-col justify-start items-start p-4'>
            <div className='w-full flex flex-col gap-4 justify-center items-start'>
                <div className='flex flex-col gap-4 justify-center items-center font-bold text-2xl'>
                    Health Challenges
                </div>
                <div className=''>
                    Join our challenges to improve your health and win exciting prizes!
                </div>
            </div>
            <div className='w-full flex flex-col gap-4 justify-center items-start'>
                {loading ? (
                    <div className="w-full text-center py-4">Loading challenges...</div>
                ) : (
                    challenges.map((challenge) => (
                        <Card key={challenge.id} challenge={challenge} />
                    ))
                )}
            </div>
        </div>
    );
}

export default ChallengesContainer;