// ============================================================
// 3D ANIMATED BACKGROUND (Three.js)
// Particles + floating wireframe shapes + mouse/scroll parallax
// ============================================================

function startBg3d() {
    if (typeof THREE === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // ---------- Canvas & Renderer ----------
    const canvas = document.createElement('canvas');
    canvas.id = 'bg3d';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;';

    // সেকশনের solid background স্বচ্ছ করা, যাতে 3D দেখা যায়
    const styleTag = document.createElement('style');
    styleTag.textContent = 'section{background-color:rgba(2,6,23,0.35)!important;}';
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
        startFallback2D(); // WebGL না থাকলে 2D fallback
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.z = 14;

    // ---------- Particles ----------
    function makeSprite() {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }

    const COUNT = isMobile ? 350 : 900;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cyan = new THREE.Color('#22d3ee');
    const indigo = new THREE.Color('#818cf8');

    for (let i = 0; i < COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        const c = cyan.clone().lerp(indigo, Math.random());
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
        size: isMobile ? 0.36 : 0.3,
        map: makeSprite(),
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ---------- Floating wireframe shapes ----------
    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    const shapeDefs = [
        { geo: new THREE.IcosahedronGeometry(2.2, 0),        color: '#22d3ee', x: -11, y:  4,  z: -5 },
        { geo: new THREE.TorusKnotGeometry(1.3, 0.38, 80, 10), color: '#818cf8', x:  11, y:  0,  z: -4 },
        { geo: new THREE.OctahedronGeometry(1.9, 0),         color: '#38bdf8', x: -10, y: -9,  z: -6 },
        { geo: new THREE.TorusGeometry(1.8, 0.5, 10, 28),     color: '#a78bfa', x:  10, y: -15, z: -5 },
        { geo: new THREE.IcosahedronGeometry(1.6, 1),        color: '#22d3ee', x: -11, y: -22, z: -5 },
        { geo: new THREE.OctahedronGeometry(2.1, 0),         color: '#818cf8', x:  11, y: -28, z: -6 }
    ];

    const shapes = shapeDefs.map((d, i) => {
        const mat = new THREE.MeshBasicMaterial({
            color: d.color,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const mesh = new THREE.Mesh(d.geo, mat);
        mesh.position.set(d.x, d.y, d.z);
        mesh.userData = {
            baseX: d.x,
            baseY: d.y,
            speed: 0.15 + (i % 3) * 0.08,
            phase: i * 1.3
        };
        shapeGroup.add(mesh);
        return mesh;
    });

    // ---------- Interaction ----------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollY = window.scrollY;

    window.addEventListener('pointermove', (e) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    // ---------- Resize ----------
    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);

        // ছোট স্ক্রিনে shape গুলো ভেতরের দিকে আনা
        const k = Math.min(1, Math.max(0.35, camera.aspect / 1.78));
        shapes.forEach(s => { s.userData.baseX = s.userData.baseXOrig !== undefined
            ? s.userData.baseXOrig * k
            : (s.userData.baseXOrig = s.userData.baseX, s.userData.baseX * k); });

        if (reduceMotion) renderer.render(scene, camera);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // ---------- Animation loop ----------
    const clock = new THREE.Clock();
    let rafId = null;

    function animate() {
        rafId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // smooth mouse
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;

        // particles: ধীরে ঘোরা + scroll parallax
        particles.rotation.y = t * 0.02 + mouse.x * 0.15;
        particles.rotation.x = mouse.y * 0.08;
        particles.position.y = scrollY * 0.003;

        // shapes: নিজে ঘোরা + ভাসা
        shapes.forEach((s) => {
            const u = s.userData;
            s.rotation.x = t * u.speed;
            s.rotation.y = t * u.speed * 1.3;
            s.position.x = u.baseX + Math.sin(t * 0.4 + u.phase) * 0.6;
            s.position.y = u.baseY + Math.cos(t * 0.5 + u.phase) * 0.8;
        });

        // স্ক্রল করলে shape গুলো উপরে উঠবে (পেজের সাথে সাথে)
        shapeGroup.position.y = scrollY * 0.012;

        // camera mouse parallax
        camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.03;
        camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    if (reduceMotion) {
        // Reduced motion: শুধু একটা স্থির ফ্রেম
        renderer.render(scene, camera);
    } else {
        animate();

        // ট্যাব হিডেন থাকলে বন্ধ রাখা (battery/CPU বাঁচাবে)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
                rafId = null;
            } else if (!rafId) {
                clock.getDelta();
                animate();
            }
        });
    }

    console.info('[bg3d] 3D background started');
}


// ============================================================
// FALLBACK: WebGL না থাকলে 2D canvas দিয়ে pseudo-3D particle network
// ============================================================

function startFallback2D() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const canvas = document.createElement('canvas');
    canvas.id = 'bg3d';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }

    let w, h, dpr;
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const N = isMobile ? 45 : 95;
    const pts = [];
    for (let i = 0; i < N; i++) {
        pts.push({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2,
            c: Math.random() < 0.5 ? '34,211,238' : '129,140,248'
        });
    }

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollY = window.scrollY;
    window.addEventListener('pointermove', (e) => {
        mouse.tx = (e.clientX / w - 0.5) * 2;
        mouse.ty = (e.clientY / h - 0.5) * 2;
    }, { passive: true });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    let angle = 0;
    let rafId = null;

    function frame() {
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        angle += 0.0018;

        ctx.clearRect(0, 0, w, h);

        const ay = angle + mouse.x * 0.35;
        const ax = mouse.y * 0.25;
        const cy = Math.cos(ay), sy = Math.sin(ay);
        const cx = Math.cos(ax), sx = Math.sin(ax);
        const spread = Math.max(w, h) * 0.62;
        const focal = 2.6;
        const yShift = (scrollY * 0.12) % h;

        const proj = pts.map(p => {
            // rotate around Y, then X
            let x = p.x * cy + p.z * sy;
            let z = -p.x * sy + p.z * cy;
            let y = p.y * cx - z * sx;
            z = p.y * sx + z * cx;

            const scale = focal / (focal + z);
            let px = w / 2 + x * spread * scale;
            let py = h / 2 + y * spread * scale * 0.8 - yShift;
            if (py < -50) py += h + 100;
            return { px, py, scale, c: p.c };
        });

        // lines
        const maxD = isMobile ? 120 : 170;
        for (let i = 0; i < proj.length; i++) {
            for (let j = i + 1; j < proj.length; j++) {
                const dx = proj[i].px - proj[j].px;
                const dy = proj[i].py - proj[j].py;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < maxD) {
                    const a = (1 - d / maxD) * 0.6 * Math.min(proj[i].scale, proj[j].scale);
                    ctx.strokeStyle = 'rgba(' + proj[i].c + ',' + a.toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(proj[i].px, proj[i].py);
                    ctx.lineTo(proj[j].px, proj[j].py);
                    ctx.stroke();
                }
            }
        }

        // dots
        proj.forEach(q => {
            const r = Math.max(1.2, q.scale * 2.8);
            ctx.beginPath();
            ctx.fillStyle = 'rgba(' + q.c + ',' + Math.min(0.95, 0.55 + q.scale * 0.35).toFixed(2) + ')';
            ctx.arc(q.px, q.py, r, 0, Math.PI * 2);
            ctx.fill();
        });

        if (!reduceMotion) rafId = requestAnimationFrame(frame);
    }

    frame();

    if (!reduceMotion) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(rafId);
                rafId = null;
            } else if (!rafId) {
                frame();
            }
        });
    }

    console.info('[bg3d] WebGL পাওয়া যায়নি, 2D fallback চালু হয়েছে');
}

// Three.js না থাকলে নিজেই CDN থেকে লোড করে নেবে
(function () {
    if (typeof THREE !== 'undefined') { startBg3d(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = startBg3d;
    s.onerror = () => { console.warn('[bg3d] Three.js load হয়নি, 2D fallback চালু'); startFallback2D(); };
    document.head.appendChild(s);
})();
