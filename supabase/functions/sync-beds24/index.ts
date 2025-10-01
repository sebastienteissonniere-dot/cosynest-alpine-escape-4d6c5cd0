import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const beds24ApiKey = Deno.env.get('BEDS24_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Beds24 synchronization...');

    // Update sync status to running
    await supabase
      .from('sync_status')
      .upsert({
        service: 'beds24',
        status: 'running',
        last_sync_at: new Date().toISOString(),
      });

    // Log sync start
    const { data: logData } = await supabase
      .from('sync_logs')
      .insert({
        sync_type: 'beds24',
        status: 'running',
        message: 'Starting Beds24 sync',
      })
      .select()
      .single();

    const syncLogId = logData?.id;

    // Fetch bookings from Beds24 API
    // Beds24 API endpoint for getting bookings
    const beds24Url = `https://beds24.com/api/json/getBookings`;
    
    const response = await fetch(beds24Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authentication: {
          apiKey: beds24ApiKey,
        },
        // Get bookings from last 30 days to future
        arrivalFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }),
    });

    if (!response.ok) {
      throw new Error(`Beds24 API error: ${response.status} ${response.statusText}`);
    }

    const bookingsData = await response.json();
    console.log(`Fetched ${bookingsData.length || 0} bookings from Beds24`);

    let syncedCount = 0;
    let errorCount = 0;

    // Process each booking
    for (const booking of bookingsData) {
      try {
        const reservationData = {
          channel_booking_id: booking.bookId.toString(),
          channel_property_id: booking.propId?.toString() || null,
          property_id: booking.roomId?.toString() || '1',
          guest_name: `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'Guest',
          guest_email: booking.email || null,
          guest_phone: booking.phone || null,
          check_in: booking.arrival,
          check_out: booking.departure,
          number_of_guests: parseInt(booking.numAdult || '1') + parseInt(booking.numChild || '0'),
          total_amount: parseFloat(booking.price || '0'),
          currency: booking.currency || 'EUR',
          status: booking.status === '1' ? 'confirmed' : 'pending',
          source: 'beds24',
          notes: booking.notes || null,
        };

        // Upsert reservation (update if exists, insert if not)
        const { error } = await supabase
          .from('reservations')
          .upsert(reservationData, {
            onConflict: 'channel_booking_id',
          });

        if (error) {
          console.error(`Error syncing booking ${booking.bookId}:`, error);
          errorCount++;
        } else {
          syncedCount++;
        }
      } catch (error) {
        console.error(`Error processing booking ${booking.bookId}:`, error);
        errorCount++;
      }
    }

    // Update sync status to idle
    await supabase
      .from('sync_status')
      .update({
        status: 'idle',
        next_sync_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Next sync in 15 minutes
      })
      .eq('service', 'beds24');

    // Update sync log
    if (syncLogId) {
      await supabase
        .from('sync_logs')
        .update({
          status: errorCount === 0 ? 'completed' : 'completed_with_errors',
          message: `Synced ${syncedCount} bookings, ${errorCount} errors`,
          completed_at: new Date().toISOString(),
          details: {
            synced: syncedCount,
            errors: errorCount,
            total: bookingsData.length || 0,
          },
        })
        .eq('id', syncLogId);
    }

    console.log(`Sync completed: ${syncedCount} synced, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        synced: syncedCount,
        errors: errorCount,
        total: bookingsData.length || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Try to update sync status and log
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from('sync_status')
        .update({ status: 'error' })
        .eq('service', 'beds24');

      await supabase
        .from('sync_logs')
        .insert({
          sync_type: 'beds24',
          status: 'failed',
          message: 'Sync failed',
          error: errorMessage,
          completed_at: new Date().toISOString(),
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
