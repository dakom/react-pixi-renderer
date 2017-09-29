import * as React from 'react';

import { IoDynamics } from '../io/Io';
import { loadAssets } from '../loader/Loader';
import { updateBunnies } from './bunnies/Bunnies-Updater';
import { WorldState } from './World-State';

const _updateWorld = (ioDynamics:IoDynamics) => (worldState:WorldState):WorldState => 
    Object.assign({}, worldState, {
        bunnies: updateBunnies (ioDynamics) (worldState),
        deltaTime: ioDynamics.deltaTime
    });

export const WorldUpdater = (ioDynamics:IoDynamics) => (worldState:WorldState):Promise<WorldState> =>
    (!worldState.texture) 
        ?   loadAssets(worldState)
        :   new Promise<WorldState>(resolve => {
                resolve(_updateWorld(ioDynamics) (worldState));
            })