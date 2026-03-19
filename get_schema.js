require('dotenv').config({ path: '.env.local' });

async function getSchema() {
    const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/', {
        headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
    });
    const data = await res.json();
    const orders = data.definitions.orders.properties;
    const orderItems = data.definitions.order_items.properties;
    console.log(Object.keys(orders).join(", "));
    console.log(Object.keys(orderItems).join(", "));
}

getSchema();
