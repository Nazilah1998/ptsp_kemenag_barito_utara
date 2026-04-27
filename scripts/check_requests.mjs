import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking ALL records in service_requests...");
  const {
    data: requests,
    error,
    count,
  } = await supabase.from("service_requests").select("*", { count: "exact" });

  if (error) {
    console.error("Error fetching requests:", error.message);
  } else {
    console.log("Total requests in DB:", count);
    console.log("Records:", JSON.stringify(requests, null, 2));
  }
}

main();
