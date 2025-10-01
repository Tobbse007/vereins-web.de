// New independent Referenzen section: fade-pages slider with category filter
(function() {
  function initReferenzenNeu() {
    const section = document.getElementById('referenzen-neu');
    if (!section) return;

    const filter = section.querySelector('.r2-filter');
    const btnVerein = section.querySelector('[data-r2-filter="verein"]');
    const btnBusiness = section.querySelector('[data-r2-filter="business"]');

    const pagesVerein = section.querySelector('#r2-pages-verein');
    const pagesBusiness = section.querySelector('#r2-pages-business');

  const prev = section.querySelector('[data-r2-prev]');
  const next = section.querySelector('[data-r2-next]');
  // Support both indicator placements (top or bottom) by selecting all
  const pageCurrentEls = Array.from(section.querySelectorAll('[data-r2-current]'));
  const pageTotalEls = Array.from(section.querySelectorAll('[data-r2-total]'));
  const viewport = section.querySelector('.r2-viewport');

    if (!filter || !btnVerein || !btnBusiness || !pagesVerein || !pagesBusiness || !prev || !next || !pageCurrentEls.length || !pageTotalEls.length || !viewport) {
      console.warn('Referenzen-Neu: required elements missing');
      return;
    }

    let category = 'verein';
    let index = 0;
    let ro = null;
    let isTransitioning = false; // Prevent rapid clicks

    function getPagesEl() {
      return category === 'verein' ? pagesVerein : pagesBusiness;
    }

    function getPageList() {
      return Array.from(getPagesEl().querySelectorAll('.r2-page'));
    }

    function getActivePage() {
      const list = getPageList();
      return list[index];
    }

    function adjustViewportHeight() {
      const active = getActivePage();
      if (!active || !viewport) return;
      // Use scrollHeight to include internal flow; fallback to offsetHeight
      const h = Math.max(active.scrollHeight, active.offsetHeight);
      if (h && Number.isFinite(h)) {
        viewport.style.height = h + 'px';
        viewport.style.minHeight = h + 'px';
      }
    }

    function bindResizeObserver() {
      if (typeof ResizeObserver === 'undefined') return;
      if (!ro) {
        ro = new ResizeObserver(() => {
          // Throttle via rAF for smoother updates
          requestAnimationFrame(adjustViewportHeight);
        });
      } else {
        ro.disconnect();
      }
      const active = getActivePage();
      if (active) ro.observe(active);
    }

    function updateActivePage() {
      const list = getPageList();
      const count = list.length;
      
      console.log(`Updating page: category=${category}, index=${index}, total=${count}`);
      
      // Update states immediately without delay
      list.forEach((el, i) => {
        const isActive = i === index;
        el.setAttribute('data-active', String(isActive));
      });
      
      pageCurrentEls.forEach(el => el.textContent = String(index + 1));
      pageTotalEls.forEach(el => el.textContent = String(count));
      const disabled = count <= 1;
      prev.disabled = disabled;
      next.disabled = disabled;

      // Auto-height the viewport
      requestAnimationFrame(() => {
        adjustViewportHeight();
        bindResizeObserver();
      });
    }

    function switchCategory(target) {
      if (category === target || isTransitioning) return;
      
      isTransitioning = true;
      category = target;
      index = 0;
      
      console.log(`Switching to category: ${category}`);
      
      // update filter pill position
      if (category === 'verein') {
        filter.classList.remove('business');
        btnVerein.classList.add('active');
        btnBusiness.classList.remove('active');
        pagesVerein.removeAttribute('hidden');
        pagesBusiness.setAttribute('hidden', '');
      } else {
        filter.classList.add('business');
        btnBusiness.classList.add('active');
        btnVerein.classList.remove('active');
        pagesBusiness.removeAttribute('hidden');
        pagesVerein.setAttribute('hidden', '');
      }
      
      updateActivePage();
      
      // Reset transition lock
      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }

    function go(delta) {
      const list = getPageList();
      if (!list.length || isTransitioning) return;
      
      isTransitioning = true;
      const newIndex = (index + delta + list.length) % list.length;
      
      console.log(`Navigation: from ${index} to ${newIndex}, total pages: ${list.length}`);
      
      index = newIndex;
      updateActivePage();
      
      // Reset transition lock after animation
      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }

    // events
    btnVerein.addEventListener('click', () => switchCategory('verein'));
    btnBusiness.addEventListener('click', () => switchCategory('business'));
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));

    // keyboard on section
    section.setAttribute('tabindex', '0');
    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    // init
    // default: verein active
    pagesBusiness.setAttribute('hidden', '');
    btnVerein.classList.add('active');
    filter.classList.remove('business');
    
    // Ensure all cards are visible on init
    const allCards = section.querySelectorAll('.r2-card');
    allCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    });
    
    updateActivePage();

    // Resize handling
    window.addEventListener('resize', () => requestAnimationFrame(adjustViewportHeight));
  }

  document.addEventListener('DOMContentLoaded', initReferenzenNeu);
})();
