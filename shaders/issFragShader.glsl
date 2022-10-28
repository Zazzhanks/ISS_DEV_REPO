<<<<<<< HEAD
uniform vec3 hover;

void main() {
    // vec3 color = vec3(
    //     abs(cos(st.x + mx.x)), 
    //     abs(sin(st.y + mx.y)), 
    //     1
    // );
    vec3 color = vec3(0.2, 0.2, 0.2);
    gl_FragColor = vec4(color+hover, 1.0);
=======
uniform vec3 hover;

void main() {
    // vec3 color = vec3(
    //     abs(cos(st.x + mx.x)), 
    //     abs(sin(st.y + mx.y)), 
    //     1
    // );
    vec3 color = vec3(0.2, 0.2, 0.2);
    gl_FragColor = vec4(color+hover, 1.0);
>>>>>>> 3c1fb6d859adcdc953613b1257eff489f749b0d3
}