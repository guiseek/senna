import {Octree} from 'three/examples/jsm/Addons.js'
import {Box3, Object3D} from 'three'
import {McLaren} from '../entities'

export class Collision {
  #octree = new Octree()

  track(group: Object3D) {
    return this.#octree.fromGraphNode(group)
  }

  chekOutOfTrack(mcLaren: McLaren) {
    let boundintBox = new Box3().setFromObject(mcLaren.tracked.chassis)
    if (!this.#octree.box) throw `Box does not found`
    let collision = this.#octree.box.intersectsBox(boundintBox)
    if (!collision) {
      mcLaren.model.position.x -= 5
    }
  }
}
