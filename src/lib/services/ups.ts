// UPS API Integration Module
// This module handles UPS API Authentication and Shipping functionality

const UPS_CLIENT_ID = process.env.UPS_CLIENT_ID;
const UPS_CLIENT_SECRET = process.env.UPS_CLIENT_SECRET;
const UPS_API_BASE_URL = 'https://onlinetools.ups.com'; // Production URL since these are real keys

let accessToken: string | null = null;
let tokenExpiry = 0;

/**
 * Authenticates with the UPS OAuth API
 * Returns the access token. Token is cached in memory until it expires.
 */
export async function getUpsToken(): Promise<string> {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!UPS_CLIENT_ID || !UPS_CLIENT_SECRET) {
        throw new Error('UPS credentials are not properly configured.');
    }

    const authString = Buffer.from(`${UPS_CLIENT_ID}:${UPS_CLIENT_SECRET}`).toString('base64');

    try {
        const response = await fetch(`${UPS_API_BASE_URL}/security/v1/oauth/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-merchant-id': 'UPS_SHIPPER_NUMBER_HERE' // We will need the user to provide this
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials'
            }).toString(),
            // Ensure this doesn't get aggressively cached by Next.js if dynamic
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`UPS Auth Failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        accessToken = data.access_token;
        // token expires in data.expires_in seconds, buffer by 5 minutes (300 seconds)
        tokenExpiry = Date.now() + (parseInt(data.expires_in) - 300) * 1000;
        
        return accessToken!;
    } catch (error) {
        console.error('UPS Authentication error:', error);
        throw error;
    }
}
