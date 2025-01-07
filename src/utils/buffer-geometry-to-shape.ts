import { Shape, Trimesh, ConvexPolyhedron, Vec3 } from "cannon-es";
import { BufferGeometry, Vector3 } from "three";

export function bufferGeometryToShape(geometry: BufferGeometry): Shape {
  const vertices: Vec3[] = [];
  const indices: number[] = [];

  // Extrair atributos de posição
  const positionAttribute = geometry.attributes.position;
  
  if (!positionAttribute) {
    throw new Error("Geometry does not have position attribute.");
  }

  if (positionAttribute.array.some((val) => isNaN(val) || val === undefined)) {
    throw new Error("Geometry contains invalid position data.");
  }
  
  // Extrair vértices
  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new Vector3().fromBufferAttribute(positionAttribute, i);
    vertices.push(new Vec3(vertex.x, vertex.y, vertex.z));
  }

  // Extrair índices (para Trimesh)
  const indexAttribute = geometry.index;
  if (indexAttribute) {
    for (let i = 0; i < indexAttribute.count; i++) {
      indices.push(indexAttribute.getX(i));
    }

    // Criar Trimesh (caso tenha índices)
    return new Trimesh(
      vertices.flatMap((v) => [v.x, v.y, v.z]), // Flatten vertices array
      indices
    );
  }

  // Caso não tenha índices, criar ConvexPolyhedron
  const faces: number[][] = [];
  const faceNormals: Vec3[] = [];

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
