import {createProgress} from '../factories'
import {Track} from '../entities'
import {Loader} from '../core'
import { World } from 'cannon-es'

export const loadTrack = async (world: World) => {
  const loader = Loader.getInstance()

  return loader.gltf
    .loadAsync('track2.glb', createProgress('Track'))
    .then((gltf) => new Track(gltf.scene, world))
}
