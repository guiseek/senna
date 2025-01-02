import {OrbitControls} from 'three/examples/jsm/Addons.js'
import {Renderer} from './renderer'
import {Camera} from './camera'

export class Controls extends OrbitControls {
  constructor(camera: Camera, renderer: Renderer) {
    super(camera, renderer.domElement)
    this.update()
  }
}
