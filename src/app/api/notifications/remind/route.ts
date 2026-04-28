import { NextResponse } from 'next/server';

/**
 * A notification service that can be triggered by a Cloud Scheduler
 * or a background task. Designed to be compatible with Google Cloud Functions.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    // Simple secret validation (In production, use GCP IAM or a Secret Manager)
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, userEmail } = await req.json();

    console.log(`[Cloud Function Mock] Sending election reminder for ${eventId} to ${userEmail}`);

    // Here you would integrate with SendGrid or Google Cloud Pub/Sub
    return NextResponse.json({
      success: true,
      message: 'Reminder notification queued successfully',
    });
  } catch (error) {
    console.error('Notification Service Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
