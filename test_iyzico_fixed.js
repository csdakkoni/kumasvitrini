const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.IYZICO_API_KEY;
const secretKey = process.env.IYZICO_SECRET_KEY;
const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

const uriPath = '/payment/iyzipos/checkoutform/initialize/auth/ecom';

const payload = {
    locale: "tr",
    conversationId: "test-raw-fixed",
    price: "100.00",
    paidPrice: "110.00",
    currency: "TRY",
    basketId: "KV-TEST-RAW",
    paymentGroup: "PRODUCT",
    callbackUrl: "https://kumasvitrini.vercel.app/api/checkout/callback",
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
        id: "test@test.com", name: "Test", surname: "User",
        gsmNumber: "+905350000000", email: "test@test.com",
        identityNumber: "11111111111",
        lastLoginDate: "2025-01-01 12:00:00", registrationDate: "2025-01-01 12:00:00",
        registrationAddress: "Test Adres Mah.",
        ip: "85.34.78.112", city: "Istanbul", country: "Turkey", zipCode: "34000"
    },
    shippingAddress: { contactName: "Test User", city: "Istanbul", country: "Turkey", address: "Test Adres Mah.", zipCode: "34000" },
    billingAddress: { contactName: "Test User", city: "Istanbul", country: "Turkey", address: "Test Adres Mah.", zipCode: "34000" },
    basketItems: [{ id: "ITEM1", name: "Test Kumas", category1: "Textile", category2: "Kumas", itemType: "PHYSICAL", price: "100.00" }]
};

const requestBodyStr = JSON.stringify(payload);
const randomString = String(process.hrtime.bigint()) + Math.random().toString(8).slice(2);

const hashStr = randomString + uriPath + requestBodyStr;
const signature = crypto.createHmac('sha256', secretKey).update(hashStr).digest('hex');
const authorizationParams = ['apiKey:' + apiKey, 'randomKey:' + randomString, 'signature:' + signature].join('&');
const authorization = 'IYZWSv2 ' + Buffer.from(authorizationParams).toString('base64');

async function test() {
    console.log('Testing FIXED raw HTTP call...');
    const res = await fetch(baseUrl + uriPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization,
            'Accept': 'application/json',
            'x-iyzi-rnd': randomString,
            'x-iyzi-client-version': 'iyzipay-node-2.0.65',
        },
        body: requestBodyStr,
    });
    const data = await res.json();
    console.log('Status:', data.status);
    if (data.status === 'success') {
        console.log('✅ SUCCESS! Token:', data.token);
        console.log('Has form content:', !!data.checkoutFormContent);
    } else {
        console.log('❌ Error:', data.errorCode, data.errorMessage);
    }
}

test().catch(console.error);
