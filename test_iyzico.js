const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.IYZICO_API_KEY;
const secretKey = process.env.IYZICO_SECRET_KEY;
const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

console.log('API Key:', apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING');
console.log('Secret Key:', secretKey ? secretKey.substring(0, 15) + '...' : 'MISSING');
console.log('Base URL:', baseUrl);

const uriPath = '/payment/iyzipos/checkoutform/initialize/auth/ecom';

const payload = {
    locale: "tr",
    conversationId: "test-123",
    price: "100.00",
    paidPrice: "110.00",
    currency: "TRY",
    basketId: "KV-TEST-001",
    paymentGroup: "PRODUCT",
    callbackUrl: "https://kumasvitrini.vercel.app/api/checkout/callback",
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
        id: "test@test.com",
        name: "Test",
        surname: "User",
        gsmNumber: "+905350000000",
        email: "test@test.com",
        identityNumber: "11111111111",
        lastLoginDate: "2025-01-01 12:00:00",
        registrationDate: "2025-01-01 12:00:00",
        registrationAddress: "Test Adres Mah.",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000"
    },
    shippingAddress: {
        contactName: "Test User",
        city: "Istanbul",
        country: "Turkey",
        address: "Test Adres Mah.",
        zipCode: "34000"
    },
    billingAddress: {
        contactName: "Test User",
        city: "Istanbul",
        country: "Turkey",
        address: "Test Adres Mah.",
        zipCode: "34000"
    },
    basketItems: [
        {
            id: "ITEM1",
            name: "Test Kumas",
            category1: "Textile",
            category2: "Kumas",
            itemType: "PHYSICAL",
            price: "100.00"
        }
    ]
};

const requestBodyStr = JSON.stringify(payload);

// Method 1: IYZWSv2 style
function generateV2Auth() {
    const randomHeaderValue = String(Date.now()) + crypto.randomBytes(4).toString('hex');
    const hashStr = randomHeaderValue + uriPath + requestBodyStr;
    const signature = crypto.createHmac('sha256', secretKey).update(hashStr).digest('base64');
    const authorizationParams = 'apiKey:' + apiKey + '&randomHeaderValue:' + randomHeaderValue + '&signature:' + signature;
    return 'IYZWSv2 ' + Buffer.from(authorizationParams).toString('base64');
}

// Method 2: IYZWS v1 style (SHA1 based) 
function generateV1Auth() {
    const hashStr = apiKey + requestBodyStr + secretKey;
    const hash = crypto.createHash('sha1').update(hashStr).digest('base64');
    return 'IYZWS ' + apiKey + ':' + hash;
}

async function testV2() {
    console.log('\n--- Testing IYZWSv2 ---');
    const url = baseUrl + uriPath;
    const auth = generateV2Auth();
    console.log('URL:', url);
    console.log('Auth Header (first 60 chars):', auth.substring(0, 60) + '...');
    
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth,
            'Accept': 'application/json',
        },
        body: requestBodyStr,
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500));
    return data;
}

async function testV1() {
    console.log('\n--- Testing IYZWS v1 ---');
    const url = baseUrl + uriPath;
    const auth = generateV1Auth();
    console.log('URL:', url);
    console.log('Auth Header (first 60 chars):', auth.substring(0, 60) + '...');
    
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth,
            'Accept': 'application/json',
        },
        body: requestBodyStr,
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500));
    return data;
}

async function main() {
    const v2result = await testV2();
    if (v2result.status !== 'success') {
        await testV1();
    }
}

main().catch(console.error);
