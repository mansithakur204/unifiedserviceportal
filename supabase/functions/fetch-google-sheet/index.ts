import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"' && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(current.trim());
        current = '';
      } else if (ch === '\n' || (ch === '\r' && csv[i + 1] === '\n')) {
        row.push(current.trim());
        if (row.some(c => c !== '')) rows.push(row);
        row = [];
        current = '';
        if (ch === '\r') i++;
      } else {
        current += ch;
      }
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some(c => c !== '')) rows.push(row);
  }
  return rows;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sheetUrl } = await req.json();
    if (!sheetUrl) {
      return new Response(JSON.stringify({ error: 'sheetUrl is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert any Google Sheet URL to CSV export
    let csvUrl = sheetUrl;
    const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      const sheetId = match[1];
      // Try to extract gid if present
      const gidMatch = sheetUrl.match(/gid=(\d+)/);
      const gid = gidMatch ? gidMatch[1] : '0';
      csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }

    const response = await fetch(csvUrl);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch sheet: ${response.status}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) {
      return new Response(JSON.stringify({ schemes: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const colIndex = (name: string) => headers.indexOf(name);

    const schemes = rows.slice(1).map((row, i) => {
      const get = (col: string) => {
        const idx = colIndex(col);
        return idx >= 0 && idx < row.length ? row[idx] : '';
      };

      return {
        id: `gsheet-${i}`,
        scheme_name: get('name') || get('scheme_name') || get('title') || '',
        category: get('category') || 'General',
        type: get('type') || 'Central',
        state: get('state') || 'All India',
        details: get('description') || get('details') || '',
        benefits: get('benefits') || '',
        eligibility: get('eligibility') || '',
        documents: get('documents') || '',
        funding_amount: get('amount') || get('funding_amount') || '',
        application_link: get('applylink') || get('apply_link') || get('application_link') || '',
        helpline: get('helpline') || '',
        icon: get('icon') || 'FileText',
        is_popular: false,
        click_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
        faq: null,
        // Hindi fields - empty by default from sheets
        scheme_name_hi: get('name_hi') || null,
        details_hi: get('description_hi') || null,
        benefits_hi: get('benefits_hi') || null,
        eligibility_hi: get('eligibility_hi') || null,
        documents_hi: get('documents_hi') || null,
        funding_amount_hi: get('amount_hi') || null,
        helpline_hi: get('helpline_hi') || null,
      };
    }).filter(s => s.scheme_name);

    return new Response(JSON.stringify({ schemes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});