import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StudentRow {
  [key: string]: string;
}

interface Student {
  id: string;
  name: string;
  cpf: string;
  course: string;
  startDate: string;
  completedSubjects: number;
  totalSubjects: number;
  lastPayment: string;
  lastPaymentValue: number;
  overdueMonths: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  engagementPercentage: number;
  financialStatus: "ok" | "warning" | "overdue";
  phone?: string;
  email?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_SHEETS_API_KEY = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    
    if (!GOOGLE_SHEETS_API_KEY) {
      console.error('GOOGLE_SHEETS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sheet ID from the URL
    const SHEET_ID = '1GdvByvznwciCpZ1QIqln8SbpopEL-L_ePyLcaTM3SQw';
    const SHEET_NAME = 'Base de Alunos'; // Adjust if your sheet has a different name
    const RANGE = 'A:M'; // Columns A through M

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;

    console.log('Fetching data from Google Sheets...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from Google Sheets', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      console.log('No data found in sheet');
      return new Response(
        JSON.stringify({ students: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First row contains headers
    const headers = data.values[0];
    const rows = data.values.slice(1);

    console.log(`Processing ${rows.length} student records`);

    // Map rows to student objects
    const students: Student[] = rows.map((row: string[], index: number) => {
      const rowData: StudentRow = {};
      headers.forEach((header: string, i: number) => {
        rowData[header] = row[i] || '';
      });

      // Calculate engagement percentage
      const completedSubjects = parseInt(rowData['Disciplinas Concluídas']) || 0;
      const totalSubjects = parseInt(rowData['Total de Disciplinas']) || 1;
      const engagementPercentage = Math.round((completedSubjects / totalSubjects) * 100);

      // Calculate overdue months
      const overdueMonths = parseInt(rowData['Meses Vencidos']) || 0;

      // Calculate financial status
      let financialStatus: "ok" | "warning" | "overdue" = "ok";
      if (overdueMonths > 2) financialStatus = "overdue";
      else if (overdueMonths > 0) financialStatus = "warning";

      // Calculate risk score (0-100, higher is better)
      let riskScore = 100;
      
      // Engagement factor (40 points)
      riskScore -= (100 - engagementPercentage) * 0.4;
      
      // Financial factor (40 points)
      if (overdueMonths > 0) {
        riskScore -= Math.min(overdueMonths * 10, 40);
      }
      
      // Time factor (20 points) - check if student is progressing
      const monthsSinceStart = calculateMonthsSince(rowData['Data de Início']);
      const expectedProgress = Math.min((monthsSinceStart / 24) * 100, 100); // 24 months expected
      if (engagementPercentage < expectedProgress - 30) {
        riskScore -= 20;
      } else if (engagementPercentage < expectedProgress - 15) {
        riskScore -= 10;
      }

      riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

      // Determine risk level
      let riskLevel: "low" | "medium" | "high" = "low";
      if (riskScore < 60) riskLevel = "high";
      else if (riskScore < 80) riskLevel = "medium";

      return {
        id: `${index + 1}`,
        name: rowData['Nome do Aluno'] || '',
        cpf: rowData['CPF'] || '',
        course: rowData['Curso'] || '',
        startDate: formatDate(rowData['Data de Início']),
        completedSubjects,
        totalSubjects,
        lastPayment: formatDate(rowData['Último Pagamento']),
        lastPaymentValue: parseFloat(rowData['Último valor pago']) || 0,
        overdueMonths,
        riskScore,
        riskLevel,
        engagementPercentage,
        financialStatus,
        email: rowData['E-mail'],
        phone: rowData['Telefone'],
      };
    });

    console.log(`Successfully processed ${students.length} students`);

    return new Response(
      JSON.stringify({ students }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-students function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions
function formatDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // Try to parse Brazilian date format (DD/MM/YYYY)
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return dateStr;
}

function calculateMonthsSince(dateStr: string): number {
  if (!dateStr) return 0;
  
  const date = new Date(formatDate(dateStr));
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  return diffMonths;
}
