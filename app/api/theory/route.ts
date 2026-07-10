// app/api/theory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTheories, createTheory, updateTheory, deleteTheory } from '@/lib/db';

// GET - отримати всі теорії
export async function GET() {
  try {
    const theories = await getTheories();
    return NextResponse.json(theories);
  } catch (error) {
    console.error('GET /api/theory error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theories' },
      { status: 500 }
    );
  }
}

// POST - створити нову теорію
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, match, date, questions } = body;

    if (!title || !match || !date || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTheory = await createTheory({ title, match, date, questions });
    
    if (!newTheory) {
      return NextResponse.json(
        { error: 'Failed to create theory' },
        { status: 500 }
      );
    }

    return NextResponse.json(newTheory);
  } catch (error) {
    console.error('POST /api/theory error:', error);
    return NextResponse.json(
      { error: 'Failed to create theory' },
      { status: 500 }
    );
  }
}

// PUT - оновити теорію
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedTheory = await updateTheory(id, body);

    if (!updatedTheory) {
      return NextResponse.json(
        { error: 'Theory not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTheory);
  } catch (error) {
    console.error('PUT /api/theory error:', error);
    return NextResponse.json(
      { error: 'Failed to update theory' },
      { status: 500 }
    );
  }
}

// DELETE - видалити теорію
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    const success = await deleteTheory(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Theory not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/theory error:', error);
    return NextResponse.json(
      { error: 'Failed to delete theory' },
      { status: 500 }
    );
  }
}