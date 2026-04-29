import { NextResponse } from 'next/server';
import { z } from 'zod';

import { errorResponse } from '@/lib/api-utils';
import logger from '@/lib/logger';

const reminderSchema = z
  .object({
    eventId: z.string().min(1, 'Event ID is required'),
    userEmail: z.string().email('Invalid email address').optional(),
    userPhone: z.string().optional(),
    message: z
      .string()
      .min(1, 'Message is required')
      .default('Reminder for your upcoming election event!'),
  })
  .refine((data) => data.userEmail || data.userPhone, {
    message: 'At least one of userEmail or userPhone must be provided',
  });

/**
 * A notification service that can be triggered by a Cloud Scheduler
 * or a background task. Integrates with SendGrid for Email and Twilio for SMS.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, userEmail, userPhone, message } = reminderSchema.parse(body);

    logger.info({ eventId, userEmail, userPhone }, '[Notifications] Processing election reminder');

    const promises = [];

    // 1. SendGrid Email Integration
    if (userEmail && process.env.SENDGRID_API_KEY) {
      promises.push(
        fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: userEmail }] }],
            from: { email: 'noreply@electionassistant.app' },
            subject: 'Election Assistant Reminder',
            content: [{ type: 'text/plain', value: message }],
          }),
        }).then((res) => {
          if (!res.ok) throw new Error(`SendGrid API error: ${res.statusText}`);
          return res;
        })
      );
    }

    // 2. Twilio SMS Integration
    if (userPhone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
      const encodedBody = new URLSearchParams({
        To: userPhone,
        From: process.env.TWILIO_PHONE_NUMBER || '',
        Body: message,
      });

      promises.push(
        fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: encodedBody.toString(),
        }).then((res) => {
          if (!res.ok) throw new Error(`Twilio API error: ${res.statusText}`);
          return res;
        })
      );
    }

    if (promises.length === 0) {
      logger.warn('No notification providers configured or targeted.');
      return NextResponse.json({
        success: true,
        message: 'Simulated reminder (No providers triggered)',
      });
    }

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      message: 'Reminder notifications dispatched successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    logger.error({ err: error }, 'Notification Error');
    return errorResponse(error);
  }
}
