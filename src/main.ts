import {loadMcLaren, loadSound, loadTrack} from './loaders'
import {createLights, createLoop} from './factories'
import {Camera, Follower, Input, Renderer} from './core'
import {inner, values} from './utils'
import {World} from 'cannon-es'
import {Scene} from 'three'
import './style.scss'

const scene = new Scene()

const camera = new Camera(75, 0.1, 10000)

const renderer = new Renderer(app, 0x010101)

const follower = new Follower(camera)

scene.add(...values(createLights()))

const world = new World()
world.gravity.set(0, -9.82, 0)

// const cannonDebugger = CannonDebugger(scene, world)

const input = Input.getInstance()

const init = async () => {
  const sound = await loadSound()

  const track = await loadTrack(world)
  scene.add(track.model)

  const mcLaren = await loadMcLaren(world, sound)
  mcLaren.model.position.x = 260
  mcLaren.model.rotation.y = -Math.PI / 2
  scene.add(mcLaren.model)

  follower.setTarget(mcLaren)

  mcLaren.on('start', () => {
    console.log('start')
  })

  const loop = createLoop((delta) => {
    world.step(1 / 60, delta)

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
