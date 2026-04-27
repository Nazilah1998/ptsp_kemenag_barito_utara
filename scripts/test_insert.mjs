import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Attempting manual insert to catch the error...");
  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      user_id: "713eb028-bc80-4b5f-b235-b36f13c234ea", // User ID dari data sebelumnya
      service_id: 1,
      service_item_id: 1,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    console.error("ERROR CAUGHT:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success! Created request:", data.request_number);
  }
}

main();
