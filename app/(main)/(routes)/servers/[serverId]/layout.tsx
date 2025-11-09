import { ServerSidebar } from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

const ServerIdLayout= async ({
    children,
    params,
}:{
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}) => {
    const resolvedParams = await params;
    const serverId = resolvedParams.serverId;
    const profile = await currentProfile();
    if (!profile) {
        return redirect("/sign-in");
    }
    const server = await db.server.findFirst({
        where: {
            id: serverId,
            members:{
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) {
        return redirect("/");
    }
  return (
    <div className='h-full'>
        <div className='sm:hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed'>
            <ServerSidebar serverId={serverId} />
        </div>
        <main className="flex-1 h-full md:pl-60">
        {children}
        </main>
    </div>
  )
}

export default ServerIdLayout;