import {Body, Material, Quaternion, Trimesh, Vec3} from 'cannon-es'
import {Mesh, QuaternionLike, Vector3Like} from 'three'

const createTrimeshFromMesh = (mesh: Mesh) => {
  const geometry = mesh.geometry.clone()
  geometry.applyMatrix4(mesh.matrixWorld) // Aplica transformações

  const vertices = geometry.attributes.position.array // Vértices da geometria
  const indices = geometry.index!.array // Índices dos triângulos

  return new Trimesh(Array.from(vertices), Array.from(indices))
}

const createBodyFromMesh = (
  mesh: Mesh,
  {mass = 0, material}: {mass?: number; material?: Material} = {}
) => {
  const shape = createTrimeshFromMesh(mesh)

  const body = new Body({mass, shape, material})

  const {x, y, z} = mesh.position
  body.position.copy(new Vec3(x, y, z))

  return body
}

const toVec3 = (v: Vector3Like) => {
  return new Vec3(v.x, v.y, v.z)
}

const toQuaternion = (q: QuaternionLike) => {
  return new Quaternion(q.x, q.y, q.z, q.w)
}

export const cannon = {
  createTrimeshFromMesh,
  createBodyFromMesh,
  toVec3,
  toQuaternion,
}
