import {ObjectModel} from '../interfaces'
import {getByName} from '../utils'
import {Group} from 'three'

export class Track implements ObjectModel {
  #model: Group

  get model() {
    return this.#model
  }

  asphalt: Group

  constructor(scene: Group) {
    this.#model = scene


    this.#model.position.z = -10

    this.asphalt = getByName<Group>(this.model, 'Track')
    console.log(this.model);
    
    // const material = new Material('track')

    // const meshes = this.asphalt.children.filter((c) => c instanceof Mesh)

    // for (const mesh of meshes) {
    //   this.world.addBody(meshToBody(mesh, {mass: 0, material}))
    // }

    // console.log(this.model.position);
  }
}
