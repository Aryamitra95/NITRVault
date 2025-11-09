import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ memberId: string }>}
){
    try{
        const { memberId } = await params;
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400});
        }

        if(!memberId){
            return new NextResponse("Member ID missing", { status: 400});
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data:{
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    } ,
                    orderBy: {
                        role: "asc",
                    }
                }
            }
        })
        return NextResponse.json(server);
    }catch(error) {
        console.log("[MEMBER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> } // 👈 params is now a Promise
) {
  try {
    const { memberId } = await params; // ✅ unwrap it
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // ensure only server owner can change roles
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id, // prevent updating your own role
              },
            },
            data: { role },
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: "asc" },
        },
      },
    });

    return NextResponse.json(server); // ✅ always return something
  } catch (error) {
    console.error("MEMBERS_PATCH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
