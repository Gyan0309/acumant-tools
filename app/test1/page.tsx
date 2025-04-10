import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {DeepResearch} from "@/components/tools/deep-research"
export default function Test1() {
  const superAdminUser = {
    id: "1",
    name: "Super Admin",
    email: "super@acumant.com",
    role: "superAdmin", // Acumant team member with full access
    status: "active",
    organizationId: "acumant",
  }
  const user = superAdminUser
  
  
    return (
      <div>
<DashboardHeader user={user} />
        <h1>Login Page</h1>
        <DeepResearch/>
      </div>
    );
  }