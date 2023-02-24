uniform sampler2D uTexture;
uniform vec2 scale;
varying vec2 vUv;

void main()	{
    // SCALE, background size cover
    vec2 newUV = (vUv - vec2(0.5))/scale + vec2(0.5);
    gl_FragColor = texture2D(uTexture,newUV);
}