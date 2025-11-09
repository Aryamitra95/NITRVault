import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";

export  async function DELETE(
    req: Request,
    {params}: {params: Promise<{channelId: string}>}
) {
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const RequestedParams = await params;
        const channelId = RequestedParams.channelId;

        const serverId = searchParams.get("serverId")

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401});
        }
        if(!serverId){
                return new NextResponse("Server ID missing",{status: 400});
        }

        if(!channelId){
            return new NextResponse("Channel ID missing", {status: 400});
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                            id:channelId,
                            name: {
                                not: "general",
                            }
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE",error);
        return new NextResponse("Internal Error", {status:500})
    }

}
