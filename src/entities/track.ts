import {getByName, meshToBody} from '../utils'
import {Material, World} from 'cannon-es'
import {ObjectModel} from '../interfaces'
import {Group, Mesh} from 'three'

export class Track implements ObjectModel {
  #model: Group

  get model() {
    return this.#model
  }

  constructor(scene: Group, private world: World) {
    this.#model = scene

    this.#model.position.z = -10
    // const asphalt = getByName<Group>(this.model, 'Asphalt')
    const asphalt = getByName<Group>(this.model, 'Track')

    const material = new Material('track')

    const meshes = asphalt.children.filter((c) => c instanceof Mesh)

    for (const mesh of meshes) {
      this.world.addBody(meshToBody(mesh, {mass: 0, material}))
    }

    console.log(this.model.position);
    
  }
}
