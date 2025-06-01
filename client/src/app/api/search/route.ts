// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get('query') || '';

//   try {
//     // Tìm người dùng theo tên hoặc username (không dùng mode)
//     const users = await prisma.user.findMany({
//       where: {
//         OR: [
//           { ten: { contains: query } },
//           { username: { contains: query } },
//         ],
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         ten: true,
//         ngaytao: true,
//       },
//     });

//     // Tìm bài viết theo nội dung noidung (không dùng mode)
//     const posts = await prisma.baiviet.findMany({
//       where: {
//         noidung: {
//           contains: query,
//         },
//       },
//       select: {
//         id: true,
//         noidung: true,
//         tacgiaID: true,
//         ngaytao: true,
//       },
//       orderBy: {
//         ngaytao: 'desc',
//       },
//       take: 20,
//     });

//     return NextResponse.json({ users, posts });
//   } catch (error) {
//     console.error('Error searching users and posts:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
