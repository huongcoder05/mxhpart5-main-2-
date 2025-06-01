// "use server";

// import prisma from "@/lib/prisma";

// export async function timKiemNguoiDungVaBaiViet(query: string) {
//   try {
//     // Nếu query rỗng thì trả về mảng rỗng
//     if (!query.trim()) return { users: [], posts: [] };

//     // Tìm người dùng theo tên hoặc username
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

//     // Tìm bài viết theo nội dung
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

//     return { users, posts };
//   } catch (error) {
//     console.error("Lỗi khi tìm kiếm người dùng và bài viết:", error);
//     throw new Error("Không thể thực hiện tìm kiếm.");
//   }
// }
