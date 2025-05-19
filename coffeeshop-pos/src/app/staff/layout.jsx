import { StaffSidebar } from "@/components/staff-sidebar"

export default function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <StaffSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
