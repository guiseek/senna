import {
  Box,
  Vec3,
  Shape,
  Sphere,
  Trimesh,
  Cylinder,
  ConvexPolyhedron,
} from "cannon-es";
import {
  Vector3,
  BoxGeometry,
  BufferGeometry,
  SphereGeometry,
  CylinderGeometry,
} from "three";

export function geometryToShape(geometry: BufferGeometry): Shape {
  // Verificar se a geometria é uma das classes conhecidas
  if (geometry instanceof BoxGeometry) {
    const parameters = geometry.parameters;

    const halfExtents = new Vec3(
      parameters.width / 2,
      parameters.height / 2,
      parameters.depth / 2
    );
    return new Box(halfExtents);
  }

  if (geometry instanceof SphereGeometry) {
    const parameters = geometry.parameters;

    return new Sphere(parameters.radius);
  }

  if (geometry instanceof CylinderGeometry) {
    const parameters = geometry.parameters;

    const radiusTop = parameters.radiusTop || parameters.radiusBottom;
    const radiusBottom = parameters.radiusBottom;
    const height = parameters.height;

    return new Cylinder(
      radiusTop,
      radiusBottom,
      height,
      parameters.radialSegments
    );
  }

  // Para geometria personalizada ou complexa: Trimesh ou ConvexPolyhedron
  const vertices: Vec3[] = [];
  const indices: number[] = [];

  const positionAttribute = geometry.attributes.position;
  if (positionAttribute) {
    // Extrair vértices da geometria
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new Vector3().fromBufferAttribute(positionAttribute, i);
      vertices.push(new Vec3(vertex.x, vertex.y, vertex.z));
    }
  }

  const indexAttribute = geometry.index;
  if (indexAttribute) {
    // Extrair índices da geometria
    for (let i = 0; i < indexAttribute.count; i += 3) {
      indices.push(
        indexAttribute.getX(i),
        indexAttribute.getX(i + 1),
        indexAttribute.getX(i + 2)
      );
    }

    // Criar Trimesh
    return new Trimesh(
      vertices.flatMap((v) => [v.x, v.y, v.z]), // Array de vértices
      indices // Índices
    );
  }

  // Caso não tenha índices, criar ConvexPolyhedron
  const faceNormals: Vec3[] = [];
  const faces: number[][] = [];

  for (let i = 0; i < vertices.length; i += 3) {
    const a = i;
    const b = i + 1;
    const c = i + 2;

    faces.push([a, b, c]);

    // Calcular o normal da face
    const normal = new Vector3()
      .crossVectors(
        vertices[b].vsub(vertices[a]),
        vertices[c].vsub(vertices[a])
      )
      .normalize();

    faceNormals.push(new Vec3(normal.x, normal.y, normal.z));
  }

  return new ConvexPolyhedron({
    vertices,
    faces,
    normals: faceNormals,
  });
}
