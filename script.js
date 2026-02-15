/* ========================================
   Bonelag Portfolio - JavaScript
   anime.js powered animations
   ======================================== */

(function () {
    'use strict';

    // ==========================================
    // 1. DOT GRID ANIMATION (anime.js hero effect)
    // ==========================================
    function createDotGrid() {
        const container = document.getElementById('dot-grid');
        if (!container) return;

        // Calculate grid dimensions based on viewport
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const spacing = vw > 768 ? 32 : 24;
        const cols = Math.floor(vw / spacing);
        const rows = Math.floor(vh / spacing);
        const totalDots = cols * rows;

        // Set grid template
        container.style.gridTemplateColumns = `repeat(${cols}, ${spacing}px)`;
        container.style.gridTemplateRows = `repeat(${rows}, ${spacing}px)`;

        // Create dots
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.dataset.col = i % cols;
            dot.dataset.row = Math.floor(i / cols);
            fragment.appendChild(dot);
        }
        container.appendChild(fragment);

        return { cols, rows, totalDots };
    }

    function animateDotGrid(gridInfo) {
        if (!gridInfo) return;
        const { cols, rows } = gridInfo;

        // Animation palette
        const colors = ['#ff2d75', '#b44dff', '#00e5ff', '#4d7dff', '#ffd600'];

        // Initial wave animation
        anime({
            targets: '.dot',
            scale: [
                { value: 0, duration: 0 },
                { value: 1, duration: 800 }
            ],
            opacity: [
                { value: 0, duration: 0 },
                { value: 0.3, duration: 800 }
            ],
            delay: anime.stagger(15, {
                grid: [cols, rows],
                from: 'center'
            }),
            easing: 'easeOutExpo',
            complete: function () {
                startContinuousAnimation(cols, rows, colors);
            }
        });
    }

    function startContinuousAnimation(cols, rows, colors) {
        // Continuous ripple animation
        function doRipple() {
            const centerX = Math.random() * cols;
            const centerY = Math.random() * rows;
            const color = colors[Math.floor(Math.random() * colors.length)];

            anime({
                targets: '.dot',
                backgroundColor: [
                    { value: color, duration: 600 },
                    { value: '#b44dff', duration: 1200 }
                ],
                scale: [
                    { value: 1.8, duration: 400 },
                    { value: 1, duration: 800 }
                ],
                opacity: [
                    { value: 0.8, duration: 400 },
                    { value: 0.2, duration: 800 }
                ],
                delay: anime.stagger(20, {
                    grid: [cols, rows],
                    from: function (el) {
                        const col = parseInt(el.dataset.col);
                        const row = parseInt(el.dataset.row);
                        const dist = Math.sqrt(
                            Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
                        );
                        return dist * 12;
                    }
                }),
                easing: 'easeOutExpo',
                duration: 1600
            });
        }

        // First ripple
        doRipple();
        // Continuous ripples
        setInterval(doRipple, 3500);

        // Mouse interaction
        const container = document.getElementById('dot-grid');
        let lastMouseMove = 0;

        document.addEventListener('mousemove', function (e) {
            const now = Date.now();
            if (now - lastMouseMove < 80) return;
            lastMouseMove = now;

            const dots = container.querySelectorAll('.dot');
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            dots.forEach(function (dot) {
                const rect = dot.getBoundingClientRect();
                const dotX = rect.left + rect.width / 2;
                const dotY = rect.top + rect.height / 2;
                const dist = Math.sqrt(
                    Math.pow(mouseX - dotX, 2) + Math.pow(mouseY - dotY, 2)
                );

                if (dist < 120) {
                    const intensity = 1 - dist / 120;
                    const color = colors[Math.floor(Math.random() * colors.length)];

                    anime({
                        targets: dot,
                        scale: 1 + intensity * 2,
                        opacity: 0.3 + intensity * 0.6,
                        backgroundColor: color,
                        duration: 300,
                        easing: 'easeOutExpo'
                    });

                    // Return to normal
                    anime({
                        targets: dot,
                        scale: 1,
                        opacity: 0.2,
                        backgroundColor: '#b44dff',
                        duration: 1200,
                        delay: 200,
                        easing: 'easeOutExpo'
                    });
                }
            });
        });
    }

    // ==========================================
    // 2. HERO TEXT ANIMATIONS
    // ==========================================
    function animateHeroContent() {
        const tl = anime.timeline({
            easing: 'easeOutExpo'
        });

        // Tag
        tl.add({
            targets: '.hero-tag',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
        }, 400);

        // Title words
        tl.add({
            targets: '.title-word',
            opacity: [0, 1],
            translateY: ['100%', '0%'],
            duration: 1200,
        }, 600);

        tl.add({
            targets: '.title-highlight',
            opacity: [0, 1],
            translateY: ['100%', '0%'],
            duration: 1200,
        }, 800);

        // Subtitle
        tl.add({
            targets: '.hero-subtitle',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
        }, 1200);

        // CTA buttons
        tl.add({
            targets: '.hero-cta',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
        }, 1500);

        // Stats
        tl.add({
            targets: '.hero-stats',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
        }, 1700);

        // Scroll indicator
        tl.add({
            targets: '.scroll-indicator',
            opacity: [0, 0.6],
            translateY: [20, 0],
            duration: 1000,
        }, 2000);

        // Animate stat counters
        setTimeout(animateCounters, 2000);
    }

    // ==========================================
    // 3. COUNTER ANIMATION
    // ==========================================
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(function (el) {
            const target = parseInt(el.dataset.count);
            const obj = { value: 0 };
            anime({
                targets: obj,
                value: target,
                duration: 2000,
                round: 1,
                easing: 'easeOutExpo',
                update: function () {
                    el.textContent = obj.value;
                }
            });
        });
    }

    // ==========================================
    // 4. PROJECT PATTERN ANIMATIONS
    // ==========================================
    function createProjectPatterns() {
        document.querySelectorAll('.project-pattern').forEach(function (pattern) {
            const fragment = document.createDocumentFragment();
            const patternNum = pattern.dataset.pattern;

            const colorSets = {
                '1': ['rgba(180,77,255,0.6)', 'rgba(255,45,117,0.5)', 'rgba(77,125,255,0.4)'],
                '2': ['rgba(0,229,255,0.6)', 'rgba(77,125,255,0.5)', 'rgba(180,77,255,0.4)'],
                '3': ['rgba(255,214,0,0.6)', 'rgba(255,45,117,0.5)', 'rgba(180,77,255,0.4)']
            };

            const pColors = colorSets[patternNum] || colorSets['1'];

            for (let i = 0; i < 48; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.style.background = pColors[Math.floor(Math.random() * pColors.length)];
                cell.style.opacity = (Math.random() * 0.5 + 0.1).toFixed(2);
                fragment.appendChild(cell);
            }

            pattern.appendChild(fragment);
        });

        // Animate project cells on hover
        document.querySelectorAll('.project-card').forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                anime({
                    targets: card.querySelectorAll('.cell'),
                    opacity: function () { return anime.random(30, 80) / 100; },
                    scale: [
                        { value: 1.1, duration: 300 },
                        { value: 1, duration: 600 }
                    ],
                    borderRadius: function () { return anime.random(4, 16) + 'px'; },
                    delay: anime.stagger(20, { from: 'random' }),
                    easing: 'easeOutExpo'
                });
            });
        });
    }

    // ==========================================
    // 5. SCROLL ANIMATIONS
    // ==========================================
    function initScrollAnimations() {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate skill bars
                    const skillFills = entry.target.querySelectorAll('.skill-fill');
                    skillFills.forEach(function (fill) {
                        const width = fill.dataset.width;
                        setTimeout(function () {
                            fill.style.width = width + '%';
                        }, 300);
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        // Directly observe the elements that have opacity: 0
        var selectors = '.section-header, .about-grid, .skills-grid, .projects-grid, .contact-content';
        document.querySelectorAll(selectors).forEach(function (el) {
            observer.observe(el);
        });
    }

    // ==========================================
    // 6. NAVIGATION
    // ==========================================
    function initNavigation() {
        const navbar = document.getElementById('main-nav');
        const toggle = document.getElementById('nav-toggle');
        const links = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile toggle
        if (toggle) {
            toggle.addEventListener('click', function () {
                links.classList.toggle('open');
                toggle.classList.toggle('active');
            });
        }

        // Active link on scroll
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', function () {
            const scrollY = window.scrollY + 200;
            sections.forEach(function (section) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(function (link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        // Close mobile menu on link click
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                links.classList.remove('open');
                toggle.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 7. SMOOTH HOVER EFFECTS
    // ==========================================
    function initHoverEffects() {
        // Magnetic button effect
        document.querySelectorAll('.btn').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', function () {
                anime({
                    targets: btn,
                    translateX: 0,
                    translateY: 0,
                    duration: 600,
                    easing: 'easeOutElastic(1, .5)'
                });
            });
        });
    }

    // ==========================================
    // 8. CUSTOM CURSOR GLOW
    // ==========================================
    function initCursorGlow() {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(180,77,255,0.06) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s;
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', function (e) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    document.addEventListener('DOMContentLoaded', function () {
        const gridInfo = createDotGrid();
        animateDotGrid(gridInfo);
        animateHeroContent();
        createProjectPatterns();
        initScrollAnimations();
        initNavigation();
        initHoverEffects();
        initCursorGlow();
    });

    // Handle resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const container = document.getElementById('dot-grid');
            if (container) {
                container.innerHTML = '';
                const gridInfo = createDotGrid();
                animateDotGrid(gridInfo);
            }
        }, 500);
    });

})();
