import { request } from "http";
import { NextRequest, NextResponse } from "next/server";
import schema from '../schema'
import { prisma } from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: {params: { id: string } }) {
    if (parseInt(params.id) > 10) {
      return NextResponse.json({ error: 'User not found'}, { status: 404 })
    }
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id)
      }
    })
    return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: {params: { id: string } }) {
  const body = await request.json();
  const validation = schema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 })
  }
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(params.id)
    }
  })

  if (!user) {
    return NextResponse.json({
      error: 'User not found'
    }, { status: 404 })
  }

  const UpdatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name,
      email: body.email
    }
  })

  return NextResponse.json(UpdatedUser)
}

export async function DELETE(
  request: NextRequest,
  { params }: {params: { id: string } }
) {
  const user = prisma.user.findUnique({
    where: {
      id: parseInt(params.id)
    }
  })

  if(!user) {
    return NextResponse.json({
      error: 'User not found'
    }, { status: 404 })
  }

  await prisma.user.delete({
    where: {
      id: parseInt(params.id)
    }
  })

  return NextResponse.json({})
}
