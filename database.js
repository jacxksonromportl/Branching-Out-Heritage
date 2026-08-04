/*
======================================================
Branching Out Heritage v2
Supabase Database Connection
======================================================
*/


import { createClient } from 
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


// Your Supabase project URL

const supabaseUrl = 
"https://pbfuquhyavmmzbtiopwn.supabase.co";


// Your Supabase anon public key

const supabaseKey = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZnVxdWh5YXZtbXpidGlvcHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3OTQ4OTcsImV4cCI6MjEwMTM3MDg5N30.VUHYKljZeupqOotjM1LRfSLc5HsQeGiqQcLbyYtt0BM";


// Create database connection

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);