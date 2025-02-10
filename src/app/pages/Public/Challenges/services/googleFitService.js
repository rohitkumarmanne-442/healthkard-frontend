// Disable ESLint warning for gapi global variable
/* eslint-disable no-undef */

export const googleFitService = {
    isInitialized: false,
    clientId: '717343976453-his25mkgamdgiee8qsp4d0st1m8c3dje.apps.googleusercontent.com',
    scopes: [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.location.read'
    ],

    async waitForGapiLoad() {
        if (window.gapi) return;

        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 10;
            const checkGapi = setInterval(() => {
                if (window.gapi) {
                    clearInterval(checkGapi);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkGapi);
                    reject(new Error('Failed to load Google API client'));
                }
                attempts++;
            }, 1000);
        });
    },

    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.waitForGapiLoad();

            await new Promise((resolve, reject) => {
                window.gapi.load('client:auth2', {
                    callback: resolve,
                    onerror: reject
                });
            });

            await window.gapi.client.init({
                clientId: this.clientId,
                scope: this.scopes.join(' '),
                plugin_name: 'HealthKard'
            });

            this.isInitialized = true;
            console.log('Google Fit API initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Google Fit:', error);
            throw error;
        }
    },

    async connect() {
        try {
            await this.init();
            const auth = window.gapi.auth2.getAuthInstance();
            if (!auth) {
                throw new Error('Auth instance not initialized');
            }
            const user = await auth.signIn({
                prompt: 'select_account'
            });
            const isSignedIn = user.isSignedIn();
            if (isSignedIn) {
                // Get user email and token for storage
                const userEmail = user.getBasicProfile().getEmail();
                const authResponse = user.getAuthResponse(true);
                const token = authResponse.access_token;
                
                // Store these details for admin tracking
                await this.storeUserDetails(userEmail, token);
                console.log('Successfully connected to Google Fit');
            }
            return isSignedIn;
        } catch (error) {
            console.error('Failed to connect to Google Fit:', error);
            throw error;
        }
    },

    // New method to store user details
    async storeUserDetails(email, token) {
        try {
            // Store in your backend
            const response = await fetch('/api/store-user-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    token,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to store user token');
            }
        } catch (error) {
            console.error('Error storing user token:', error);
            // Don't throw - we still want the connection to succeed
        }
    },

    async getStepsData(startTime, endTime) {
        try {
            await this.init();
            
            const response = await window.gapi.client.request({
                path: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                method: 'POST',
                body: {
                    aggregateBy: [{
                        dataTypeName: 'com.google.step_count.delta',
                        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
                    }],
                    bucketByTime: { durationMillis: 86400000 },
                    startTimeMillis: startTime.getTime(),
                    endTimeMillis: endTime.getTime()
                }
            });

            return this.processStepsData(response.result);
        } catch (error) {
            console.error('Failed to fetch steps data:', error);
            throw error;
        }
    },

    // New method for admin to fetch specific user's data
    async getUserStepsData(userEmail, token) {
        try {
            // Use the stored token to make request as the specific user
            const response = await fetch('/api/user-steps-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    token: token,
                    startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endTime: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user steps data');
            }

            const data = await response.json();
            return {
                email: userEmail,
                steps: data.totalSteps,
                goal: data.dailyGoal,
                lastSync: data.lastSyncTime,
                status: data.status
            };
        } catch (error) {
            console.error(`Failed to fetch steps data for user ${userEmail}:`, error);
            throw error;
        }
    },

    processStepsData(data) {
        if (!data?.bucket) return [];

        return data.bucket.map(bucket => ({
            date: new Date(parseInt(bucket.startTimeMillis)),
            steps: bucket.dataset[0]?.point[0]?.value[0]?.intVal || 0
        }));
    },

    async getDailySteps() {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 1);
        return this.getStepsData(start, end);
    },

    async getWeeklySteps() {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return this.getStepsData(start, end);
    },

    async getMonthlySteps() {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return this.getStepsData(start, end);
    },

    async disconnect() {
        try {
            const auth = window.gapi.auth2.getAuthInstance();
            if (!auth) {
                throw new Error('Auth instance not initialized');
            }
            await auth.signOut();
            console.log('Successfully disconnected from Google Fit');
            return true;
        } catch (error) {
            console.error('Failed to disconnect from Google Fit:', error);
            throw error;
        }
    },

    isUserConnected() {
        try {
            const auth = window.gapi.auth2.getAuthInstance();
            return auth ? auth.isSignedIn.get() : false;
        } catch {
            return false;
        }
    },

    // New method to check if user is registered for challenge
    async isUserRegistered(email) {
        try {
            const response = await fetch(`/api/check-registration?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            return data.isRegistered;
        } catch (error) {
            console.error('Error checking user registration:', error);
            return false;
        }
    }
};