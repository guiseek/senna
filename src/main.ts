import {createLights, createLoop, createProgress} from './factories'
import {Camera, Controls, Input, Loader, Renderer} from './core'
import {McLaren} from './entities/mc-laren'
import {inner, values} from './utils'
import {Scene} from 'three'
import './style.scss'

const loadMcLaren = async (loader: Loader) => {
  return loader.gltf
    .loadAsync('mc-laren.glb', createProgress('McLaren MP4 5'))
    .then(async (gltf) => {
      return new McLaren(gltf.scene)
    })
}

const scene = new Scene()

const camera = new Camera()

const renderer = new Renderer(app, 0x010101)

const controls = new Controls(camera, renderer)
controls.update()

const lights = createLights()

scene.add(...values(lights))

const input = Input.getInstance()

const loader = Loader.getInstance()

const init = async () => {
  const mcLaren = await loadMcLaren(loader)
  mcLaren.model.position.x = 0
  mcLaren.model.position.z = 4.5
  mcLaren.model.position.y = -2.5
  mcLaren.model.rotation.y = (Math.PI * 1.3)
  scene.add(mcLaren.model)

  const loop = createLoop((delta) => {
    mcLaren.update(delta)

    controls.update(delta)

    renderer.render(scene, camera)
  })

  input.on('p', loop.toggle)

  loop.animate()
}

init()

addEventListener('resize', () => {
  camera.aspect = inner.ratio
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(devicePixelRatio)
  renderer.setSize(inner.width, inner.height)
})
