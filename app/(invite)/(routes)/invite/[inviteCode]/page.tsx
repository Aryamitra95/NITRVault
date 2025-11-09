import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: Promise<{ inviteCode: string }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  // ✅ unwrap params (Next.js 15+ passes as a Promise)
  const { inviteCode } = await params;

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  if (!inviteCode) {
    return redirect("/");
  }

  // ✅ Check if the server exists by invite code
  const server = await db.server.findUnique({
    where: { inviteCode },
  });

  if (!server) {
    console.error("❌ No server found for invite code:", inviteCode);
    return redirect("/");
  }

  // ✅ Check if already a member
  const existingMember = await db.member.findFirst({
    where: {
      serverId: server.id,
      profileId: profile.id,
    },
  });

  if (existingMember) {
    return redirect(`/servers/${server.id}`);
  }

  // ✅ Add as new member
  await db.member.create({
    data: {
      serverId: server.id,
      profileId: profile.id,
    },
  });

  return redirect(`/servers/${server.id}`);
};

export default InviteCodePage;

