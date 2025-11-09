"use client";
import { UserButton } from '@clerk/nextjs'

import React from 'react'

const NavigationUser = () => {
  return (
    <div>
        <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements: {
                        avatarBox: "h-[48px] w-[48px]"
                    }
                }}
            />
    </div>
  )
}


export default NavigationUser;