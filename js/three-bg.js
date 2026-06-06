const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let mouseX = 0;
let mouseY = 0;

function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 30;

    // Particles
    const particlesCount = 150;
    const positions = new Float32Array(particlesCount * 3);
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Lines (Mesh)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.1
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * particlesCount * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    function animate() {
        requestAnimationFrame(animate);

        const positions = geometry.attributes.position.array;
        let lineIdx = 0;
        const linePositions = lineGeometry.attributes.position.array;

        for (let i = 0; i < particlesCount; i++) {
            const ix = positions[i * 3];
            const iy = positions[i * 3 + 1];
            const iz = positions[i * 3 + 2];

            // Subtle movement
            positions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + ix) * 0.01;

            // Connect nearby points
            for (let j = i + 1; j < particlesCount; j++) {
                const jx = positions[j * 3];
                const jy = positions[j * 3 + 1];
                const jz = positions[j * 3 + 2];

                const dx = ix - jx;
                const dy = iy - jy;
                const dz = iz - jz;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 15) {
                    linePositions[lineIdx++] = ix;
                    linePositions[lineIdx++] = iy;
                    linePositions[lineIdx++] = iz;
                    linePositions[lineIdx++] = jx;
                    linePositions[lineIdx++] = jy;
                    linePositions[lineIdx++] = jz;
                }
            }
        }

        geometry.attributes.position.needsUpdate = true;
        lineGeometry.setDrawRange(0, lineIdx);
        lineGeometry.attributes.position.needsUpdate = true;

        // Mouse follow effect
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 100;
    mouseY = (e.clientY - window.innerHeight / 2) / 100;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
