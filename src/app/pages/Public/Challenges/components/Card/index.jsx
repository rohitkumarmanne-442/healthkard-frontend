import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleFitService } from '../../services/googleFitService';
import Button from '../../../../../components/Button';
import { ArrowRight, Award, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const Card = ({ challenge }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const navigate = useNavigate();

    const handleGoogleFitConnect = async () => {
        setIsConnecting(true);
        try {
            console.log('Starting Google Fit connection...');
            
            if (!window.gapi) {
                console.error('Google API client not loaded');
                throw new Error('Google API client not loaded. Please refresh the page.');
            }

            console.log('Initializing Google Fit...');
            await googleFitService.init();
            console.log('Google Fit initialized');

            console.log('Attempting to connect...');
            const isConnected = await googleFitService.connect();
            console.log('Connection result:', isConnected);

            if (isConnected) {
                console.log('Successfully connected to Google Fit');
                Swal.fire({
                    title: '<span class="text-green-600">Successfully Connected!</span>',
                    html: '<div class="animate-pulse">Preparing your dashboard...</div>',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didClose: () => {
                        navigate('/challenges/dashboard');
                    }
                });
            } else {
                throw new Error('Failed to connect to Google Fit');
            }
        } catch (error) {
            console.error('Google Fit connection error:', error);
            Swal.fire({
                title: '<span class="text-red-600">Connection Failed</span>',
                html: `<div class="text-gray-700">${error.message}</div>`,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3B82F6'
            });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleViewDetails = () => {
        Swal.fire({
            title: `<span class="text-xl font-bold text-blue-600">Ready for Challenge</span>`,
            html: `
                <div class="space-y-4 p-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-gray-700">${challenge.description}</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Duration</p>
                            <p class="text-lg font-semibold text-gray-700">${challenge.duration} Days</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Prize Pool</p>
                            <p class="text-lg font-semibold text-gray-700">₹${challenge.prize}</p>
                        </div>
                    </div>

                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <p class="text-sm font-medium text-yellow-800">
                            🎯 Complete 10,000 steps daily to win exciting prizes!
                        </p>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Register for Challenge',
            cancelButtonText: 'Maybe Later',
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#6B7280',
            width: '32rem'
        }).then((result) => {
            if (result.isConfirmed) {
                handleGoogleFitConnect();
            }
        });
    };

    return (
        <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
                <img 
                    src={challenge.image} 
                    alt={challenge.title} 
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Ready for Challenge
                </div>
            </div>
            
            <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm">
                        {challenge.description}
                    </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={16} />
                        <span>{challenge.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-semibold">
                        <Award size={16} />
                        <span>₹ {challenge.prize}</span>
                    </div>
                </div>

                <Button
                    label={
                        <div className="flex items-center justify-center gap-2">
                            {isConnecting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <span>View Challenge Details</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </div>
                    }
                    onClick={handleViewDetails}
                    disabled={isConnecting}
                    className="w-full !bg-blue-600 hover:!bg-blue-700 transition-colors duration-300"
                />
            </div>
        </div>
    );
};

export default Card;