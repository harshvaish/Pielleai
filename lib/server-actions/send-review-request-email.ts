'use server';

import sgMail from '@sendgrid/mail';
import { ServerActionResponse } from '../types';
import { AppError } from '../classes/AppError';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface ReviewRequestEmailData {
  recipientEmail: string;
  reviewToken: string;
  reviewType: 'artist_reviews_venue' | 'venue_reviews_artist';
  event: any; // Event with artist and venue data
}

export const sendReviewRequestEmail = async (
  recipientEmail: string,
  reviewToken: string,
  reviewType: 'artist_reviews_venue' | 'venue_reviews_artist',
  event: any
): Promise<ServerActionResponse<null>> => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new AppError('Configurazione errata del server: Chiave API SendGrid mancante.');
    }

    // Initialize SendGrid API
    sgMail.setApiKey(apiKey);

    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/recensione/${reviewToken}`;

    // Determine subject and content based on review type
    const isArtistReviewingVenue = reviewType === 'artist_reviews_venue';
    
    const subject = isArtistReviewingVenue
      ? `Recensione Locale - ${event.venue?.name || 'Evento'}`
      : `Recensione Artista - ${event.artist?.name || 'Evento'}`;

    const entityName = isArtistReviewingVenue
      ? event.venue?.name || 'il locale'
      : event.artist?.name || "l'artista";

    // Format event date
    const eventDate = event.endedAt 
      ? format(new Date(event.endedAt), "dd MMMM yyyy", { locale: it })
      : 'recente';

    // Construct email message
    // Note: You'll need to create a SendGrid template or use a simple HTML template
    const msg = {
      to: recipientEmail,
      from: 'info@eaglebooking.it',
      subject: subject,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
              .button { 
                display: inline-block; 
                padding: 12px 30px; 
                background-color: #007bff; 
                color: #ffffff !important; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0;
                font-weight: bold;
              }
              .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Richiesta di Recensione</h2>
              </div>
              <div class="content">
                <p>Gentile utente,</p>
                
                <p>L'evento con <strong>${entityName}</strong> del <strong>${eventDate}</strong> si è concluso.</p>
                
                <p>Ci piacerebbe conoscere la tua opinione sulla collaborazione. 
                La tua recensione è riservata e visibile solo agli amministratori della piattaforma 
                per migliorare la qualità del servizio.</p>
                
                <p style="text-align: center;">
                  <a href="${reviewUrl}" class="button">Lascia la tua recensione</a>
                </p>
                
                <p><strong>Cosa valuterai:</strong></p>
                <ul>
                  ${
                    isArtistReviewingVenue
                      ? `
                  <li>Ospitalità</li>
                  <li>Qualità tecnica del locale</li>
                  <li>Rispetto degli accordi</li>
                  <li>Trattamento da parte dello staff</li>
                  <li>Qualità organizzativa generale</li>
                  `
                      : `
                  <li>Puntualità</li>
                  <li>Professionalità</li>
                  <li>Coinvolgimento del pubblico</li>
                  <li>Rispetto della scaletta</li>
                  <li>Gestione logistica</li>
                  `
                  }
                </ul>
                
                <p>Potrai anche lasciare un commento opzionale (max 300 caratteri).</p>
                
                <p><small>Nota: Questa recensione può essere inviata una sola volta e non potrà essere modificata successivamente.</small></p>
              </div>
              <div class="footer">
                <p>Questo messaggio è stato inviato automaticamente. Per assistenza, contatta info@eaglebooking.it</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send email
    await sgMail.send(msg);

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[sendReviewRequestEmail] Error:', error);
    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Errore durante l\'invio dell\'email.',
      data: null,
    };
  }
};
