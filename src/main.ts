import {createLights, createLoop, createProgress} from './factories'
import {Camera, Follower, Input, Loader, Renderer} from './core'
import {McLaren} from './entities/mc-laren'
import {inner, values} from './utils'
import {Scene} from 'three'
import './style.scss'

const loadMcLaren = async (loader: Loader) => {
  return loader.gltf
    .loadAsync('mc-laren.glb', createProgress('McLaren'))
    .then((gltf) => new McLaren(gltf.scene))
}

const scene = new Scene()

const camera = new Camera()

const follower = new Follower(camera)

const renderer = new Renderer(app, 0x010101)

scene.add(...values(createLights()))

const loader = Loader.getInstance()

const input = Input.getInstance()

const init = async () => {
  const mcLaren = await loadMcLaren(loader)
  mcLaren.model.position.x = 0
  mcLaren.model.position.z = 4.5
  mcLaren.model.position.y = -2.5
  mcLaren.model.rotation.y = Math.PI * 1.3
  scene.add(mcLaren.model)

  follower.setTarget(mcLaren)

  const loop = createLoop((delta) => {
    mcLaren.update(delta)

    follower.update(delta)

    renderer.render(scene, camera)
  })

  input.on('v', follower.toggle)

  loop.animate()
}

init()

addEventListener('resize', () => {
  camera.aspect = inner.ratio
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(devicePixelRatio)
  renderer.setSize(inner.width, inner.height)
})
