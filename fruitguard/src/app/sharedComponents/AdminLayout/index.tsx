import AdminSidebar from "../Sidebar/AdminSidebar"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-shrink-0 w-[350px]">
        <AdminSidebar/>
      </div>
        <main>{children}</main>
      </div>
  )
}