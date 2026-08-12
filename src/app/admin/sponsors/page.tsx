import { sponsors } from "@/lib/data";
import { AdminSponsorsClient } from "@/components/admin/sponsors-list";

export const dynamic = "force-dynamic";

export default function AdminSponsorsPage() {
  return <AdminSponsorsClient sponsors={sponsors} />;
}
