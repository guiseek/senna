import {
  Box,
  Vec3,
  Shape,
  Sphere,
  Trimesh,
  Cylinder,
  Heightfield,
  ConvexPolyhedron,
} from 'cannon-es'
import {
  Vector3,
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  BufferGeometry,
  CylinderGeometry,
} from 'three'

interface ShapeToGeometryOptions {
  flatShading?: boolean
}

export function shapeToGeometry(
  shape: Shape,
  options: ShapeToGeometryOptions = {}
): BufferGeometry {
  const {flatShading = true} = options

  switch (shape.type) {
    case Shape.types.SPHERE: {
      const sphereShape = shape as Sphere
      return new SphereGeometry(sphereShape.radius, 8, 8)
    }

    case Shape.types.PARTICLE: {
      return new SphereGeometry(0.1, 8, 8)
    }

    case Shape.types.PLANE: {
      return new PlaneGeometry(500, 500, 4, 4)
    }

    case Shape.types.BOX: {
      const boxShape = shape as Box
      return new BoxGeometry(
        boxShape.halfExtents.x * 2,
        boxShape.halfExtents.y * 2,
        boxShape.halfExtents.z * 2
      )
    }

    case Shape.types.CYLINDER: {
      const cylinderShape = shape as Cylinder
      return new CylinderGeometry(
        cylinderShape.radiusTop,
        cylinderShape.radiusBottom,
        cylinderShape.height,
        cylinderShape.numSegments
      )
    }

    case Shape.types.CONVEXPOLYHEDRON: {
      const polyhedronShape = shape as ConvexPolyhedron
      const geometry = new BufferGeometry()

      const vertices = polyhedronShape.vertices.map(
        (v) => new Vector3(v.x, v.y, v.z)
      )
      const indices: number[] = []

      for (const face of polyhedronShape.faces) {
        const [a, ...rest] = face
        for (let j = 0; j < rest.length - 1; j++) {
          indices.push(a, rest[j], rest[j + 1])
        }
      }

      geometry.setFromPoints(vertices)
      geometry.setIndex(indices)
      geometry.computeBoundingSphere()

      if (flatShading) {
        geometry.computeVertexNormals()
      }

      return geometry
    }

    case Shape.types.HEIGHTFIELD: {
      const heightfieldShape = shape as Heightfield
      const geometry = new BufferGeometry()

      const vertices: Vector3[] = []
      const indices: number[] = []
      const v0 = new Vec3()
      const v1 = new Vec3()
      const v2 = new Vec3()

      for (let xi = 0; xi < heightfieldShape.data.length - 1; xi++) {
        for (let yi = 0; yi < heightfieldShape.data[xi].length - 1; yi++) {
          for (let k = 0; k < 2; k++) {
            heightfieldShape.getConvexTrianglePillar(xi, yi, k === 0)

            v0.copy(heightfieldShape.pillarConvex.vertices[0]).vadd(
              heightfieldShape.pillarOffset,
              v0
            )
            v1.copy(heightfieldShape.pillarConvex.vertices[1]).vadd(
              heightfieldShape.pillarOffset,
              v1
            )
            v2.copy(heightfieldShape.pillarConvex.vertices[2]).vadd(
              heightfieldShape.pillarOffset,
              v2
            )

            vertices.push(
              new Vector3(v0.x, v0.y, v0.z),
              new Vector3(v1.x, v1.y, v1.z),
              new Vector3(v2.x, v2.y, v2.z)
            )

            const baseIndex = vertices.length - 3
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2)
          }
        }
      }

      geometry.setFromPoints(vertices)
      geometry.setIndex(indices)
      geometry.computeBoundingSphere()

      if (flatShading) {
        geometry.computeVertexNormals()
      }

      return geometry
    }

    case Shape.types.TRIMESH: {
      const trimeshShape = shape as Trimesh
      const geometry = new BufferGeometry()

      const vertices: Vector3[] = []
      const indices: number[] = []
      const v0 = new Vec3()
      const v1 = new Vec3()
      const v2 = new Vec3()

      for (let i = 0; i < trimeshShape.indices.length / 3; i++) {
        trimeshShape.getTriangleVertices(i, v0, v1, v2)

        vertices.push(
          new Vector3(v0.x, v0.y, v0.z),
          new Vector3(v1.x, v1.y, v1.z),
          new Vector3(v2.x, v2.y, v2.z)
        )

        const baseIndex = vertices.length - 3
        indices.push(baseIndex, baseIndex + 1, baseIndex + 2)
      }

      geometry.setFromPoints(vertices)
      geometry.setIndex(indices)
      geometry.computeBoundingSphere()

      if (flatShading) {
        geometry.computeVertexNormals()
      }

      return geometry
    }

    default: {
      throw new Error(`Shape not recognized: "${shape.type}"`)
    }
  }
}
