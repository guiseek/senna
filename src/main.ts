import {loadEngine, loadMcLaren, loadTrack} from './loaders'
import {Camera, Follower, Input, Renderer} from './core'
import {createLights, createLoop} from './factories'
import {AudioListener, Scene} from 'three'
import {inner, interval, values} from './utils'
import {Collision} from './physics'
import {World} from 'cannon-es'
import './style.scss'
import {updateGear} from './dom'

const scene = new Scene()

const camera = new Camera(75, 0.1, 10000)

const renderer = new Renderer(app, 0x010101)

const follower = new Follower(camera)

scene.add(...values(createLights()))

const world = new World()
world.gravity.set(0, -9.82, 0)

// const cannonDebugger = CannonDebugger(scene, world)

const input = Input.getInstance()

const collision = new Collision()

const init = async () => {
  const audioListener = new AudioListener()

  const engine = await loadEngine(audioListener)

  const track = await loadTrack()
  track.model.position.y = 1
  scene.add(track.model)

  collision.track(track.asphalt)

  const mcLaren = await loadMcLaren(world, engine)
  mcLaren.model.position.z = -10
  mcLaren.model.position.x = -2
  mcLaren.model.rotation.y = -Math.PI / 2
  scene.add(mcLaren.model)

  // mcLaren.model.rotateOnWorldAxis(new Vector3(1, 0, 3), 0.1)
  interval(() => {
    updateGear(mcLaren.rpm)
  }, 250)

  follower.setTarget(mcLaren)

  const loop = createLoop((delta) => {
    world.step(1 / 60, delta)

    collision.chekOutOfTrack(mcLaren)

    mcLaren.update(delta)

    follower.update(delta)

    renderer.render(scene, camera)
  })

  input.on('v', follower.toggle)

  loop.animate()
  // cannonDebugger.update()
}

init()

addEventListener('resize', () => {
  camera.aspect = inner.ratio
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(devicePixelRatio)
  renderer.setSize(inner.width, inner.height)
})
