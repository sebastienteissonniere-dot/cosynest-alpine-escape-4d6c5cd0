import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Holiday {
  zone: string;
  start_date: string;
  end_date: string;
  description: string;
  holiday_type: string;
  academic_year: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching school holidays from data.gouv.fr...');

    // Fetch from data.gouv.fr API
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    const response = await fetch(
      `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?limit=100&refine=annee_scolaire:"${currentYear}-${nextYear}"`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.results?.length || 0} holiday records`);

    const holidays: Holiday[] = [];

    // Process the data
    for (const record of data.results || []) {
      const zones = record.zones ? record.zones.split(',').map((z: string) => z.trim()) : ['Toutes'];
      
      for (const zone of zones) {
        // Determine holiday type (été for summer, else hiver/printemps/toussaint)
        let holidayType = 'vacances';
        const description = record.description?.toLowerCase() || '';
        
        if (description.includes('été') || description.includes('ete')) {
          holidayType = 'ete';
        } else if (description.includes('noël') || description.includes('noel')) {
          holidayType = 'noel';
        } else if (description.includes('hiver')) {
          holidayType = 'hiver';
        } else if (description.includes('printemps') || description.includes('pâques')) {
          holidayType = 'printemps';
        } else if (description.includes('toussaint')) {
          holidayType = 'toussaint';
        }

        holidays.push({
          zone: zone,
          start_date: record.start_date || record.date,
          end_date: record.end_date || record.date,
          description: record.description || 'Vacances scolaires',
          holiday_type: holidayType,
          academic_year: record.annee_scolaire || `${currentYear}-${nextYear}`,
        });
      }
    }

    console.log(`Processed ${holidays.length} holiday entries`);

    // Delete existing holidays for this academic year
    const { error: deleteError } = await supabaseClient
      .from('school_holidays')
      .delete()
      .eq('academic_year', `${currentYear}-${nextYear}`);

    if (deleteError) {
      console.error('Error deleting old holidays:', deleteError);
      throw deleteError;
    }

    // Insert new holidays
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('school_holidays')
      .insert(holidays);

    if (insertError) {
      console.error('Error inserting holidays:', insertError);
      throw insertError;
    }

    console.log('Successfully synced school holidays');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${holidays.length} holidays`,
        count: holidays.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error syncing school holidays:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});