import {Player} from '../interfaces'
import {Camera} from './camera'
import {Vector3} from 'three'

export class Follower {
  #camera: Camera
  #target?: Player

  /**
   * Offset para ajustar a posição
   * da câmera em relação ao carro
   */
  #offset = {
    back: new Vector3(0, 2, -3),
    front: new Vector3(0, 4, 3),
  }

  #current = this.#offset.back

  /**
   * Interpolação suave (menores
   * valores = mais suavidade)
   */
  #followSpeed = 0.1

  constructor(camera: Camera) {
    this.#camera = camera

    this.update()
  }

  setTarget(target: Player) {
    this.#target = target
    const {model} = this.#target
    this.#camera.lookAt(model.position)
  }

  setView(view: 'front' | 'back') {
    this.#current = this.#offset[view]
  }

  toggleView = () => {
    if (this.#current === this.#offset.back) {
      this.#current = this.#offset.front
    } else {
      this.#current = this.#offset.back
    }
  }

  update(_delta = 0) {
    if (!this.#target) return

    const targetPosition = new Vector3()
      .copy(this.#target.model.position)
      .add(this.#current.clone().applyQuaternion(this.#target.model.quaternion))

    /**
     * Interpola suavemente a posição da câmera
     */
    this.#camera.position.lerp(targetPosition, this.#followSpeed)

    /**
     * Faz a câmera olhar para o carro
     */
    this.#camera.lookAt(this.#target.model.position)
  }
}
