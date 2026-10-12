
/*
 * CampusLink KE — Supabase connection
 * Uses the public publishable key only.
 */

(function () {
  const SUPABASE_URL =
    "https://ojbzbkvruehrntdxktse.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ni_wAGg6BAmSD4Spho5qbQ_Z35xJjrA";

  if (!window.supabase) {
    console.error(
      "CampusLink KE: Supabase library did not load."
    );
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("CampusLink KE: Supabase client initialized.");
})();
