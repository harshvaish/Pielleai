import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database/connection';
import { reviews } from '@/drizzle/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * POST /api/reviews/[id]/mark-inappropriate
 * Mark or unmark a review as inappropriate (Admin only)
 */
export async function POST(
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
    const body = await request.json();
    const { markAsInappropriate } = body; // boolean

    if (typeof markAsInappropriate !== 'boolean') {
      return NextResponse.json(
        { error: 'markAsInappropriate must be a boolean' },
        { status: 400 }
      );
    }

    const [updatedReview] = await database
      .update(reviews)
      .set({
        markedAsInappropriate: markAsInappropriate,
        markedAsInappropriateAt: markAsInappropriate ? new Date().toISOString() : null,
        markedAsInappropriateByAdminId: markAsInappropriate ? session.user.id : null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(reviews.id, reviewId), isNull(reviews.deletedAt)))
      .returning();

    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found or deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: markAsInappropriate
          ? 'Review marked as inappropriate'
          : 'Review unmarked as inappropriate',
        review: updatedReview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/reviews/[id]/mark-inappropriate] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
