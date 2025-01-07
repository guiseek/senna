import {bufferGeometryToShape} from './buffer-geometry-to-shape'
import {Matrix4, Mesh, Quaternion, Vector3} from 'three'
import {cannon} from './cannon'
import {Body} from 'cannon-es'

export interface MeshToBodyOptions {
  mass?: number
  material?: Body['material']
  adjustRotation?: boolean // Novo parâmetro para ajuste condicional
}

export const meshToBody = (mesh: Mesh, options: MeshToBodyOptions = {}) => {
  const {mass = 1, material, adjustRotation = false} = options

  // Extrair a geometria e criar a forma Cannon-ES
  const geometry = mesh.geometry
  let shape = bufferGeometryToShape(geometry)

  // Aplicar escala do Mesh ao Shape
  // const scale = new Vec3(mesh.scale.x, mesh.scale.y, mesh.scale.z)
  // shape = applyScaleToShape(shape, scale)

  // Criar o corpo físico
  const body = new Body({mass, material: material ?? undefined})
  body.addShape(shape)

  mesh.updateMatrixWorld()
  const matrix = new Matrix4()
  matrix.copy(mesh.matrixWorld)

  const position = new Vector3()
  const quaternion = new Quaternion()
  const scale = new Vector3()

  matrix.decompose(position, quaternion, scale)

  body.position.copy(cannon.toVec3(position))
  body.quaternion.copy(cannon.toQuaternion(quaternion))

  // // Ajustar rotação do carro, se necessário
  if (adjustRotation) {
    // Criar rotação de correção (-90° no eixo X)
    const rotationCorrection = new Quaternion()
    rotationCorrection.setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2)

    // Aplicar a rotação de correção ao quaternion original
    quaternion.multiply(rotationCorrection)
    body.quaternion.copy(cannon.toQuaternion(quaternion))
  }

  return body
}
