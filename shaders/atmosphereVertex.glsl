<<<<<<< HEAD
varying vec3 vertexNormal;

void main()
{
    vertexNormal = normal;
    gl_Position = projectionMatrix *modelViewMatrix * vec4(position, 1.2);
=======
varying vec3 vertexNormal;

void main()
{
    vertexNormal = normal;
    gl_Position = projectionMatrix *modelViewMatrix * vec4(position, 1.2);
>>>>>>> 3c1fb6d859adcdc953613b1257eff489f749b0d3
}