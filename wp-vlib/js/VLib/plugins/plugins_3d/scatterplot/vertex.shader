
attribute float opacity;
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;
varying float vOpacity;

void main() {

	vColor = customColor;
	vOpacity = opacity;

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );
	gl_Position = projectionMatrix * mvPosition;

}


