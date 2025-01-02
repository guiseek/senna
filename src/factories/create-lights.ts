import {AmbientLight, DirectionalLight, PointLight, SpotLight} from 'three'

export const createLights = () => {
  const ambient = new AmbientLight(0xffffff, 0.5)

  const point = new PointLight(0xffaa00, 0.8, 30)
  point.position.set(2, 5, 2)
  point.castShadow = true

  const directional = new DirectionalLight(0xffffff, 1)
  directional.position.set(5, 10, 5)
  directional.castShadow = true
  directional.shadow.mapSize.width = 1024
  directional.shadow.mapSize.height = 1024
  directional.shadow.camera.near = 0.5
  directional.shadow.camera.far = 50

  const spot = new SpotLight(0xffffff, 0.7, 50, Math.PI / 6)
  spot.position.set(-5, 10, -5)
  spot.target.position.set(0, 0, 0)
  spot.castShadow = true

  return {ambient, point, directional, spot}
}
