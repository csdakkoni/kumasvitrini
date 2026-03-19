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
                'x-merchant-id': process.env.UPS_SHIPPER_NUMBER || ''
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

export async function createUpsLabel(order: import('../types').Order) {
    const token = await getUpsToken();
    const shipperNumber = process.env.UPS_SHIPPER_NUMBER;

    if (!shipperNumber) {
        throw new Error("UPS Shipper Number is missing in environment variables.");
    }

    // Prepare UPS Shipment Request
    const shipmentRequest = {
        ShipmentRequest: {
            Request: {
                RequestOption: "nonvalidate",
                TransactionReference: {
                    CustomerContext: `Order: ${order.order_number}`
                }
            },
            Shipment: {
                Description: "Kumas Vitrini Siparis",
                Shipper: {
                    Name: "Grohn Textile",
                    AttentionName: "Grohn Textile Depo",
                    TaxIdentificationNumber: "1234567890", // Example
                    Phone: {
                        Number: "02120000000"
                    },
                    ShipperNumber: shipperNumber,
                    Address: {
                        AddressLine: "Organize Sanayi Bolgesi",
                        City: "Istanbul",
                        StateProvinceCode: "34",
                        PostalCode: "34000",
                        CountryCode: "TR"
                    }
                },
                ShipTo: {
                    Name: order.shipping_address.full_name,
                    AttentionName: order.shipping_address.full_name,
                    Phone: {
                        Number: order.shipping_address.phone
                    },
                    Address: {
                        AddressLine: order.shipping_address.address_line1.substring(0, 35), // UPS limits address lines
                        City: order.shipping_address.city,
                        StateProvinceCode: order.shipping_address.district.substring(0, 5), // Not always required for TR but UPS expects it or empty
                        PostalCode: order.shipping_address.postal_code || '34000',
                        CountryCode: "TR"
                    }
                },
                PaymentInformation: {
                    ShipmentCharge: {
                        Type: "01",
                        BillShipper: {
                            AccountNumber: shipperNumber
                        }
                    }
                },
                Service: {
                    Code: "11", // Standard
                    Description: "Standard"
                },
                Package: {
                    Description: "Kumas",
                    Packaging: {
                        Code: "02", // Custom Packaging
                        Description: "Package"
                    },
                    Dimensions: {
                        UnitOfMeasurement: { Code: "CM", Description: "Centimeters" },
                        Length: "30",
                        Width: "20",
                        Height: "10"
                    },
                    PackageWeight: {
                        UnitOfMeasurement: { Code: "KGS", Description: "Kilograms" },
                        Weight: order.items.length.toString() // Approximating 1kg per item for simplicity, ideally calculated
                    }
                },
            },
            LabelSpecification: {
                LabelImageFormat: {
                    Code: "GIF",
                    Description: "GIF"
                },
                HTTPUserAgent: "Mozilla/4.5"
            }
        }
    };

    const response = await fetch(`${UPS_API_BASE_URL}/api/shipments/v1/ship`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'transId': order.order_number || `REQ-${Date.now()}`,
            'transactionSrc': 'testing'
        },
        body: JSON.stringify(shipmentRequest)
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("UPS Shipment Error:", err);
        throw new Error(`Failed to create UPS label: ${response.status} ${err}`);
    }

    const data = await response.json();
    return data;
}
