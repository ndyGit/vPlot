
uniform vec3 color;
uniform sampler2D texture;

varying vec3 vColor;
varying float vOpacity;

void main() {
    vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );
	gl_FragColor = vec4( color * vColor, vOpacity );
	gl_FragColor = gl_FragColor * texture2D( texture, uv );
	if ( gl_FragColor.a < ALPHATEST ) discard;

}

