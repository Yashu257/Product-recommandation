/* =============================================================
   Nova · Dashboard — 3D floating card navigation
   - Spring-driven rotation around an invisible 3D circle
   - Drag / swipe / arrow keys / wheel
   - Mouse parallax on the whole scene
   - Hover + click-to-expand on the front card
   Vanilla JS, single requestAnimationFrame loop, ~60fps.
   ============================================================= */

(function () {
    "use strict";

    const DEG2RAD = Math.PI / 180;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Geometry / feel constants ---------- */
    const RADIUS_X   = 300;   // horizontal spread of the circle
    const RADIUS_Z   = 300;   // depth of the circle
    const Y_OFFSET   = 46;    // front sits lower, back sits higher
    const MAX_TILT   = 38;    // coverflow tilt for side cards (deg)
    const MIN_SCALE  = 0.68;  // back card
    const MAX_SCALE  = 1.12;  // front card
    const MAX_BLUR   = 6;     // back card blur (px)
    const STIFFNESS  = 0.055; // spring pull
    const DAMPING    = 0.80;  // spring damping
    const DRAG_DEG   = 0.32;  // degrees rotated per px dragged
    const HOVER_TZ   = 46;    // extra depth when hovering front
    const HOVER_SC   = 1.06;  // extra scale when hovering front

    /* ---------- DOM ---------- */
    const scene    = document.getElementById("scene");
    const carousel = document.getElementById("carousel");
    const cardEls  = Array.prototype.slice.call(document.querySelectorAll(".card3d"));
    const detail   = document.getElementById("detail");
    const detailClose = document.getElementById("detailClose");

    if (!scene || !carousel || cardEls.length === 0) return;

    const cards = cardEls.map(function (el, i) {
        return { el: el, base: i * 90, hover: false };
    });

    /* ---------- State ---------- */
    const state = {
        rotation: 0,        // current animated angle (deg)
        target: 0,          // spring target (multiple of 90 at rest)
        velocity: 0,
        sceneRX: 0, sceneRY: 0,      // current parallax
        sceneTX: 0, sceneTY: 0,      // parallax targets
        dragging: false,
        startX: 0, startY: 0,
        startRotation: 0,
        lastX: 0,
        moved: 0,
        startTime: 0,
        pointerId: null,
        detailOpen: false,
        wheelLockedUntil: 0,
    };

    /* =============================================================
       Rotation helpers
       ============================================================= */
    function step(dir) {
        // dir -1 = swipe left, +1 = swipe right
        state.target += dir * 90;
    }

    function snap() {
        state.target = Math.round(state.target / 90) * 90;
    }

    /* Index of the card currently closest to the front (angle ~ 0). */
    function frontCard() {
        let best = null;
        let bestCos = -Infinity;
        for (const c of cards) {
            const cos = Math.cos((c.base + state.rotation) * DEG2RAD);
            if (cos > bestCos) { bestCos = cos; best = c; }
        }
        return best;
    }

    /* =============================================================
       Render (called every frame)
       ============================================================= */
    function render() {
        const front = frontCard();

        for (const c of cards) {
            const a = (c.base + state.rotation) * DEG2RAD;
            const sin = Math.sin(a);
            const cos = Math.cos(a);
            const depth = (cos + 1) / 2;             // 0 (back) .. 1 (front)

            const isFront = c === front;
            const boostS = (isFront && c.hover) ? HOVER_SC : 1;
            const boostZ = (isFront && c.hover) ? HOVER_TZ : 0;

            const tx = sin * RADIUS_X;
            const tz = cos * RADIUS_Z + boostZ;
            const ty = cos * Y_OFFSET;
            const ry = -sin * MAX_TILT;
            const scale = (MIN_SCALE + depth * (MAX_SCALE - MIN_SCALE)) * boostS;

            c.el.style.transform =
                "translate(-50%, -50%)" +
                " translateX(" + tx.toFixed(2) + "px)" +
                " translateY(" + ty.toFixed(2) + "px)" +
                " translateZ(" + tz.toFixed(2) + "px)" +
                " rotateY(" + ry.toFixed(2) + "deg)" +
                " scale(" + scale.toFixed(3) + ")";

            c.el.style.opacity = (0.35 + depth * 0.65).toFixed(3);
            c.el.style.filter =
                "blur(" + ((1 - depth) * MAX_BLUR).toFixed(2) + "px)" +
                " brightness(" + (0.6 + depth * 0.55).toFixed(3) + ")";
            c.el.style.zIndex = String(Math.round(depth * 100));

            c.el.classList.toggle("is-front", isFront);
            c.el.classList.toggle("is-hover", isFront && c.hover);
        }
    }

    /* =============================================================
       Animation loop — spring + parallax
       ============================================================= */
    function tick() {
        // Spring toward target
        const diff = state.target - state.rotation;
        const force = diff * STIFFNESS;
        state.velocity = (state.velocity + force) * DAMPING;
        state.rotation += state.velocity;

        // Ease scene parallax
        state.sceneRX += (state.sceneTX - state.sceneRX) * 0.06;
        state.sceneRY += (state.sceneTY - state.sceneRY) * 0.06;
        carousel.style.transform =
            "rotateX(" + state.sceneRX.toFixed(2) + "deg)" +
            " rotateY(" + state.sceneRY.toFixed(2) + "deg)";

        render();
        requestAnimationFrame(tick);
    }

    /* =============================================================
       Pointer: drag to rotate + click-to-open
       ============================================================= */
    function onPointerDown(e) {
        if (state.detailOpen) return;
        state.dragging = true;
        state.pointerId = e.pointerId;
        state.startX = state.lastX = e.clientX;
        state.startY = e.clientY;
        state.startRotation = state.target;
        state.moved = 0;
        state.startTime = performance.now();
        scene.classList.add("is-grabbing");
        try { scene.setPointerCapture(e.pointerId); } catch (_) {}
    }

    function onPointerMove(e) {
        // Parallax follows the pointer whenever it moves over the scene
        if (!state.dragging) {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            state.sceneTY = nx * 6;    // rotateY from horizontal position
            state.sceneTX = -ny * 5;   // rotateX from vertical position
            return;
        }

        const dx = e.clientX - state.startX;
        state.moved = Math.max(state.moved, Math.abs(dx) + Math.abs(e.clientY - state.startY));
        state.lastX = e.clientX;
        state.target = state.startRotation + dx * DRAG_DEG;
    }

    function onPointerUp(e) {
        if (!state.dragging) return;
        state.dragging = false;
        scene.classList.remove("is-grabbing");
        try { scene.releasePointerCapture(e.pointerId); } catch (_) {}

        const dx = e.clientX - state.startX;
        const dt = performance.now() - state.startTime;

        // Tap (barely moved) → open the front card's detail page
        if (state.moved < 8 && dt < 400) {
            const front = frontCard();
            if (front && front.el.contains(e.target)) {
                openDetail(front);
            }
            snap();
            return;
        }

        // Quick flick with little travel → force exactly one step
        if (dt < 260 && Math.abs(dx) > 30 && Math.abs(dx) < 220) {
            state.target = state.startRotation + (dx > 0 ? 90 : -90);
        }
        snap();
    }

    scene.addEventListener("pointerdown", onPointerDown);
    scene.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // Reset parallax when the pointer leaves the window
    document.addEventListener("mouseleave", function () {
        state.sceneTX = 0;
        state.sceneTY = 0;
    });

    /* ---------- Hover flags on each card ---------- */
    cards.forEach(function (c) {
        c.el.addEventListener("pointerenter", function () { c.hover = true; });
        c.el.addEventListener("pointerleave", function () { c.hover = false; });
    });

    /* =============================================================
       Wheel to rotate
       ============================================================= */
    scene.addEventListener("wheel", function (e) {
        if (state.detailOpen) return;
        e.preventDefault();
        const now = performance.now();
        if (now < state.wheelLockedUntil) return;
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 8) return;
        step(delta > 0 ? 1 : -1);
        state.wheelLockedUntil = now + 320;
    }, { passive: false });

    /* =============================================================
       Keyboard
       ============================================================= */
    window.addEventListener("keydown", function (e) {
        if (state.detailOpen) {
            if (e.key === "Escape") closeDetail();
            return;
        }
        if (e.key === "ArrowLeft")  { step(-1); e.preventDefault(); }
        if (e.key === "ArrowRight") { step(1);  e.preventDefault(); }
        if (e.key === "Enter" || e.key === " ") {
            const front = frontCard();
            if (front) { openDetail(front); e.preventDefault(); }
        }
    });

    /* =============================================================
       Detail page open / close
       ============================================================= */
    function openDetail(card) {
        if (!detail) return;
        const data = card.el.dataset;
        detail.style.setProperty("--accent-a", getComputedStyle(card.el).getPropertyValue("--accent-a"));
        detail.style.setProperty("--accent-b", getComputedStyle(card.el).getPropertyValue("--accent-b"));

        detail.querySelector("[data-slot='title']").textContent = data.title || "Module";
        detail.querySelector("[data-slot='sub']").textContent = data.sub || "";
        detail.querySelector("[data-slot='badge']").innerHTML =
            card.el.querySelector(".card3d__icon").innerHTML;

        // Randomised placeholder bar chart
        const bars = detail.querySelector(".detail__bars");
        bars.innerHTML = "";
        for (let i = 0; i < 14; i++) {
            const bar = document.createElement("i");
            const h = 20 + Math.round(Math.random() * 80);
            bar.style.height = h + "%";
            bar.style.animationDelay = (i * 0.04) + "s";
            bars.appendChild(bar);
        }

        state.detailOpen = true;
        detail.classList.add("is-open");
        detail.setAttribute("aria-hidden", "false");
    }

    function closeDetail() {
        if (!detail) return;
        state.detailOpen = false;
        detail.classList.remove("is-open");
        detail.setAttribute("aria-hidden", "true");
    }

    if (detailClose) detailClose.addEventListener("click", closeDetail);
    if (detail) {
        detail.addEventListener("click", function (e) {
            if (e.target === detail) closeDetail();
        });
    }

    /* =============================================================
       Background particle field
       ============================================================= */
    (function particles() {
        const canvas = document.getElementById("dashParticles");
        if (!canvas || reduceMotion) return;
        const ctx = canvas.getContext("2d");
        const COLORS = ["#7c5cff", "#4da3ff", "#2af5d0"];
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0, h = 0, pts = [];

        function resize() {
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = Math.min(110, Math.floor((w * h) / 15000));
            pts = Array.from({ length: n }, function () {
                return {
                    x: Math.random() * w, y: Math.random() * h,
                    r: Math.random() * 1.7 + 0.4,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    a: Math.random() * 0.5 + 0.15,
                    c: COLORS[(Math.random() * COLORS.length) | 0],
                };
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (const p of pts) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
                ctx.globalAlpha = p.a;
                ctx.fillStyle = p.c;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }

        let t;
        window.addEventListener("resize", function () {
            clearTimeout(t); t = setTimeout(resize, 150);
        });
        resize();
        draw();
    })();

    /* ---------- Go ---------- */
    requestAnimationFrame(tick);
})();
