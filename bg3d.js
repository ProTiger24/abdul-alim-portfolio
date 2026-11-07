
// ============================================================
// SUBTLE 3D ANIMATED BACKGROUND (Three.js)
// Fixed Camera + No Mouse Parallax + Lightweight Animation
// ============================================================

function startBg3d() {
    if (typeof THREE === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // ---------- Canvas & Renderer ----------
    const canvas = document.createElement('canvas');
    canvas.id = 'bg3d';
    canvas.style.cssText =
        'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;';

    // Section background transparent
    const styleTag = document.createElement('style');
    styleTag.textContent =
        'section{background-color:rgba(2,6,23,0.35)!important;}';
    document.head.appendChild(styleTag);

    document.body.prepend(canvas);

    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: !isMobile,
            powerPreference: 'low-power'
        });
    } catch (err) {
        canvas.remove();
        startFallback2D();
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ---------- Scene & Fixed Camera ----------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);

    // ---------- Particle Sprite ----------
    function makeSprite() {
        const c = document.createElement('canvas');
        c.width = c.height = 64;

        const ctx = c.getContext('2d');

        const gradient = ctx.createRadialGradient(
            32, 32, 0,
            32, 32, 32
        );

        gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.35, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        return new THREE.CanvasTexture(c);
    }

    // ---------- Particles ----------
    const COUNT = isMobile ? 120 : 380;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const cyan = new THREE.Color('#22d3ee');
    const indigo = new THREE.Color('#818cf8');

    for (let i = 0; i < COUNT; i++) {
        positions[i * 3] =
            (Math.random() - 0.5) * 60;

        positions[i * 3 + 1] =
            (Math.random() - 0.5) * 40;

        positions[i * 3 + 2] =
            (Math.random() - 0.5) * 40;

        const color = cyan.clone().lerp(indigo, Math.random());

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    particleGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.20 : 0.22,
        map: makeSprite(),
        vertexColors: true,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
    );

    scene.add(particles);

    // ---------- Floating Wireframe Shapes ----------
    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    const shapeDefs = [
        {
            geo: new THREE.IcosahedronGeometry(2.2, 0),
            color: '#22d3ee',
            x: -11, y: 4, z: -5
        },
        {
            geo: new THREE.TorusKnotGeometry(1.3, 0.38, 80, 10),
            color: '#818cf8',
            x: 11, y: 0, z: -4
        },
        {
            geo: new THREE.OctahedronGeometry(1.9, 0),
            color: '#38bdf8',
            x: -10, y: -9, z: -6
        },
        {
            geo: new THREE.TorusGeometry(1.8, 0.5, 10, 28),
            color: '#a78bfa',
            x: 10, y: -15, z: -5
        },
        {
            geo: new THREE.IcosahedronGeometry(1.6, 1),
            color: '#22d3ee',
            x: -11, y: -22, z: -5
        },
        {
            geo: new THREE.OctahedronGeometry(2.1, 0),
            color: '#818cf8',
            x: 11, y: -28, z: -6
        }
    ];

    const shapes = shapeDefs.map((d, i) => {
        const material = new THREE.MeshBasicMaterial({
            color: d.color,
            wireframe: true,
            transparent: true,
            opacity: 0.16
        });

        const mesh = new THREE.Mesh(d.geo, material);

        mesh.position.set(d.x, d.y, d.z);

        mesh.userData = {
            baseX: d.x,
            baseY: d.y,
            baseXOrig: d.x,
            speed: 0.15 + (i % 3) * 0.08,
            phase: i * 1.3
        };

        shapeGroup.add(mesh);

        return mesh;
    });

    // ---------- Resize ----------
    function onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        // Responsive shape positioning
        const scale = Math.min(
            1,
            Math.max(0.35, camera.aspect / 1.78)
        );

        shapes.forEach(shape => {
            shape.userData.baseX =
                shape.userData.baseXOrig * scale;
        });

        if (reduceMotion) {
            renderer.render(scene, camera);
        }
    }

    window.addEventListener('resize', onResize);
    onResize();

    // ---------- Animation ----------
    const clock = new THREE.Clock();

    let rafId = null;

    function animate() {
        if (document.hidden) {
            rafId = null;
            return;
        }

        rafId = requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Very slow particle rotation
        // No mouse interaction
        particles.rotation.y = time * 0.008;
        particles.rotation.x = 0;

        // Subtle autonomous shape animation
        shapes.forEach(shape => {
            const data = shape.userData;

            shape.rotation.x =
                time * data.speed * 0.35;

            shape.rotation.y =
                time * data.speed * 0.45;

            shape.position.x =
                data.baseX +
                Math.sin(time * 0.18 + data.phase) * 0.18;

            shape.position.y =
                data.baseY +
                Math.cos(time * 0.20 + data.phase) * 0.22;
        });

        // Fixed camera - no mouse or scroll parallax
        camera.position.set(0, 0, 14);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    if (reduceMotion) {
        renderer.render(scene, camera);
    } else {
        animate();

        // Stop animation when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            } else if (rafId === null) {
                animate();
            }
        });
    }

    console.info('[bg3d] Subtle 3D background started');
}


// ============================================================
// FALLBACK: 2D PARTICLE NETWORK
// Used when WebGL is unavailable
// ============================================================

function startFallback2D() {
    const reduceMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isMobile = window.innerWidth < 768;

    const canvas = document.createElement('canvas');
    canvas.id = 'bg3d';

    canvas.style.cssText =
        'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;';

    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        canvas.remove();
        return;
    }

    let width;
    let height;
    let dpr;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    window.addEventListener('resize', resize);

    // Lightweight particle count
    const N = isMobile ? 28 : 55;

    const points = [];

    for (let i = 0; i < N; i++) {
        points.push({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2,

            color: Math.random() < 0.5
                ? '34,211,238'
                : '129,140,248'
        });
    }

    // No mouse movement or scroll interaction
    let angle = 0;
    let rafId = null;

    function frame() {
        if (document.hidden) {
            rafId = null;
            return;
        }

        angle += 0.0007;

        ctx.clearRect(0, 0, width, height);

        const ay = angle;
        const ax = 0;

        const cosY = Math.cos(ay);
        const sinY = Math.sin(ay);

        const cosX = Math.cos(ax);
        const sinX = Math.sin(ax);

        const spread = Math.max(width, height) * 0.62;
        const focal = 2.6;

        const projected = points.map(point => {
            // Rotate around Y
            let x = point.x * cosY + point.z * sinY;
            let z = -point.x * sinY + point.z * cosY;

            // Rotate around X
            let y = point.y * cosX - z * sinX;
            z = point.y * sinX + z * cosX;

            const scale = focal / (focal + z);

            const px =
                width / 2 + x * spread * scale;

            const py =
                height / 2 + y * spread * scale * 0.8;

            return {
                px,
                py,
                scale,
                color: point.color
            };
        });

        // ---------- Connecting Lines ----------
        const maxDistance = isMobile ? 120 : 170;

        for (let i = 0; i < projected.length; i++) {
            for (let j = i + 1; j < projected.length; j++) {
                const dx = projected[i].px - projected[j].px;
                const dy = projected[i].py - projected[j].py;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity =
                        (1 - distance / maxDistance) *
                        0.22 *
                        Math.min(
                            projected[i].scale,
                            projected[j].scale
                        );

                    ctx.strokeStyle =
                        'rgba(' + projected[i].color + ',' +
                        opacity.toFixed(3) + ')';

                    ctx.lineWidth = 1;

                    ctx.beginPath();

                    ctx.moveTo(
                        projected[i].px,
                        projected[i].py
                    );

                    ctx.lineTo(
                        projected[j].px,
                        projected[j].py
                    );

                    ctx.stroke();
                }
            }
        }

        // ---------- Particle Dots ----------
        projected.forEach(point => {
            const radius = Math.max(1.2, point.scale * 2.8);

            ctx.beginPath();

            ctx.fillStyle =
                'rgba(' + point.color + ',' +
                Math.min(0.55, 0.28 + point.scale * 0.18).toFixed(2) +
                ')';

            ctx.arc(
                point.px,
                point.py,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });

        if (!reduceMotion) {
            rafId = requestAnimationFrame(frame);
        }
    }

    frame();

    // Pause when browser tab is hidden
    if (!reduceMotion) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            } else if (rafId === null) {
                frame();
            }
        });
    }

    console.info('[bg3d] Lightweight 2D fallback started');
}


// ============================================================
// AUTO LOAD THREE.JS
// ============================================================

(function () {
    if (typeof THREE !== 'undefined') {
        startBg3d();
        return;
    }

    const script = document.createElement('script');

    script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

    script.onload = startBg3d;

    script.onerror = () => {
        console.warn(
            '[bg3d] Three.js load failed. Starting 2D fallback.'
        );

        startFallback2D();
    };

    document.head.appendChild(script);
})();
