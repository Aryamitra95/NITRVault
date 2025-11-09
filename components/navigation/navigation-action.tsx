
import { Plus } from 'lucide-react';
import React from 'react'
import ActionTooltip from '../action-tooltip';
import { useModal } from '@/hooks/use-modal-store';
import NavigationButton from './navigation-button';

const NavigationAction = () => {
  return (
    <div>
        <ActionTooltip
            side="right"
            align="center"
            label="Add a server"
        >
        <NavigationButton/>
        </ActionTooltip>
    </div>
  )
}

export default NavigationAction;