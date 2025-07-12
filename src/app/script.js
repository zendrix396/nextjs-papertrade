import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js';
import { vertexShader, fluidShader, displayShader } from './shaders.js';
const config = {
    brushSize: 0,             // Smaller, more precise stroke
    brushStrength: 0,         // Gentle strength for subtle smudging
    distortionAmount: 0.0,     // Minimal warping, just slight smudging
    fluidDecay: 0,            // Slower fade to maintain painted effect
    trailLength: 0,           // Longer trail for smooth stroke continuity
    stopDecay: 0.0,            // Natural fading when not moving
    color1: "#f0f0f0",  // Very light gray, replacing light cyan
color2: "#2a2a2a",  // Dark gray, replacing deep mauve
color3: "#000000",  // Pure black, replacing strong blue
color4: "#999999"   // Mid-gray, replacing sky blue
,          // Bright sky blue (your original)
    colorIntensity: 0.3,        // Slightly increased for better visibility
    softness: 0.85              // High softness for smooth painted effect
};
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true });

const gradientCanvas = document.querySelector(".gradient-canvas");
renderer.setSize(window.innerWidth, window.innerHeight);
gradientCanvas.appendChild(renderer.domElement);

const fluidTarget1 = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
    }
);

const fluidTarget2 = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
    }
);

let currentFluidTarget = fluidTarget1;
let previousFluidTarget = fluidTarget2;
let frameCount = 0;

const fluidMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: null },
        uBrushSize: { value: config.brushSize },
        uBrushStrength: { value: config.brushStrength },
        uFluidDecay: { value: config.fluidDecay },
        uTrailLength: { value: config.trailLength },
        uStopDecay: { value: config.stopDecay },
    },
    vertexShader: vertexShader,
    fragmentShader: fluidShader,
});

const displayMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iFluid: { value: null },
        uDistortionAmount: { value: config.distortionAmount },
        uColor1: { value: new THREE.Vector3(...hexToRgb(config.color1)) },
        uColor2: { value: new THREE.Vector3(...hexToRgb(config.color2)) },
        uColor3: { value: new THREE.Vector3(...hexToRgb(config.color3)) },
        uColor4: { value: new THREE.Vector3(...hexToRgb(config.color4)) },
        uColorIntensity: { value: config.colorIntensity },
        uSoftness: { value: config.softness },
    },
    vertexShader: vertexShader,
    fragmentShader: displayShader,
});

const geometry = new THREE.PlaneGeometry(2, 2);
const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
const displayPlane = new THREE.Mesh(geometry, displayMaterial);

let mouseX = 0,
    mouseY = 0;
let prevMouseX = 0,
    prevMouseY = 0;
let lastMoveTime = 0;

document.addEventListener("mousemove", (e) => {
    const rect = gradientCanvas.getBoundingClientRect();
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX - rect.left;
    mouseY = rect.height - (e.clientY - rect.top);
    lastMoveTime = performance.now();
    fluidMaterial.uniforms.iMouse.value.set(
        mouseX,
        mouseY,
        prevMouseX,
        prevMouseY
    );
});

document.addEventListener("mouseleave", () => {
    fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
});

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;
    fluidMaterial.uniforms.iTime.value = time;
    displayMaterial.uniforms.iTime.value = time;
    fluidMaterial.uniforms.iFrame.value = frameCount;

    if (performance.now() - lastMoveTime > 100) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    }

    fluidMaterial.uniforms.uBrushSize.value = config.brushSize;
    fluidMaterial.uniforms.uBrushStrength.value = config.brushStrength;
    fluidMaterial.uniforms.uFluidDecay.value = config.fluidDecay;
    fluidMaterial.uniforms.uTrailLength.value = config.trailLength;
    fluidMaterial.uniforms.uStopDecay.value = config.stopDecay;

    displayMaterial.uniforms.uDistortionAmount.value = config.distortionAmount;
    displayMaterial.uniforms.uColorIntensity.value = config.colorIntensity;
    displayMaterial.uniforms.uSoftness.value = config.softness;
    displayMaterial.uniforms.uColor1.value.set(...hexToRgb(config.color1));
    displayMaterial.uniforms.uColor2.value.set(...hexToRgb(config.color2));
    displayMaterial.uniforms.uColor3.value.set(...hexToRgb(config.color3));
    displayMaterial.uniforms.uColor4.value.set(...hexToRgb(config.color4));

    fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
    renderer.setRenderTarget(currentFluidTarget);
    renderer.render(fluidPlane, camera);

    displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
    renderer.setRenderTarget(null);
    renderer.render(displayPlane, camera);

    const temp = currentFluidTarget;
    currentFluidTarget = previousFluidTarget;
    previousFluidTarget = temp;

    frameCount++;
}

window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    fluidMaterial.uniforms.iResolution.value.set(width, height);
    displayMaterial.uniforms.iResolution.value.set(width, height);

    fluidTarget1.setSize(width, height);
    fluidTarget2.setSize(width, height);
    frameCount = 0;
});

animate();