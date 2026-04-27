import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Run with --env-file=.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking for triggers on service_requests...");

  // Try to find the trigger function code
  const { data: triggers, error: tErr } = await supabase.rpc("exec_sql", {
    sql: `
      SELECT 
        trg.tgname AS trigger_name,
        proc.proname AS function_name,
        proc.prosrc AS function_source
      FROM pg_trigger trg
      JOIN pg_proc proc ON trg.tgfoid = proc.oid
      JOIN pg_class cls ON trg.tgrelid = cls.oid
      WHERE cls.relname = 'service_requests';
    `,
  });

  if (tErr) {
    console.error("Error fetching triggers via exec_sql:", tErr.message);
  } else {
    console.log("Triggers found:", JSON.stringify(triggers, null, 2));
  }

  console.log("\nChecking service_requests column defaults...");
  const { data: columns, error: cErr } = await supabase.rpc("exec_sql", {
    sql: `
      SELECT column_name, column_default, data_type
      FROM information_schema.columns
      WHERE table_name = 'service_requests'
      AND column_name = 'request_number';
    `,
  });

  if (cErr) {
    console.error("Error fetching column info:", cErr.message);
  } else {
    console.log("Column info:", JSON.stringify(columns, null, 2));
  }
}

main();
