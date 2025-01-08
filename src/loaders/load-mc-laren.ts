import {Engine, McLaren} from '../entities'
import {createProgress} from '../factories'
import {World} from 'cannon-es'
import {Loader} from '../core'

export const loadMcLaren = async (world: World, engine: Engine) => {
  const loader = Loader.getInstance()

  return loader.gltf
    .loadAsync('mc-laren.glb', createProgress('McLaren'))
    .then((gltf) => new McLaren(gltf.scene, world, engine))
}
