// Test using the iyzipay npm package directly (works locally, not on Vercel)
const Iyzipay = require('iyzipay');
require('dotenv').config({ path: '.env.local' });

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

const request = {
    locale: "tr",
    conversationId: "test-npm-123",
    price: "100.00",
    paidPrice: "110.00",
    currency: Iyzipay.CURRENCY.TRY,
    basketId: "KV-TEST-NPM",
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
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
            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
            price: "100.00"
        }
    ]
};

iyzipay.checkoutFormInitialize.create(request, (err, result) => {
    if (err) {
        console.error("NPM Package Error:", err);
        return;
    }
    console.log("NPM Package Result:", JSON.stringify(result, null, 2).substring(0, 800));
    console.log("Has checkoutFormContent:", !!result.checkoutFormContent);
});
