import { DevotionalTable } from "@/components/admin/devotionals/devotional-table";
import { AdminDevotionalsHeader } from "@/components/admin/devotionals/admin-devotionals-header";

export function AdminDevotionalsContent() {
  return (
    <div className="space-y-6">
      <AdminDevotionalsHeader />
      <DevotionalTable />
    </div>
  );
}
