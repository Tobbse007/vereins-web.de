// Smooth Navigation and Popup Management
document.addEventListener('DOMContentLoaded', function() {
    
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
    const navItems = document.querySelectorAll('.nav-item');
    const sections = ['leistungen', 'why-website', 'ueber-uns', 'ablauf', 'referenzen', 'preise', 'kontakt'];
    
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
        
        navItems.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('text-primary-blue');
                item.classList.remove('text-gray-700');
            } else {
                item.classList.add('text-gray-700');
                item.classList.remove('text-primary-blue');
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
        const referenzenSection = document.getElementById('referenzen');
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
        
        if (referenzenSection) {
            allSections.push({
                section: referenzenSection,
                name: 'Referenzen',
                delays: [200, 400, 600, 800] // Titel + 3 Referenz-Karten
            });
        }
        
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

    // Initialize scroll animations
    initScrollAnimations();
});