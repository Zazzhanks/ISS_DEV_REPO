<<<<<<< HEAD
<<<<<<< HEAD
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vSunDir;

uniform vec3 sunDirection;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vNormal = normalMatrix * normal;
    vSunDir = mat3(viewMatrix) * sunDirection;

    gl_Position = projectionMatrix * mvPosition;
=======
=======
>>>>>>> 3c1fb6d859adcdc953613b1257eff489f749b0d3
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vSunDir;

uniform vec3 sunDirection;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vNormal = normalMatrix * normal;
    vSunDir = mat3(viewMatrix) * sunDirection;

    gl_Position = projectionMatrix * mvPosition;
<<<<<<< HEAD
>>>>>>> 3c1fb6d859adcdc953613b1257eff489f749b0d3
=======
>>>>>>> 3c1fb6d859adcdc953613b1257eff489f749b0d3
}