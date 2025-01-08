import {createProgress} from '../factories'
import {Track} from '../entities'
import {Loader} from '../core'

export const loadTrack = async () => {
  const loader = Loader.getInstance()

  return loader.gltf
    .loadAsync('track2.glb', createProgress('Track'))
    .then((gltf) => new Track(gltf.scene))
}
