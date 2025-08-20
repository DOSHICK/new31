

document.addEventListener('DOMContentLoaded', () => {
    const SPEED = 40;
    const SMALL_SCREEN_MAX_WIDTH = 768;

    let supportsPassive = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get() { supportsPassive = true; }
        });
        window.addEventListener('test', null, opts);
        window.removeEventListener('test', null, opts);
    } catch (e) { }
    const listenerOpts = supportsPassive ? { passive: true } : false;

    window.addEventListener('load', () => {
        document
            .querySelectorAll('.style_horizontalScroll__dQami')
            .forEach(container => {
                const content = container.querySelector('.style_content__-kolu');
                if (!content) return;

                let touchStartX = 0;
                let touchStartY = 0;
                let touchStartScrollX = 0;
                let isTouching = false;
                let isPaused = false;
                let isStopped = false;

                const onTouchStart = e => {
                    if (window.innerWidth > SMALL_SCREEN_MAX_WIDTH) return;
                    const t = e.touches[0];
                    touchStartX = t.clientX;
                    touchStartY = t.clientY;
                    isTouching = true;
                    isPaused = true;
                    const tf = content.style.transform;
                    const parsed = parseFloat(
                        tf.replace(/^translateX\(/, '').replace(/px\)$/, '')
                    );
                    touchStartScrollX = isNaN(parsed) ? 0 : parsed;
                };

                const onTouchMove = e => {
                    if (!isTouching) return;
                    const t = e.touches[0];
                    const deltaX = t.clientX - touchStartX;
                    content.style.transform =
                        `translateX(${touchStartScrollX + deltaX}px)`;
                };

                const onTouchEnd = () => {
                    if (!isTouching) return;
                    isTouching = false;
                    isPaused = false;
                };

                content.addEventListener('touchstart', onTouchStart, listenerOpts);
                content.addEventListener('touchmove', onTouchMove, listenerOpts);
                content.addEventListener('touchend', onTouchEnd, listenerOpts);

                content.addEventListener('mouseenter', () => { isPaused = true; });
                content.addEventListener('mouseleave', () => { isPaused = false; });

                const originals = Array.from(content.children);
                if (originals.length === 0) return;

                const originalWidth = originals
                    .map(el => el.getBoundingClientRect().width)
                    .reduce((sum, w) => sum + w, 0);

                const viewportWidth = container.getBoundingClientRect().width;
                const repeats = Math.max(
                    2,
                    Math.ceil(viewportWidth / originalWidth) + 1
                );
                const groupHTML = originals.map(el => el.outerHTML).join('');
                content.innerHTML = groupHTML.repeat(repeats);

                function attachOverlayHandlers() {
                    const wrappers = content.querySelectorAll(
                        '.style_chainItemWrapper__nDlDt'
                    );
                    wrappers.forEach(wrapper => {
                        if (wrapper.__overlayHandlersAttached) return;
                        wrapper.__overlayHandlersAttached = true;

                        wrapper.addEventListener('mouseenter', () => {
                            const item = wrapper.querySelector(
                                '.style_chainItem__5rS6Y'
                            );
                            if (!item) return;
                            const title = item.getAttribute('title') || '';
                            const overlay = document.createElement('div');
                            overlay.className = 'style_hoverOverlay__-Wnrv';
                            overlay.innerHTML = `<div class="style_semiCircle__pRq7T"></div><span class="style_chainName__LT3MP">${title}</span>`;
                            wrapper.appendChild(overlay);
                        });

                        wrapper.addEventListener('mouseleave', () => {
                            const overlay = wrapper.querySelector(
                                '.style_hoverOverlay__-Wnrv'
                            );
                            if (overlay) wrapper.removeChild(overlay);
                        });
                    });
                }

                attachOverlayHandlers();

                const dir = container.classList.contains('reverse') ? 1 : -1;
                let x = dir < 0 ? 0 : -originalWidth;
                content.style.transform = `translateX(${x}px)`;

                let lastTime = performance.now();

                function step(ts) {
                    if (isStopped) return;

                    const delta = (ts - lastTime) / 1000;
                    lastTime = ts;

                    if (!isPaused) {
                        x += dir * SPEED * delta;

                        if (dir < 0 && x <= -originalWidth) {
                            x += originalWidth;
                        } else if (dir > 0 && x >= 0) {
                            x -= originalWidth;
                        }

                        content.style.transform = `translateX(${x}px)`;
                    }

                    attachOverlayHandlers();
                    requestAnimationFrame(step);
                }

                requestAnimationFrame(step);

                container._hScroll = {
                    stop() {
                        isStopped = true;
                    },
                    start() {
                        if (!isStopped) return;
                        isStopped = false;
                        lastTime = performance.now();
                        requestAnimationFrame(step);
                    },
                    pause() {
                        isPaused = true;
                    },
                    resume() {
                        isPaused = false;
                    }
                };

                const io = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            container._hScroll.start();
                        } else {
                            container._hScroll.stop();
                        }
                    });
                }, {
                    root: null,
                    threshold: 0
                });

                io.observe(container);
            });
    });




});




document.addEventListener('DOMContentLoaded', () => {
    const appleBlocks = document.querySelectorAll('.appleChanger');
    const androidBlocks = document.querySelectorAll('.androidChanger');

    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/i.test(ua);

    function show(elList) {
        elList.forEach(el => { el.style.display = ''; });
    }

    function hide(elList) {
        elList.forEach(el => { el.style.display = 'none'; });
    }

    if (isAndroid) {
        show(androidBlocks);
        hide(appleBlocks);
    }
    else if (isIOS) {
        show(appleBlocks);
        hide(androidBlocks);
    }
    else {
        show(appleBlocks);
        show(androidBlocks);
    }
});
