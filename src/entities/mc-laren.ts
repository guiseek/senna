import {Group, Mesh, MeshStandardMaterial, Vector3} from 'three'
import {ObjectModel, Updatable} from '../interfaces'
import {DEG2RAD} from 'three/src/math/MathUtils.js'
import {getByName} from '../utils'
import {Input} from '../core'

export class McLaren implements ObjectModel, Updatable {
  #model: Group

  get model() {
    return this.#model
  }

  #carMass = 8000

  #tractionForceValue = 45000

  #airResistance = 0.015

  #rollingResistance = 10

  #brakeForce = 80000

  #lateralFriction = 0.7

  #maxSpeed = 100

  #currentVelocity = new Vector3()

  #localAcceleration = new Vector3()

  #netForce = new Vector3()

  #resistanceForce = new Vector3()

  #tractionForce = new Vector3()

  #angularVelocity = 0

  #currentSteering = 0

  #steeringAngle = 0

  #frontWheelLeft: Mesh

  #backWheelLeft: Mesh

  #frontHubLeft: Mesh

  #frontWheelRight: Mesh

  #backWheelRight: Mesh

  #frontHubRight: Mesh

  #frontWheelLeftParent: Group

  #frontWheelRightParent: Group

  #steeringWheel: Mesh

  #rearLight: Mesh

  #rearLightMaterial: MeshStandardMaterial

  #input = Input.getInstance()

  constructor(scene: Group) {
    this.#model = scene

    this.#rearLight = getByName(this.model, 'RearLight')
    this.#frontHubLeft = getByName(this.model, 'FrontHubLeft')
    this.#backWheelLeft = getByName(this.model, 'BackWheelLeft')
    this.#backWheelRight = getByName(this.model, 'BackWheelRight')
    this.#frontWheelRight = getByName(this.model, 'FrontWheelRight')
    this.#frontWheelLeft = getByName(this.model, 'FrontWheelLeft')
    this.#frontHubRight = getByName(this.model, 'FrontHubRight')
    this.#steeringWheel = getByName(this.model, 'SteeringWheel')

    this.#frontWheelLeftParent = this.#frontWheelLeft.parent as Group
    this.#frontWheelRightParent = this.#frontWheelRight.parent as Group

    this.#rearLightMaterial = this.#rearLight.material as MeshStandardMaterial
  }

  update(delta: number) {
    this.#updateCar(delta)
    this.#updateWheels(delta)
  }

  #updateCar(deltaTime: number) {
    const carRotation = this.#model.rotation.y
    const sinRotation = Math.sin(carRotation)
    const cosRotation = Math.cos(carRotation)

    /** Aplica força de tração */
    if (this.#input.state.up) {
      this.#tractionForce.set(0, 0, this.#tractionForceValue)
    } else if (this.#input.state.down) {
      this.#tractionForce.set(0, 0, -this.#tractionForceValue * 0.5)
    } else {
      this.#tractionForce.set(0, 0, 0)
    }

    /** Aplica força de freio */
    const brakeForce = new Vector3()
    const isBraking = this.#input.state.space

    this.#rearLightMaterial.emissiveIntensity = isBraking ? 1 : 0

    if (isBraking) {
      brakeForce
        .copy(this.#currentVelocity)
        .normalize()
        .multiplyScalar(-this.#brakeForce)
    }

    /** Força de resistência */
    this.#resistanceForce.x = -(
      this.#airResistance *
        this.#currentVelocity.x *
        Math.abs(this.#currentVelocity.x) +
      this.#rollingResistance * this.#currentVelocity.x
    )

    this.#resistanceForce.z = -(
      this.#airResistance *
        this.#currentVelocity.z *
        Math.abs(this.#currentVelocity.z) +
      this.#rollingResistance * this.#currentVelocity.z
    )

    /** Força total */
    const globalTractionX =
      sinRotation * this.#tractionForce.z + cosRotation * this.#tractionForce.x
    const globalTractionZ =
      cosRotation * this.#tractionForce.z - sinRotation * this.#tractionForce.x

    this.#netForce
      .set(globalTractionX, 0, globalTractionZ)
      .add(this.#resistanceForce)
      .add(brakeForce)

    /** Calcula aceleração (F = ma) */
    this.#localAcceleration.copy(this.#netForce).divideScalar(this.#carMass)

    /** Atualiza velocidade */
    this.#currentVelocity.addScaledVector(this.#localAcceleration, deltaTime)

    /** Limitar velocidade máxima */
    if (this.#currentVelocity.length() > this.#maxSpeed) {
      this.#currentVelocity.setLength(this.#maxSpeed)
    }

    /** Reduz componente lateral da velocidade */
    const forwardDirection = new Vector3(
      Math.sin(carRotation),
      0,
      Math.cos(carRotation)
    ).normalize()

    const lateralVelocity = this.#currentVelocity
      .clone()
      .projectOnPlane(forwardDirection)

    this.#currentVelocity.sub(
      lateralVelocity.multiplyScalar(this.#lateralFriction)
    )

    /** Parada mínima */
    if (this.#currentVelocity.length() < 0.05) {
      this.#currentVelocity.set(0, 0, 0)
    }

    /** Ajusta posição */
    this.#model.position.addScaledVector(this.#currentVelocity, deltaTime)

    /** Rotação do carro */
    const localVelocityZ = this.#currentVelocity.dot(forwardDirection)
    const turningRadius = 10
    this.#angularVelocity =
      (this.#currentSteering * Math.abs(localVelocityZ)) / turningRadius

    const velocityDirection = localVelocityZ >= 0 ? 1 : -1
    this.#model.rotation.y +=
      this.#angularVelocity * deltaTime * velocityDirection
  }

  #updateWheels(deltaTime: number) {
    const steeringSpeed = 2 * deltaTime
    const steeringInput =
      (this.#input.state.left ? 1 : 0) - (this.#input.state.right ? 1 : 0)

    /** Atualiza direção */
    if (steeringInput === 0) {
      if (this.#currentSteering > 0) {
        this.#currentSteering = Math.max(
          0,
          this.#currentSteering - steeringSpeed
        )
      } else if (this.#currentSteering < 0) {
        this.#currentSteering = Math.min(
          0,
          this.#currentSteering + steeringSpeed
        )
      }
    } else {
      this.#currentSteering += steeringInput * steeringSpeed
      this.#currentSteering = Math.max(-1, Math.min(1, this.#currentSteering))
    }

    /** Calcula ângulo de direção */
    this.#steeringAngle = this.#currentSteering * 25 * DEG2RAD

    /** Aplica ângulo de direção */
    this.#frontWheelLeftParent.rotation.y = this.#steeringAngle
    this.#frontWheelRightParent.rotation.y = this.#steeringAngle
    this.#frontHubLeft.rotation.y = this.#steeringAngle
    this.#frontHubRight.rotation.y = this.#steeringAngle

    this.#steeringWheel.rotation.y = this.#steeringAngle * 3

    /** Rotação sincronizada das rodas */
    const wheelRadius = 0.5
    const localVelocityZ = this.#currentVelocity.dot(
      new Vector3(
        Math.sin(this.#model.rotation.y),
        0,
        Math.cos(this.#model.rotation.y)
      )
    )
    const wheelRotation = (localVelocityZ / wheelRadius) * deltaTime

    this.#frontWheelLeft.rotation.x += wheelRotation
    this.#frontWheelRight.rotation.x += wheelRotation
    this.#backWheelLeft.rotation.x += wheelRotation
    this.#backWheelRight.rotation.x += wheelRotation
  }
}
