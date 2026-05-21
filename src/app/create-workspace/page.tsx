import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";

export default function CreateWorkspacePage() {
  return (
    <AppShell
      title="Create Workspace"
      description="Private workspace creation will be protected by PROFILE_CREATION_CODE and will auto-login after successful setup."
    >
      <RouteCard
        eyebrow="/create-workspace"
        title="Workspace Provisioning"
        description="The database and environment placeholders are now in place so we can implement hashing, creation code validation, and the initial profile redirect next."
      />
    </AppShell>
  );
}
