import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviewRequests } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { sendReviewRequestEmail } from '@/lib/server-actions/send-review-request-email';

/**
 * POST /api/reviews/resend-email/[requestId]
 * Resend review request email (Admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId } = await params;
    const reviewRequestId = parseInt(requestId);

    const reviewRequest = await database.query.reviewRequests.findFirst({
      where: eq(reviewRequests.id, reviewRequestId),
      with: {
        event: {
          with: {
            artist: true,
            venue: true,
          },
        },
      },
    });

    if (!reviewRequest) {
      return NextResponse.json(
        { error: 'Review request not found' },
        { status: 404 }
      );
    }

    // Send email
    const result = await sendReviewRequestEmail(
      reviewRequest.recipientEmail,
      reviewRequest.reviewToken,
      reviewRequest.reviewType,
      reviewRequest.event
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update review request
    await database
      .update(reviewRequests)
      .set({
        emailResendCount: (reviewRequest.emailResendCount || 0) + 1,
        lastEmailResendAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(reviewRequests.id, reviewRequestId));

    return NextResponse.json(
      { message: 'Review request email resent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/reviews/resend-email/[requestId]] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
