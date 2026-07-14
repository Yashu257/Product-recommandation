/* =============================================================
   Nova · Login interactions
   - Show / hide password
   - Card parallax on mouse move
   - Floating particle field on canvas
   ============================================================= */

(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ----------------------------------------------------------
       1. Show / hide password
       ---------------------------------------------------------- */
    const toggle = document.getElementById("togglePassword");
    const password = document.getElementById("password");

    if (toggle && password) {
        toggle.addEventListener("click", function () {
            const isHidden = password.type === "password";
            password.type = isHidden ? "text" : "password";
            toggle.classList.toggle("is-visible", isHidden);
            toggle.setAttribute("aria-pressed", String(isHidden));
            toggle.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );
            password.focus({ preventScroll: true });
        });
    }

    /* ----------------------------------------------------------
       2. Parallax tilt on the login card
       ---------------------------------------------------------- */
    const card = document.getElementById("loginCard");

    if (card && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
        const MAX_TILT = 6; // degrees
        let frame = null;

        window.addEventListener("mousemove", function (e) {
            if (frame) return;
            frame = requestAnimationFrame(function () {
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                const dx = (e.clientX - cx) / cx; // -1 .. 1
                const dy = (e.clientY - cy) / cy;

                card.style.transform =
                    "rotateY(" + dx * MAX_TILT + "deg) " +
                    "rotateX(" + -dy * MAX_TILT + "deg)";
                frame = null;
            });
        });

        window.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    }

    /* ----------------------------------------------------------
       3. Floating particle field
       ---------------------------------------------------------- */
    const canvas = document.getElementById("particles");

    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext("2d");
        const COLORS = ["#7c5cff", "#4da3ff", "#2af5d0"];
        let particles = [];
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(90, Math.floor((width * height) / 16000));
            particles = Array.from({ length: count }, createParticle);
        }

        function createParticle() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.8 + 0.4,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                a: Math.random() * 0.5 + 0.2,
                color: COLORS[(Math.random() * COLORS.length) | 0],
            };
        }

        function tick() {
            ctx.clearRect(0, 0, width, height);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.a;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(tick);
        }

        let resizeTimer;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });

        resize();
        tick();
    }
})();
