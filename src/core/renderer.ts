import {ColorRepresentation, WebGLRenderer} from 'three'

export class Renderer extends WebGLRenderer {
  constructor(container: HTMLElement, color: ColorRepresentation = 0xffffff) {
    super({antialias: true})
    this.setClearColor(color)
    this.setPixelRatio(devicePixelRatio)
    this.setSize(innerWidth, innerHeight)
    container.appendChild(this.domElement)
  }
}
