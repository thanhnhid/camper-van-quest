import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CustomerCancellationNotificationRequest {
  customerEmail: string;
  customerName: string;
  providerName: string;
  camperName: string;
  startDate: string;
  endDate: string;
  reason: string;
  cancellationFee?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerEmail, 
      customerName, 
      providerName, 
      camperName, 
      startDate, 
      endDate, 
      reason, 
      cancellationFee = 0
    }: CustomerCancellationNotificationRequest = await req.json();

    console.log("Sending customer cancellation notification to:", customerEmail);

    const emailResponse = await resend.emails.send({
      from: "CamperRental <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Ihre Buchung wurde storniert - ${camperName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e11d48; margin-bottom: 20px;">Buchung wurde storniert</h1>
          
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin-top: 0;">Stornierungsdetails</h2>
            <p><strong>Fahrzeug:</strong> ${camperName}</p>
            <p><strong>Anbieter:</strong> ${providerName}</p>
            <p><strong>Buchungszeitraum:</strong> ${new Date(startDate).toLocaleDateString('de-DE')} - ${new Date(endDate).toLocaleDateString('de-DE')}</p>
            ${cancellationFee > 0 ? `<p><strong>Stornogebühr:</strong> ${cancellationFee}€</p>` : ''}
          </div>

          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Grund der Stornierung:</h3>
            <p style="font-style: italic; color: #374151;">"${reason}"</p>
          </div>

          <p>Liebe/r ${customerName},</p>
          
          <p>leider müssen wir Ihnen mitteilen, dass Ihre Buchung für das oben genannte Fahrzeug vom Anbieter storniert wurde.</p>
          
          <p>Wir entschuldigen uns für die Unannehmlichkeiten und bitten um Ihr Verständnis. Falls bereits eine Zahlung erfolgt ist, wird diese selbstverständlich vollständig zurückerstattet.</p>
          
          ${cancellationFee > 0 
            ? `<p style="color: #dc2626;"><strong>Hinweis:</strong> Es fällt eine Stornogebühr in Höhe von ${cancellationFee}€ an, die vom Rückerstattungsbetrag abgezogen wird.</p>` 
            : '<p style="color: #059669;"><strong>Gute Nachricht:</strong> Es fallen keine Stornogebühren für Sie an.</p>'
          }
          
          <p>Gerne können Sie in unserem Portal nach alternativen Fahrzeugen suchen oder sich bei Fragen an uns wenden.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Mit freundlichen Grüßen,<br>Ihr CamperRental Team</p>
            <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          </div>
        </div>
      `,
    });

    console.log("Customer cancellation notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-customer-cancellation-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);