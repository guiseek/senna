import {McLaren, McLarenSoundMap} from '../entities'
import {createProgress} from '../factories'
import {World} from 'cannon-es'
import {Loader} from '../core'

export const loadMcLaren = async (world: World, sound: McLarenSoundMap) => {
  const loader = Loader.getInstance()

  return loader.gltf
    .loadAsync('mc-laren.glb', createProgress('McLaren'))
    .then((gltf) => new McLaren(gltf.scene, world, sound))
}
