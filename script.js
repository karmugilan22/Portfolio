document.addEventListener('DOMContentLoaded', () => {

    const bar = document.getElementById('prog-bar');
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
        if (bar) bar.style.width = pct + '%';
    }, { passive: true });

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const rnd = (a, b) => a + Math.random() * (b - a);

        function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Dot {
            constructor() { this.r(); }
            r() {
                this.x = rnd(0, canvas.width); this.y = rnd(0, canvas.height);
                this.rad = rnd(0.6, 1.8); this.dx = rnd(-.25, .25); this.dy = rnd(-.25, .25);
                this.a = rnd(.1, .4);
            }
            move() {
                this.x += this.dx; this.y += this.dy;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.r();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(14,165,233,${this.a})`;
                ctx.fill();
            }
        }

        const dots = Array.from({ length: 70 }, () => new Dot());

        (function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(d => { d.move(); d.draw(); });
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(14,165,233,${.06 * (1 - dist / 90)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(loop);
        })();
    }

    const revealEls = document.querySelectorAll('.reveal');
    const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => ro.observe(el));

    const fills = document.querySelectorAll('.sk-fill');
    fills.forEach(el => { el.dataset.w = el.getAttribute('data-w') || '0'; el.style.width = '0'; });
    const so = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                document.querySelectorAll('.sk-fill').forEach(f => { f.style.width = f.dataset.w + '%'; });
                so.disconnect();
            }
        });
    }, { threshold: 0.2 });
    const skillSec = document.getElementById('skills');
    if (skillSec) so.observe(skillSec);

    const statNums = document.querySelectorAll('.stat-n');
    const co = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const target = +e.target.getAttribute('data-to');
                let n = 0;
                const step = Math.ceil(target / 25);
                const t = setInterval(() => {
                    n = Math.min(n + step, target);
                    e.target.textContent = n;
                    if (n >= target) clearInterval(t);
                }, 44);
                co.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    statNums.forEach(n => co.observe(n));

    const nc = document.querySelector('.navbar-collapse');
    document.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => {
            if (nc?.classList.contains('show')) bootstrap.Collapse.getInstance(nc)?.hide();
        });
    });
});
