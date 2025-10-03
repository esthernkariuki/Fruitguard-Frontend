import AgrovetSidebar from "../Sidebar/AgrovetSidebar"
export default function AgrovetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-shrink-0 w-[350px]">
        <AgrovetSidebar/>
      </div>
        <main className="flex-1">{children}</main>
    </div>
  )
}