import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  customerEmail: string;
  customerName: string;
  camperName: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'rejected';
  providerName?: string;
  providerEmail?: string;
  totalPrice?: number;
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
      camperName, 
      startDate, 
      endDate, 
      status,
      providerName,
      providerEmail,
      totalPrice
    }: BookingNotificationRequest = await req.json();

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    let subject: string;
    let html: string;

    if (status === 'confirmed') {
      subject = `🎉 Ihre Buchung für "${camperName}" wurde bestätigt!`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Buchung bestätigt!</h1>
          <p>Liebe/r ${customerName},</p>
          
          <p>Großartige Neuigkeiten! Ihre Buchung wurde bestätigt:</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">Buchungsdetails</h3>
            <p><strong>Wohnmobil:</strong> ${camperName}</p>
            <p><strong>Anreise:</strong> ${formatDate(startDate)}</p>
            <p><strong>Abreise:</strong> ${formatDate(endDate)}</p>
            ${totalPrice ? `<p><strong>Gesamtpreis:</strong> ${totalPrice}€</p>` : ''}
          </div>
          
          ${providerName && providerEmail ? `
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4b5563; margin-top: 0;">Vermieter Kontakt</h3>
            <p><strong>Name:</strong> ${providerName}</p>
            <p><strong>E-Mail:</strong> ${providerEmail}</p>
            <p style="font-size: 14px; color: #6b7280;">
              Sie können sich direkt mit dem Vermieter in Verbindung setzen, um Details zur Übergabe zu besprechen.
            </p>
          </div>
          ` : ''}
          
          <p>Wir wünschen Ihnen eine fantastische Reise!</p>
          
          <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          
          <p>Beste Grüße,<br>Ihr Wohnmobil-Team</p>
        </div>
      `;
    } else {
      subject = `❌ Ihre Buchungsanfrage für "${camperName}" wurde abgelehnt`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Buchung abgelehnt</h1>
          <p>Liebe/r ${customerName},</p>
          
          <p>Leider müssen wir Ihnen mitteilen, dass Ihre Buchungsanfrage abgelehnt wurde:</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Abgelehnte Buchung</h3>
            <p><strong>Wohnmobil:</strong> ${camperName}</p>
            <p><strong>Gewünschte Anreise:</strong> ${formatDate(startDate)}</p>
            <p><strong>Gewünschte Abreise:</strong> ${formatDate(endDate)}</p>
          </div>
          
          <p>Das kann verschiedene Gründe haben:</p>
          <ul>
            <li>Das Wohnmobil ist für den gewünschten Zeitraum bereits vergeben</li>
            <li>Wartungsarbeiten sind geplant</li>
            <li>Andere organisatorische Gründe</li>
          </ul>
          
          <p>Aber keine Sorge! Schauen Sie sich gerne unsere anderen verfügbaren Wohnmobile an oder versuchen Sie es mit alternativen Terminen.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get("SITE_URL") || "https://your-site.com"}/campers" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Andere Wohnmobile entdecken
            </a>
          </div>
          
          <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          
          <p>Beste Grüße,<br>Ihr Wohnmobil-Team</p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Wohnmobil Buchungen <onboarding@resend.dev>",
      to: [customerEmail],
      subject: subject,
      html: html,
    });

    console.log("Booking notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
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