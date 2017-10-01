import * as React from 'react';

import { loadAssets } from '../loader/Loader';
import { updateBunnies } from './bunnies/Bunnies-Updater';
import { WorldState } from './World-State';

export const WorldUpdater = (worldState: WorldState): Promise<WorldState> =>
    (!worldState.texture)
        ? loadAssets(worldState)
        : new Promise<WorldState>(resolve => {
            resolve(Object.assign({}, worldState, {
                bunnies: updateBunnies(worldState),
            }))
        })