import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: Promise<{ serverId: string }> }) {
  try {
    const params = await context.params; // 👈 unwrap the promise
    const profile = await currentProfile();
    // const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params?.serverId) {
      console.error("❌ Missing serverId in params");
      return new NextResponse("Server ID missing", { status: 400 });
    }

    console.log("✅ Updating server:", params.serverId);

    const server = await db.server.delete({
      where: {
        id: params.serverId, // must be unique
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ serverId: string }> }) {
  try {
    const params = await context.params; // 👈 unwrap the promise
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params?.serverId) {
      console.error("❌ Missing serverId in params");
      return new NextResponse("Server ID missing", { status: 400 });
    }

    console.log("✅ Updating server:", params.serverId);

    const server = await db.server.update({
      where: {
        id: params.serverId, // must be unique
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
