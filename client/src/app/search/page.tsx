
// import Link from "next/link";
// import { timKiemNguoiDungVaBaiViet } from "@/actions/search.action"; // chỉnh đường dẫn đúng

// export default async function SearchPage({ searchParams }: { searchParams: { query?: string } }) {
//   const query = searchParams.query || '';
//   const { users = [], posts = [] } = await timKiemNguoiDungVaBaiViet(query);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-4">Kết quả tìm kiếm cho: "{query}"</h1>

//       {users.length === 0 && posts.length === 0 ? (
//         <p className="text-gray-500">Không tìm thấy kết quả.</p>
//       ) : (
//         <>
//           {users.length > 0 && (
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Người dùng</h2>
//               <div className="space-y-4">
//                 {users.map((user) => (
//                   <Link
//                     key={user.id}
//                     href={`/hoso/${user.username}`}
//                     className="flex items-center p-4 border rounded-lg hover:bg-gray-100"
//                   >
//                     <span className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mr-4">
//                       {user.ten ? user.ten[0] : user.username[0]}
//                     </span>
//                     <div>
//                       <p className="text-lg font-medium">{user.ten || user.username}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                       {user.ngaytao && (
//                         <p className="text-xs text-gray-400">
//                           Tham gia: {new Date(user.ngaytao).toLocaleDateString('vi-VN')}
//                         </p>
//                       )}
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}

//           {posts.length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Bài đăng</h2>
//               <div className="space-y-4">
//                 {posts.map((post) => (
//                   <Link
//                     key={post.id}
//                     href={`/baiviet/${post.id}`}
//                     className="block p-4 border rounded-lg hover:bg-gray-100"
//                   >
//                     <p className="text-gray-700 whitespace-pre-wrap">{post.noidung || '(Không có nội dung)'}</p>
//                     <p className="text-xs text-gray-400 mt-2">
//                       Ngày tạo: {new Date(post.ngaytao).toLocaleDateString('vi-VN')}
//                     </p>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
