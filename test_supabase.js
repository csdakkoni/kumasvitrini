require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    console.log("Checking orders table...");
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    
    if (error) {
         console.error("Error on orders:", error);
    } else {
         console.log("Orders query successful. Sample data or empty array:", data);
    }
    
    console.log("Checking order_items table...");
    const { data: itemData, error: itemError } = await supabase.from('order_items').select('*').limit(1);
    
    if (itemError) {
         console.error("Error on order_items:", itemError);
    } else {
         console.log("Order items query successful.", itemData);
    }
}

check();
