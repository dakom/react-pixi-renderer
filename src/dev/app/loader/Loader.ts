import { WorldState } from "../world/World";

export const loadAssets = (worldState: WorldState): Promise<WorldState> =>
    new Promise(resolve => {
        new PIXI.loaders.Loader()
            .add("bunny", "static/assets/bunny.png")
            .load(res => {
                const texture = res.resources.bunny.texture;
                resolve(Object.assign({}, worldState, {
                    texture: texture
                }))
            })
    });