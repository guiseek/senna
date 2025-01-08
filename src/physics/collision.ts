import {Octree} from 'three/examples/jsm/Addons.js'
import {Box3, Object3D} from 'three'
import {McLaren} from '../entities'

export class Collision {
  #octree = new Octree()

  track(group: Object3D) {
    return this.#octree.fromGraphNode(group)
  }

  chekOutOfTrack(mcLaren: McLaren) {
    if (!this.#octree.box) throw `Box does not found`

    let boundintFrontLeft = new Box3().setFromObject(mcLaren.tracked.frontLeft)
    let boundintFrontRight = new Box3().setFromObject(mcLaren.tracked.frontRight)

    if (!this.#octree.box.intersectsBox(boundintFrontLeft)) {
      mcLaren.applyLimboRotation(
        mcLaren.frontLeftRotation,
        (mcLaren.frontLeftRotationAngle += 0.0001)
      )
    } else if (!this.#octree.box.intersectsBox(boundintFrontRight)) {
      mcLaren.applyLimboRotation(
        mcLaren.frontRightRotation,
        (mcLaren.frontRightRotationAngle -= 0.0001)
      )
    }
  }
}
