import {
  Vec3,
  Box,
  Shape,
  Sphere,
  Trimesh,
  Cylinder,
  ConvexPolyhedron,
} from "cannon-es";

export function applyScaleToShape(shape: Shape, scale: Vec3): Shape {
  if (shape instanceof Box) {
    const scaledHalfExtents = new Vec3(
      shape.halfExtents.x * scale.x,
      shape.halfExtents.y * scale.y,
      shape.halfExtents.z * scale.z
    );
    return new Box(scaledHalfExtents);
  }

  if (shape instanceof Sphere) {
    return new Sphere(shape.radius * scale.x); // Assume escala uniforme
  }

  if (shape instanceof Cylinder) {
    return new Cylinder(
      shape.radiusTop * scale.x,
      shape.radiusBottom * scale.x,
      shape.height * scale.y,
      shape.numSegments
    );
  }

  if (shape instanceof ConvexPolyhedron) {
    const scaledVertices = shape.vertices.map(
      (v) => new Vec3(v.x * scale.x, v.y * scale.y, v.z * scale.z)
    );
    return new ConvexPolyhedron({
      vertices: scaledVertices,
      faces: shape.faces,
    });
  }

  if (shape instanceof Trimesh) {
    const scaledVertices: number[] = [];
    for (let i = 0; i < shape.vertices.length; i += 3) {
      scaledVertices.push(
        shape.vertices[i] * scale.x, // X
        shape.vertices[i + 1] * scale.y, // Y
        shape.vertices[i + 2] * scale.z // Z
      );
    }

    return new Trimesh(scaledVertices, Array.from(shape.indices));
  }

  console.warn("Scaling is not implemented for this shape type.");
  return shape;
}
