import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviews, reviewRequests } from '@/drizzle/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * GET /api/reviews/[id]
 * Get a single review by ID (Admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const reviewId = parseInt(id);

    const review = await database.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      with: {
        event: true,
        artist: true,
        venue: true,
        reviewer: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ review }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/reviews/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reviews/[id]
 * Soft delete a review (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const reviewId = parseInt(id);

    const [deletedReview] = await database
      .update(reviews)
      .set({
        deletedByAdminId: session.user.id,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(reviews.id, reviewId), isNull(reviews.deletedAt)))
      .returning();

    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Review not found or already deleted' },
        { status: 404 }
      );
    }

    // Update review request status
    await database
      .update(reviewRequests)
      .set({ status: 'deleted', updatedAt: new Date().toISOString() })
      .where(eq(reviewRequests.id, deletedReview.reviewRequestId));

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[DELETE /api/reviews/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
