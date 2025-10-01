// Dedicated logic for the Referenzen section
// Approach: use a scroll-snap viewport with one active track at a time.
// Benefits: native scrolling on touch, no transform overlays blocking clicks, simple state.

(function() {
  function initReferenzen() {
    const section = document.getElementById('referenzen');
    if (!section) return;

    const filterContainer = section.querySelector('.filter-container');
    const btnVerein = document.getElementById('filter-verein');
    const btnBusiness = document.getElementById('filter-business');
    const viewport = document.getElementById('referenzen-viewport');
    const trackVerein = document.getElementById('track-verein');
    const trackBusiness = document.getElementById('track-business');
    const prevBtn = document.getElementById('ref-prev');
    const nextBtn = document.getElementById('ref-next');
    const pageCurrent = document.getElementById('ref-page-current');
    const pageTotal = document.getElementById('ref-page-total');

    if (!filterContainer || !btnVerein || !btnBusiness || !viewport || !trackVerein || !trackBusiness || !prevBtn || !nextBtn || !pageCurrent || !pageTotal) {
      console.warn('Referenzen: required elements missing');
      return;
    }

    let active = trackVerein.getAttribute('data-active') === 'true' ? 'verein' : 'business';

    function getActiveTrack() {
      return active === 'verein' ? trackVerein : trackBusiness;
    }

    function pages(track) {
      return Array.from(track.querySelectorAll('.slider-page'));
    }

    function currentPageIndex() {
      const track = getActiveTrack();
      const pageEls = pages(track);
      const viewportRect = viewport.getBoundingClientRect();
      let bestIndex = 0;
      let bestDelta = Infinity;
      pageEls.forEach((pg, idx) => {
        const rect = pg.getBoundingClientRect();
        const delta = Math.abs(rect.left - viewportRect.left);
        if (delta < bestDelta) {
          bestDelta = delta;
          bestIndex = idx;
        }
      });
      return bestIndex;
    }

    function updateIndicator() {
      const count = pages(getActiveTrack()).length;
      const index = currentPageIndex();
      pageCurrent.textContent = String(index + 1);
      pageTotal.textContent = String(count);
      const disable = count <= 1;
      prevBtn.disabled = disable;
      nextBtn.disabled = disable;
    }

    function switchCategory(target) {
      if (active === target) return;
      active = target;
      if (active === 'verein') {
        btnVerein.classList.add('active');
        btnBusiness.classList.remove('active');
        filterContainer.classList.add('verein-active');
        trackBusiness.setAttribute('data-active', 'false');
        trackVerein.setAttribute('data-active', 'true');
      } else {
        btnBusiness.classList.add('active');
        btnVerein.classList.remove('active');
        filterContainer.classList.remove('verein-active');
        trackVerein.setAttribute('data-active', 'false');
        trackBusiness.setAttribute('data-active', 'true');
      }
      // Show correct track and snap to its first page
      const activeTrack = getActiveTrack();
      setTimeout(() => {
        const first = pages(activeTrack)[0];
        if (first) first.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        updateIndicator();
      }, 0);
    }

    function go(delta) {
      const activeTrack = getActiveTrack();
      const pageEls = pages(activeTrack);
      if (!pageEls.length) return;
      const i = currentPageIndex();
      const next = (i + delta + pageEls.length) % pageEls.length;
      pageEls[next].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setTimeout(updateIndicator, 250);
    }

  // Make viewport focusable for keyboard navigation
  viewport.setAttribute('tabindex', '0');

  // Wire events
    btnVerein.addEventListener('click', () => switchCategory('verein'));
    btnBusiness.addEventListener('click', () => switchCategory('business'));
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    // Update indicator on scroll (debounced)
    let rafId = 0;
    viewport.addEventListener('scroll', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateIndicator();
      });
    }, { passive: true });

    // Initial indicator sync
    updateIndicator();

    // Ensure cards remain fully interactive
    viewport.style.pointerEvents = 'auto';
    getActiveTrack().style.pointerEvents = 'auto';
    pages(getActiveTrack()).forEach(pg => pg.style.pointerEvents = 'auto');

    // Keyboard navigation
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
    });

    console.log('Referenzen initialized (scroll-snap mode)');
  }

  document.addEventListener('DOMContentLoaded', initReferenzen);
})();
