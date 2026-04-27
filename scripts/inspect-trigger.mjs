// Script to inspect and fix request_number generation trigger in Supabase
// Run: node scripts/fix-request-number.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ruunarawpewddmxexddl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1dW5hcmF3cGV3ZGRteGV4ZGRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIzOTEzMCwiZXhwIjoyMDkxODE1MTMwfQ.ViD5ITTkBe0tnOYZS9CZXrJ--r2Jxs5FgUAnJYhGNMs",
);

async function main() {
  // 1. Check existing triggers on service_requests
  console.log("\n=== CHECKING TRIGGERS ===");
  const { data: triggers, error: tErr } = await supabase.rpc("exec_sql", {
    sql: `
      SELECT trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'service_requests'
      ORDER BY trigger_name;
    `,
  });
  if (tErr) {
    console.log("exec_sql not available, trying pg_trigger...");
  } else {
    console.log("Triggers:", JSON.stringify(triggers, null, 2));
  }

  // 2. Check existing functions related to request_number
  console.log("\n=== CHECKING FUNCTIONS ===");
  const { data: fns, error: fErr } = await supabase.rpc("exec_sql", {
    sql: `
      SELECT routine_name, routine_definition
      FROM information_schema.routines
      WHERE routine_type = 'FUNCTION'
      AND routine_schema = 'public'
      AND (routine_name ILIKE '%request_number%' OR routine_name ILIKE '%ptsp%')
      ORDER BY routine_name;
    `,
  });
  if (fErr) {
    console.log("Error:", fErr.message);
  } else {
    console.log("Functions:", JSON.stringify(fns, null, 2));
  }

  // 3. Check current data
  console.log("\n=== CURRENT REQUESTS ===");
  const { data: requests } = await supabase
    .from("service_requests")
    .select("id, request_number, created_at")
    .order("created_at", { ascending: false });
  console.log("Current requests:", JSON.stringify(requests, null, 2));
}

main().catch(console.error);
