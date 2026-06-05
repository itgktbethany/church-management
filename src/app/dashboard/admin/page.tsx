import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p>
        Welcome {admin.name}
      </p>

      <p>
        Role: {admin.role}
      </p>
    </div>
  );
}