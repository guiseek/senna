import {PerspectiveCamera, Vector3Like} from 'three'
import {inner} from '../utils/inner'

export class Camera extends PerspectiveCamera {
  constructor(
    fov = 45,
    near = 0.1,
    far = 10000,
    {x, y, z}: Vector3Like = {x: 0, y: 1, z: -4}
  ) {
    super(fov, inner.ratio, near, far)
    this.position.set(x, y, z)
  }
}
