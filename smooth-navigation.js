// Smooth Navigation and Popup Management
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle Functionality
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuContent = document.getElementById('mobile-menu-content');
        const hamburgerLines = mobileMenuButton ? mobileMenuButton.querySelectorAll('.hamburger-line') : [];
        let isMenuOpen = false;

        if (!mobileMenuButton || !mobileMenu || !mobileMenuContent) {
            console.error('Mobile menu elements not found');
            return;
        }

        console.log('Mobile menu elements found and initialized');

        function toggleMobileMenu() {
            console.log('Toggling menu, current state:', isMenuOpen ? 'open' : 'closed');
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // Get the natural height of the content
                const contentHeight = mobileMenuContent.scrollHeight;
                console.log('Content height:', contentHeight + 'px');
                
                // Open menu with smooth animation
                mobileMenu.style.height = contentHeight + 'px';
                mobileMenu.style.opacity = '1';
                
                // Transform hamburger to X with smooth animation (perfektes symmetrisches X)
                hamburgerLines.forEach((line, index) => {
                    line.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    line.style.transformOrigin = 'center center';
                    
                    if (index === 0) {
                        // Obere Linie: zur Mitte bewegen und um 45° drehen für X-Form
                        line.style.transform = 'translateY(8px) rotate(45deg)';
                    } else if (index === 1) {
                        // Mittlere Linie komplett ausblenden
                        line.style.opacity = '0';
                        line.style.transform = 'scale(0)';
                    } else if (index === 2) {
                        // Untere Linie: zur Mitte bewegen und um -45° drehen für X-Form
                        line.style.transform = 'translateY(-8px) rotate(-45deg)';
                    }
                });
                
                console.log('Mobile menu opened');
            } else {
                // Close menu with smooth animation
                mobileMenu.style.height = '0px';
                mobileMenu.style.opacity = '0';
                
                // Transform X back to hamburger
                hamburgerLines.forEach(line => {
                    line.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    line.style.transform = '';
                    line.style.opacity = '';
                });
                
                console.log('Mobile menu closed');
            }
        }

        // Add click listener to mobile menu button
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            toggleMobileMenu();
        });

        // Close menu when clicking on menu links
        const menuLinks = mobileMenu.querySelectorAll('a');
        console.log('Found', menuLinks.length, 'menu links');
        
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    console.log('Menu link clicked, closing menu');
                    toggleMobileMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuButton.contains(e.target)) {
                console.log('Clicked outside menu, closing');
                toggleMobileMenu();
            }
        });

        // Close menu on window resize if open (desktop breakpoint)
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && isMenuOpen) {
                console.log('Resized to desktop, closing menu');
                toggleMobileMenu();
            }
        });

        console.log('Mobile menu initialized successfully');
    }
    
    // Enhanced Smooth Scrolling for all anchor links
    function initSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#" or has onclick with showPricePopup
                if (href === '#' || this.getAttribute('onclick')?.includes('showPricePopup')) {
                    return; // Let the onclick handler deal with it
                }
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Price Popup Management
    let popupVisible = false;
    let scrollThreshold = 0;
    let lastScrollY = 0;
    let hideTimeout;

    function showPricePopup(event) {
        if (event) {
            event.preventDefault();
        }
        
        // Smooth scroll to contact form for precise positioning
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Show popup after scroll starts
        setTimeout(() => {
            if (!popupVisible) {
                const popup = document.getElementById('pricePopup');
                if (popup) {
                    popup.classList.remove('hidden');
                    popup.classList.add('animate-fade-in');
                    popupVisible = true;
                    
                    // Set initial scroll position for tracking
                    lastScrollY = window.scrollY;
                    scrollThreshold = 0;
                    
                    // Auto hide after 12 seconds
                    hideTimeout = setTimeout(() => {
                        hidePricePopup();
                    }, 12000);
                }
            }
        }, 400);
    }

    function hidePricePopup() {
        if (popupVisible) {
            const popup = document.getElementById('pricePopup');
            if (popup) {
                popup.classList.add('animate-fade-out');
                popupVisible = false;
                
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                }
                
                setTimeout(() => {
                    popup.classList.add('hidden');
                    popup.classList.remove('animate-fade-in', 'animate-fade-out');
                }, 300);
            }
        }
    }

    // Improved scroll detection - only hide after significant scrolling
    let scrollHideTimeout;
    window.addEventListener('scroll', () => {
        if (popupVisible) {
            const currentScrollY = window.scrollY;
            const scrollDifference = Math.abs(currentScrollY - lastScrollY);
            
            // Accumulate scroll distance
            scrollThreshold += scrollDifference;
            lastScrollY = currentScrollY;
            
            // Clear previous timeout
            if (scrollHideTimeout) {
                clearTimeout(scrollHideTimeout);
            }
            
            // Only hide after scrolling more than 150px total
            if (scrollThreshold > 150) {
                scrollHideTimeout = setTimeout(() => {
                    hidePricePopup();
                }, 800); // Wait 800ms after stopping scroll
            }
        }
    });

    // Hide popup on click outside
    document.addEventListener('click', (e) => {
        if (popupVisible && 
            !e.target.closest('#pricePopup') && 
            !e.target.closest('a[onclick*="showPricePopup"]')) {
            hidePricePopup();
        }
    });

    // Make functions globally available
    window.showPricePopup = showPricePopup;
    window.hidePricePopup = hidePricePopup;

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Navigation highlighting (existing functionality)
    const desktopNavItems = document.querySelectorAll('#nav-container .nav-item');
    const mobileNavItems = document.querySelectorAll('#mobile-menu-content .nav-item');
    const sections = ['leistungen', 'why-website', 'ueber-uns', 'ablauf', 'referenzen-neu', 'preise', 'kontakt'];
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        let activeIndex = -1;
        
        sections.forEach((sectionId, index) => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    activeIndex = index;
                }
            }
        });
        
        console.log('Active section index:', activeIndex, 'Section:', sections[activeIndex] || 'none');
        
        // Update desktop navigation
        desktopNavItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('text-primary-blue');
                item.classList.remove('text-gray-700');
            } else {
                item.classList.add('text-gray-700');
                item.classList.remove('text-primary-blue');
            }
        });
        
        // Update mobile navigation
        mobileNavItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('text-primary-blue');
                item.classList.remove('text-gray-700');
                // Aktiviere die blaue Box (Hintergrund + linker Border)
                item.classList.add('bg-primary-blue/5', 'border-primary-blue');
                item.classList.remove('border-transparent');
                // Setze data-active für zusätzliche CSS-Regeln
                item.setAttribute('data-active', 'true');
                console.log('Set active mobile nav:', item.textContent, 'index:', index);
            } else {
                item.classList.add('text-gray-700');
                item.classList.remove('text-primary-blue');
                // Entferne die blaue Box
                item.classList.remove('bg-primary-blue/5', 'border-primary-blue');
                item.classList.add('border-transparent');
                // Entferne data-active
                item.removeAttribute('data-active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Scroll Animation System - Mit manuellen Delays
    function initScrollAnimations() {
        // Gezielt Elemente in den Sektionen finden
        const leistungenSection = document.getElementById('leistungen');
        const vorteileSection = document.getElementById('why-website');
        const ctaSection = document.getElementById('cta-section');
        const warumSection = document.getElementById('ueber-uns');
        const ablaufSection = document.getElementById('ablauf');
    const referenzenSection = document.getElementById('referenzen-neu');
        const preiseSection = document.getElementById('preise');
        const kontaktSection = document.getElementById('kontakt');
        
        let allSections = [];
        
        if (leistungenSection) {
            allSections.push({
                section: leistungenSection,
                name: 'Leistungen',
                delays: [200, 400, 600, 800, 1000, 1200] // Leistungen: 6 Karten
            });
        }
        
        if (vorteileSection) {
            allSections.push({
                section: vorteileSection,
                name: 'Vorteile',
                delays: [200, 600, 1000], // Links → Mitte → Rechts
                customOrder: [0, 1, 2] // Explizite Reihenfolge für Vorteile-Karten
            });
        }
        
        if (ctaSection) {
            allSections.push({
                section: ctaSection,
                name: 'CTA',
                delays: [200, 600] // Text zuerst, dann Buttons
            });
        }
        
        if (warumSection) {
            allSections.push({
                section: warumSection,
                name: 'Warum VereinsWeb',
                delays: [200, 400, 600, 800, 1000, 1200] // Titel, Bild, Text, Feature1, Feature2, Feature3
            });
        }
        
        if (ablaufSection) {
            allSections.push({
                section: ablaufSection,
                name: 'Ablauf',
                delays: [200, 400, 600, 800, 1000] // Titel + 4 Timeline Steps
            });
        }
        
        // Neue Referenzen-Sektion besitzt eigene Animationen; falls gewünscht, könnte man hier zukünftig scroll-animation-Elemente hinzufügen
        
        if (preiseSection) {
            allSections.push({
                section: preiseSection,
                name: 'Preise',
                delays: [200, 400, 600] // Titel + 2 Preis-Karten
            });
        }
        
        if (kontaktSection) {
            allSections.push({
                section: kontaktSection,
                name: 'Kontakt',
                delays: [200, 400, 600] // Titel + Formular + Kontaktinfos
            });
        }
        
        console.log('Found', allSections.length, 'sections to animate');
        
        // Fallback für Browser ohne IntersectionObserver
        if (!window.IntersectionObserver) {
            console.log('No IntersectionObserver support, showing all elements');
            allSections.forEach(sectionData => {
                const elements = sectionData.section.querySelectorAll('.scroll-animation');
                elements.forEach(element => {
                    element.classList.add('visible');
                });
            });
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    const section = entry.target;
                    section.setAttribute('data-animated', 'true');
                    
                    // Finde die passenden Delays für diese Sektion
                    let delays = [200, 400, 600]; // Default
                    allSections.forEach(sectionData => {
                        if (sectionData.section === section) {
                            delays = sectionData.delays;
                            console.log('Starting animation for', sectionData.name, 'section');
                        }
                    });
                    
                    // Animiere alle Elemente in dieser Sektion mit Delays
                    const animatedElements = Array.from(section.querySelectorAll('.scroll-animation'));
                    console.log(`Found ${animatedElements.length} elements in ${section.id} section`);
                    
                    // Spezielle Behandlung für verschiedene Sektionen
                    if (section.id === 'why-website') {
                        console.log('Processing Vorteile section with special grid order');
                        
                        // Stelle sicher, dass wir genau 3 Karten haben (ohne Titel)
                        const cardElements = animatedElements.filter(el => !el.classList.contains('section-title'));
                        console.log(`Found ${cardElements.length} cards in Vorteile section`);
                        
                        // Animiere in der richtigen visuellen Reihenfolge: links → mitte → rechts
                        cardElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 400);
                            const position = ['links', 'mitte', 'rechts'][index] || `position-${index}`;
                            
                            setTimeout(() => {
                                console.log(`Animating Vorteile card ${index} (${position}) after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                        
                        // Titel separat animieren (sofort)
                        const titleElement = animatedElements.find(el => el.classList.contains('section-title'));
                        if (titleElement) {
                            console.log('Animating Vorteile title immediately');
                            titleElement.classList.add('visible');
                        }
                    } else if (section.id === 'cta-section') {
                        console.log('Processing CTA section');
                        
                        // CTA: Erst Text, dann Buttons
                        animatedElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 400);
                            const type = index === 0 ? 'text' : 'buttons';
                            
                            setTimeout(() => {
                                console.log(`Animating CTA ${type} after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                    } else if (section.id === 'ueber-uns') {
                        console.log('Processing Warum VereinsWeb section');
                        
                        // Warum VereinsWeb: Titel → Bild → Text → Features (3x)
                        animatedElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 200);
                            let type = 'element';
                            
                            if (element.tagName === 'H2') type = 'title';
                            else if (element.classList.contains('from-right')) type = 'image';
                            else if (element.classList.contains('from-left') && element.tagName === 'P') type = 'text';
                            else if (element.classList.contains('from-left')) type = `feature-${index - 2}`;
                            
                            setTimeout(() => {
                                console.log(`Animating Warum VereinsWeb ${type} after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                    } else if (section.id === 'ablauf') {
                        console.log('Processing Ablauf section');
                        
                        // Ablauf: Titel zuerst, dann Timeline-Steps nacheinander
                        animatedElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 200);
                            let type = 'element';
                            
                            if (element.querySelector('h2')) type = 'title';
                            else if (element.classList.contains('timeline-step')) type = `step-${index}`;
                            
                            setTimeout(() => {
                                console.log(`Animating Ablauf ${type} after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                    } else if (section.id === 'referenzen') {
                        console.log('Processing Referenzen section');
                        
                        // Referenzen: Titel zuerst, dann 3 Referenz-Karten nacheinander
                        animatedElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 200);
                            let type = 'element';
                            
                            if (element.querySelector('h2')) type = 'title';
                            else if (element.classList.contains('group')) type = `referenz-${index}`;
                            
                            setTimeout(() => {
                                console.log(`Animating Referenzen ${type} after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                    } else if (section.id === 'preise') {
                        console.log('Processing Preise section');
                        
                        // Preise: Titel zuerst, dann Starter (links), dann Professional (rechts)
                        animatedElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 200);
                            let type = 'element';
                            
                            if (element.querySelector('h2')) type = 'title';
                            else if (element.classList.contains('from-left')) type = 'starter-package';
                            else if (element.classList.contains('from-right')) type = 'professional-package';
                            
                            setTimeout(() => {
                                console.log(`Animating Preise ${type} after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                    } else if (section.id === 'kontakt') {
                        console.log('Processing Kontakt section');
                        
                        // Kontakt: Titel zuerst, dann Formular und andere Elemente
                        animatedElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 200);
                            let type = 'element';
                            
                            if (element.querySelector('h2')) type = 'title';
                            else if (element.id === 'contact-form') type = 'contact-form';
                            else type = `kontakt-element-${index}`;
                            
                            setTimeout(() => {
                                console.log(`Animating Kontakt ${type} after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                    } else {
                        // Normale Reihenfolge für andere Sektionen (Leistungen)
                        animatedElements.forEach((element, index) => {
                            const delay = delays[index] || (index * 200);
                            
                            setTimeout(() => {
                                console.log(`Animating element ${index} in ${section.id} section after ${delay}ms`);
                                element.classList.add('visible');
                            }, delay);
                        });
                    }
                    
                    // Stop observing this section after animation
                    observer.unobserve(section);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe the sections, not individual elements
        allSections.forEach(sectionData => {
            console.log(`Observing ${sectionData.name} section`);
            observer.observe(sectionData.section);
        });
    }

    // Initialize mobile menu
    initMobileMenu();

    // Initialize scroll animations
    initScrollAnimations();

    // Hero Cursor Mouse Follow
    initHeroCursor();
});

function initHeroCursor() {
    const heroCursor = document.getElementById('hero-cursor');
    const heroMockup = document.getElementById('hero-mockup');
    
    if (!heroCursor || !heroMockup) {
        console.log('Hero cursor elements not found');
        return;
    }

    let isMouseInside = false;
    let originalAnimation = heroCursor.style.animation;

    heroMockup.addEventListener('mouseenter', function() {
        isMouseInside = true;
        // Stoppe die ursprüngliche Animation
        heroCursor.style.animation = 'none';
        heroCursor.style.transition = 'top 0.1s ease-out, left 0.1s ease-out';
        console.log('Mouse entered hero mockup - cursor following mouse');
    });

    heroMockup.addEventListener('mouseleave', function() {
        isMouseInside = false;
        // Starte die ursprüngliche Animation wieder
        heroCursor.style.animation = originalAnimation;
        heroCursor.style.transition = 'all 0.5s ease-out';
        console.log('Mouse left hero mockup - cursor resumed animation');
    });

    heroMockup.addEventListener('mousemove', function(e) {
        if (!isMouseInside) return;
        
        // Berechne die Position relativ zum Mockup-Container
        const rect = heroMockup.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Konvertiere zu Prozent-Werten (mit leichtem Offset für bessere Sichtbarkeit)
        const percentX = ((x / rect.width) * 100);
        const percentY = ((y / rect.height) * 100);
        
        // Begrenze die Werte innerhalb des Containers (mit 1% Rand)
        const clampedX = Math.max(1, Math.min(99, percentX));
        const clampedY = Math.max(1, Math.min(99, percentY));
        
        // Setze die Position des Cursors
        heroCursor.style.left = clampedX + '%';
        heroCursor.style.top = clampedY + '%';
    });

    console.log('Hero cursor mouse follow initialized');
}

// [Deprecated] Old Filter + Pagination Slider for Referenzen (replaced by referenzen.js)
function initReferenzenSlider() {
    const filterContainer = document.querySelector('.filter-container');
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
        console.warn('Referenzen slider: required elements missing');
        return;
    }

    let active = 'verein';
    let page = 0; // zero-based

    function getActiveTrack() {
        return active === 'verein' ? trackVerein : trackBusiness;
    }

    function pagesCount(track) {
        return track.querySelectorAll('.slider-page').length;
    }

    function updateIndicator() {
        const count = pagesCount(getActiveTrack());
        pageCurrent.textContent = String(page + 1);
        pageTotal.textContent = String(count);
        // Infinite loop: only disable if there is 0 or 1 page
        const disable = count <= 1;
        prevBtn.disabled = disable;
        nextBtn.disabled = disable;
    }

    function computeMaxPageHeight(track) {
        let maxH = 0;
        const pages = track.querySelectorAll('.slider-page');
        pages.forEach(p => {
            // Temporarily show page to measure if needed
            const prevTransform = track.style.transform;
            // move track so that this page is visible for correct intrinsic height (not strictly necessary, but safer)
            track.style.transform = `translateX(-${Array.from(pages).indexOf(p) * 100}%)`;
            const h = p.offsetHeight;
            if (h > maxH) maxH = h;
            track.style.transform = prevTransform;
        });
        return maxH;
    }

    function updateViewportHeight() {
        const maxHActive = computeMaxPageHeight(getActiveTrack());
        const maxHOther = computeMaxPageHeight(active === 'verein' ? trackBusiness : trackVerein);
        const maxH = Math.max(maxHActive, maxHOther);
        viewport.style.height = (maxH > 0 ? maxH : viewport.offsetHeight || 384) + 'px';
    }

    function updateTracksVisibility() {
        const vereinPages = pagesCount(trackVerein);
        const businessPages = pagesCount(trackBusiness);

        trackVerein.style.transform = active === 'verein' ? `translateX(-${page * 100}%)` : 'translateX(0)';
        trackBusiness.style.transform = active === 'business' ? `translateX(-${page * 100}%)` : 'translateX(0)';

        trackVerein.setAttribute('data-active', String(active === 'verein'));
        trackBusiness.setAttribute('data-active', String(active === 'business'));

        // No clamping here; go() handles wrapping for infinite navigation
        updateIndicator();
        updateViewportHeight();
    }

    function switchCategory(target) {
        if (active === target) return;
        active = target;
        page = 0;
        if (active === 'verein') {
            btnVerein.classList.add('active');
            btnBusiness.classList.remove('active');
            filterContainer.classList.add('verein-active');
        } else {
            btnBusiness.classList.add('active');
            btnVerein.classList.remove('active');
            filterContainer.classList.remove('verein-active');
        }
        updateTracksVisibility();
    }

    function go(delta) {
        const count = pagesCount(getActiveTrack());
        if (count <= 0) return;
        page = (page + delta + count) % count;
        updateTracksVisibility();
    }

    btnVerein.addEventListener('click', () => switchCategory('verein'));
    btnBusiness.addEventListener('click', () => switchCategory('business'));
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    // Simple swipe for mobile
    let startX = 0;
    viewport.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        startX = e.touches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
        const endX = (e.changedTouches && e.changedTouches[0]?.clientX) || startX;
        const dx = endX - startX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) go(1); else go(-1);
        }
    });

    // Initialize default
    updateTracksVisibility();

    // Recompute height on resize
    window.addEventListener('resize', () => {
        updateViewportHeight();
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Referenzen slider now initialized in referenzen.js (scroll-snap)
});