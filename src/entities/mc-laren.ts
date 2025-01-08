import {Callback, EventEmitter, getByName, meshToBody} from '../utils'
import {Group, Mesh, MeshStandardMaterial, Vector3} from 'three'
import {ObjectModel, Updatable} from '../interfaces'
import {DEG2RAD} from 'three/src/math/MathUtils.js'
import {World, Material} from 'cannon-es'
import {Engine} from './engine'
import {Input} from '../core'

export interface McLarenEventMap {
  start: true
}

export class McLaren implements ObjectModel, Updatable {
  #model: Group

  get model() {
    return this.#model
  }

  #carMass = 6000

  #deceleration = 20

  #tractionForceValue = 90000

  #airResistance = 0.015

  #rollingResistance = 10

  #brakeForce = 300000

  #lateralFriction = 0.7

  #maxSpeed = 360

  #rpm = 0

  get rpm() {
    return this.#rpm
  }

  #currentVelocity = new Vector3()

  #localAcceleration = new Vector3()

  #netForce = new Vector3()

  #resistanceForce = new Vector3()

  #tractionForce = new Vector3()

  #angularVelocity = 0

  #currentSteering = 0

  #steeringAngle = 0

  #frontHubLeft: Mesh

  #frontWheelLeft: Mesh

  // #frontBodyLeft: Body

  #frontWheelLeftParent: Group

  #backWheelLeft: Mesh

  // #backBodyLeft: Body

  // #backWheelLeftParent: Object3D

  #frontHubRight: Mesh

  #frontWheelRight: Mesh

  // #frontBodyRight: Body

  #frontWheelRightParent: Group

  #backWheelRight: Mesh

  // #backBodyRight: Body

  // #backWheelRightParent: Object3D

  #steeringWheel: Mesh

  #rearLight: Mesh

  #head: Mesh

  #chassis: Mesh

  #rearLightMaterial: MeshStandardMaterial

  #input = Input.getInstance()

  // #orientation = Orientation.getInstance()

  material = new Material('chassis')

  // #chassisBody: Body

  #event = new EventEmitter<McLarenEventMap>()

  get tracked() {
    return {
      frontLeft: this.#frontWheelLeft,
      frontRight: this.#frontWheelRight,
      backLeft: this.#backWheelLeft,
      backRight: this.#backWheelRight,
      chassis: this.#chassis,
    }
  }

  constructor(scene: Group, private world: World, readonly engine: Engine) {
    this.#model = scene

    this.#head = getByName(this.model, 'Head')
    this.#rearLight = getByName(this.model, 'RearLight')
    this.#frontHubLeft = getByName(this.model, 'FrontHubLeft')

    this.#frontHubRight = getByName(this.model, 'FrontHubRight')
    this.#steeringWheel = getByName(this.model, 'SteeringWheel')

    /**
     * Chassis
     */

    const chassis = getByName<Group>(this.model, 'Chassis')
    const [mesh] = chassis.children
    console.log(mesh)

    this.#chassis = mesh as Mesh

    // this.#chassis.add(this.sound.start, this.sound.idle, this.sound.running)

    const chassisBody = meshToBody(this.#chassis, {
      mass: 150,
      material: this.material,
      adjustRotation: true,
    })
    console.log(chassisBody)

    this.world.addBody(chassisBody)

    // this.#chassisBody = chassisBody

    /**
     * Vehicle
     */

    // const vehicle = new RaycastVehicle({
    //   chassisBody,
    //   indexRightAxis: 0,
    //   indexUpAxis: 1,
    //   indexForwardAxis: 2,
    // })

    /**
     * Wheels
     */

    // const wheelOptions: WheelInfoOptions = {
    //   directionLocal: new Vec3(0, -1, 0),
    //   suspensionStiffness: 30,
    //   suspensionRestLength: 0.3,
    //   frictionSlip: 5,
    //   dampingRelaxation: 2.3,
    //   dampingCompression: 4.4,
    //   maxSuspensionForce: 100000,
    //   rollInfluence: 0.01,
    //   axleLocal: new Vec3(-1, 0, 0),
    //   chassisConnectionPointLocal: new Vec3(1, 0, 2),
    //   maxSuspensionTravel: 0.3,
    //   customSlidingRotationalSpeed: -30,
    //   useCustomSlidingRotationalSpeed: true,
    // }

    // const wheels: Body[] = []

    this.#backWheelLeft = getByName(this.model, 'BackWheelLeft')

    // this.#backBodyLeft = meshToBody(this.#backWheelLeft, {
    //   mass: 5,
    //   material: this.material,
    //   adjustRotation: true,
    // })

    // this.#backBodyLeft.position.copy(
    //   cannon.toVec3(this.#backWheelLeft.position)
    // )
    // this.#backBodyLeft.quaternion.copy(
    //   cannon.toQuaternion(this.#backWheelLeft.quaternion)
    // )

    // this.world.addBody(this.#backBodyLeft)

    // this.#backWheelLeftParent = this.#backWheelLeft.parent as Object3D

    // console.log(this.#backWheelLeftParent.position)

    // wheels.push(this.#backBodyLeft)

    this.#backWheelRight = getByName(this.model, 'BackWheelRight')

    // this.#backBodyRight = meshToBody(this.#backWheelRight, {
    //   mass: 5,
    //   material: this.material,
    // })

    // // this.#backWheelRightParent = this.#backWheelRight.parent as Object3D

    // wheels.push(this.#backBodyRight)

    this.#frontWheelRight = getByName(this.model, 'FrontWheelRight')

    // this.#frontBodyRight = meshToBody(this.#frontWheelRight, {
    //   mass: 5,
    //   material: this.material,
    // })

    // wheels.push(this.#frontBodyRight)

    this.#frontWheelLeft = getByName(this.model, 'FrontWheelLeft')

    // this.#frontBodyLeft = meshToBody(this.#frontWheelLeft, {
    //   mass: 5,
    //   material: this.material,
    // })

    // wheels.push(this.#frontBodyLeft)

    // console.log(this.#frontWheelLeft.position)

    // console.log(wheels)

    this.#frontWheelLeftParent = this.#frontWheelLeft.parent as Group
    this.#frontWheelRightParent = this.#frontWheelRight.parent as Group

    this.#rearLightMaterial = this.#rearLight.material as MeshStandardMaterial
  }

  on<K extends keyof McLarenEventMap>(
    eventName: K,
    callback: Callback<McLarenEventMap[K]>
  ) {
    this.#event.on(eventName, callback)
  }

  update(delta: number) {
    // if (!this.#started) return

    this.#updateSound()
    this.#updateCar(delta)
    this.#updateWheels(delta)

    // console.log(this.#currentVelocity.length());
  }

  #updateSound() {
    this.engine.update(this.rpm)
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
      // Sem aceleração ou ré, desacelera gradualmente
      // Intensidade da desaceleração (ajustável)
      const deceleration = this.#deceleration * deltaTime

      const speed = this.#currentVelocity.length() // Velocidade atual
      if (speed > deceleration) {
        // Reduz gradualmente a velocidade
        this.#currentVelocity.setLength(speed - deceleration)
      } else {
        // Para o carro se a velocidade for muito baixa
        this.#currentVelocity.set(0, 0, 0)
      }
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

    /** Rotação do carro */
    const localVelocityZ = this.#currentVelocity.dot(forwardDirection)
    const turningRadius = Math.max(10, this.rpm / 20)
    this.#angularVelocity =
      (this.#currentSteering * Math.abs(localVelocityZ)) / turningRadius

    const velocityDirection = localVelocityZ >= 0 ? 1 : -1
    this.#model.rotation.y +=
      this.#angularVelocity * deltaTime * velocityDirection

    /** Ajusta posição */
    this.#model.position.addScaledVector(this.#currentVelocity, deltaTime)
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

    // if (this.#orientation.steeringAngle) {
    //   this.#steeringAngle = this.#orientation.steeringAngle
    // } else {
    // }
    this.#steeringAngle = this.#currentSteering * 25 * DEG2RAD

    /** Aplica ângulo de direção */
    this.#frontWheelLeftParent.rotation.y = this.#steeringAngle
    this.#frontWheelRightParent.rotation.y = this.#steeringAngle
    this.#frontHubLeft.rotation.y = this.#steeringAngle
    this.#frontHubRight.rotation.y = this.#steeringAngle

    this.#steeringWheel.rotation.y = this.#steeringAngle * 3

    this.#head.rotation.y = this.#steeringAngle * 0.6

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

    const rpm = (Math.abs(localVelocityZ) * 60) / (2 * Math.PI * wheelRadius)
    this.#rpm = parseFloat(rpm.toFixed(2))
  }
}
