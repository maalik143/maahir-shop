// ---------- Automatic Image Recovery & Fallbacks ----------
window.addEventListener('error', function (e) {
    if (e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
        // Prevent infinite loop if placeholder itself is broken
        if (e.target.dataset.errorHandled) return;
        
        // Use a high-quality tech/shop placeholder
        e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=500'; 
        e.target.dataset.errorHandled = 'true';
        e.target.style.opacity = '0.7'; // Subtle indicator of fallback
        e.target.title = 'Image auto-recovered by Maahir System';
    }
}, true); // Use capture phase because image errors do not bubble

// ---------- Loading Screen ----------
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 600);
    }
});

// ---------- Navbar Scroll Effect ----------
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}
// ---------- Reading Progress Bar ----------
const progressBar = document.getElementById('reading-progress');
if (progressBar && (window.location.pathname.includes('/news/') || window.location.pathname.includes('/product/'))) {
    progressBar.style.display = 'block';
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });
}

// ---------- Mobile Menu Toggle ----------
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ---------- Scroll Fade-In Animation ----------
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
fadeEls.forEach(el => fadeObserver.observe(el));

// ---------- Active Nav Link ----------
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});
// ---------- Newsletter Form (Global Support) ----------
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        if (input) {
            input.value = '';
            alert('Welcome! You have joined our global newsletter.');
        }
    });
}

// ---------- Article Engagement (Reactions & Saving) ----------
document.querySelectorAll('.btn-reaction').forEach(btn => {
    btn.addEventListener('click', () => {
        const countSpan = btn.querySelector('.count');
        let count = parseInt(countSpan.innerText);
        if (!btn.classList.contains('active')) {
            btn.classList.add('active');
            btn.style.borderColor = 'var(--primary)';
            btn.style.color = 'var(--primary)';
            countSpan.innerText = count + 1;
        } else {
            btn.classList.remove('active');
            btn.style.borderColor = 'var(--glass-border)';
            btn.style.color = 'var(--text-white)';
            countSpan.innerText = count - 1;
        }
    });
});

const saveBtn = document.getElementById('save-article');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        saveBtn.innerText = '✅ Saved to Dashboard';
        saveBtn.classList.add('btn-primary');
        saveBtn.style.color = 'var(--bg-dark)';
        const articleTitle = document.querySelector('h1').innerText;
        let saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        if (!saved.includes(articleTitle)) {
            saved.push(articleTitle);
            localStorage.setItem('savedArticles', JSON.stringify(saved));
        }
    });
}

// ---------- Global Push Notifications (Growth) ----------
function initPushNotifications() {
    const pushPrompt = document.getElementById('push-prompt');
    if (pushPrompt && !localStorage.getItem('pushSeen')) {
        setTimeout(() => {
            pushPrompt.style.display = 'block';
        }, 5000); 
    }

    if (pushPrompt) {
        document.getElementById('push-deny').addEventListener('click', () => {
            pushPrompt.style.display = 'none';
            localStorage.setItem('pushSeen', 'true');
        });
        document.getElementById('push-allow').addEventListener('click', () => {
            pushPrompt.innerHTML = '<div style="text-align:center;"><h4 style="color:var(--primary);">🚀 Alerts Enabled!</h4><p style="font-size:0.8rem;">You are now connected to the global pulse.</p></div>';
            setTimeout(() => {
                pushPrompt.style.display = 'none';
            }, 3000);
            localStorage.setItem('pushSeen', 'true');
            localStorage.setItem('pushSubscribed', 'true');
        });
    }
}
initPushNotifications();

// ---------- Performance: Image Lazy Loading ----------
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ("IntersectionObserver" in window) {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => observer.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}
initLazyLoading();

// ---------- Shop Filters (client-side) ----------
function filterProducts() {
    const searchInput = document.querySelector('.search-bar input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const checkedCats = Array.from(document.querySelectorAll('.filter-cat:checked')).map(cb => cb.value);
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const cat = card.dataset.category || '';
        const matchSearch = !searchTerm || title.includes(searchTerm);
        const matchCat = checkedCats.length === 0 || checkedCats.includes(cat);
        card.style.display = (matchSearch && matchCat) ? '' : 'none';
    });
}

// Attach filter listeners if on shop page
document.querySelectorAll('.filter-cat').forEach(cb => cb.addEventListener('change', filterProducts));
const shopSearch = document.querySelector('.search-bar input');
if (shopSearch) shopSearch.addEventListener('input', filterProducts);

// ---------- Quantity Selector ----------
document.querySelectorAll('.quantity-selector').forEach(qs => {
    const input = qs.querySelector('input');
    const minus = qs.querySelector('.qty-minus');
    const plus = qs.querySelector('.qty-plus');
    if (minus) minus.addEventListener('click', () => { if (input.value > 1) input.value = parseInt(input.value) - 1; });
    if (plus) plus.addEventListener('click', () => { input.value = parseInt(input.value) + 1; });
});

// ---------- Product Thumbnail Gallery ----------
document.querySelectorAll('.product-thumbs img').forEach(thumb => {
    thumb.addEventListener('click', () => {
        const mainImg = thumb.closest('.product-gallery').querySelector('.main-img');
        if (mainImg) mainImg.src = thumb.src;
        thumb.closest('.product-thumbs').querySelectorAll('img').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    });
});

// ---------- Auth Tabs ----------
document.querySelectorAll('.auth-tabs button').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tabs button').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.auth-panel').forEach(panel => {
            panel.style.display = panel.id === target ? 'block' : 'none';
        });
    });
});

// Modern Reveal Animation on Scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Dynamic Glassmorphism effects
document.querySelectorAll('.card-glass').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ---------- Contact Form ----------
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mahadsanid! Fariintaada waa la helay.');
        contactForm.reset();
    });
}

// ---------- AI Chat Toggle ----------
const chatBubble = document.getElementById('ai-chat-bubble');
const chatWindow = document.getElementById('ai-chat-window');
const closeChat = document.getElementById('close-chat');

if (chatBubble && chatWindow && closeChat) {
    chatBubble.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
        chatWindow.classList.add('active');
    });
    closeChat.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });
}


// ---------- Cart Drawer Toggle ----------
const openCart = document.getElementById('open-cart');
const cartDrawer = document.getElementById('cart-drawer');
const closeCart = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');

if (openCart && cartDrawer && closeCart && cartOverlay) {
    const toggleCart = (show) => {
        cartDrawer.style.right = show ? '0' : '-400px';
        cartOverlay.style.display = show ? 'block' : 'none';
        document.body.style.overflow = show ? 'hidden' : '';
    };

    openCart.addEventListener('click', () => toggleCart(true));
    closeCart.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));
}

// ---------- Course Filtering Logic ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const levelCheckboxes = document.querySelectorAll('#level-filters input');
const courseCards = document.querySelectorAll('.course-card');

const filterCourses = () => {
    const activeCategory = document.querySelector('.filter-btn.active').dataset.filter;
    const selectedLevels = Array.from(levelCheckboxes).filter(i => i.checked).map(i => i.value);

    courseCards.forEach(card => {
        const catMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
        const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(card.dataset.level);

        if (catMatch && levelMatch) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
};

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.style.color = 'var(--text-muted)';
            b.style.fontWeight = '400';
        });
        btn.classList.add('active');
        btn.style.color = 'var(--primary)';
        btn.style.fontWeight = '700';
        filterCourses();
    });
});

levelCheckboxes.forEach(cb => {
    cb.addEventListener('change', filterCourses);
});

// ---------- AI Chat Response Logic ----------
const chatInput = document.querySelector('.ai-chat-window input');
const chatBtn = document.querySelector('.ai-chat-window button');
const chatMessages = document.getElementById('chat-messages');

const addMessage = (text, isAi = false) => {
    const msg = document.createElement('div');
    msg.className = 'glass';
    msg.style.padding = '10px 15px';
    msg.style.borderRadius = '10px';
    msg.style.maxWidth = '80%';
    msg.style.fontSize = '0.85rem';
    msg.style.alignSelf = isAi ? 'flex-start' : 'flex-end';
    if (!isAi) msg.style.background = 'var(--primary)';
    if (!isAi) msg.style.color = 'var(--bg-dark)';
    msg.innerText = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const getAiResponse = (input) => {
    const lower = input.toLowerCase();
    
    // Simple Language Detection
    const isSomali = (text) => / (maahir|waxaa|waa|iyo|ee|ku|ka|yahay|rabaa|koorso|qiimaha|wararka|dukaanka|keenaysaa|caawin|asc|iska-wada-dhig|mahadsanid) /.test(" " + text + " ") || /[xy]/.test(text);
    const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

    // --- SOMALI RESPONSES ---
    if (isSomali(lower)) {
        if (lower.includes('hey') || lower.includes('asc') || lower.includes('isway') || lower.includes('hi')) 
            return "Asc! Ku soo dhawaaw Maahir Shop. Maxaan maanta kaa caawin karaa? Waxaan halkan kuu joogaa inaan kugu hago dukaanka iyo akadeemiyada.";
        if (lower.includes('koorso') || lower.includes('waxbarasho')) 
            return "Akadeemiyada Maahir waxay bixisaa koorsooyin heer caalami ah barnaamijyada (Coding), Naqshadaynta (Graphic Design), iyo AI. Ma rabtaa inaad aragto buug-yaraha koorsooyinka?";
        if (lower.includes('qiimaha') || lower.includes('lacagta')) 
            return "Qiimahayadu way kala duwan yihiin. Tusaale, Koorsooyinka waxay ka bilaabmaan $49.00, halka alaabta dukaanka ay leeyihiin qiimo aad u jaban oo caalami ah. Booqo bogga 'Shop' si aad xog dheeraad ah u hesho.";
        if (lower.includes('alaab') || lower.includes('gadasho') || lower.includes('electronics')) 
            return "Waxaan iibinaa qalabka ugu casrisan ee korontada (Electronics) sida MacBook Pro, Drones, iyo dharka Fashion-ka ah. Dhammaan alaabta waxaa si toos ah looga keenaa caalamka.";
        if (lower.includes('delivery') || lower.includes('keenista')) 
            return "Waxaan u adeegsanaa shuraako caalami ah sida Alibaba iyo Amazon si aan alaabta kuugu keeno muddo 2-4 maalmood gudahood ah.";
        if (lower.includes('admin') || lower.includes('maamulka'))
            return "Bogga 'Admin' wuxuu kuu ogolaanayaa inaad aragto xogtada dakhliga, dalabaadka, iyo horumarka ardayda si toos ah.";
        
        return "Su'aal aad u fiican! Inkastoo aan wali baranayo qaar ka mid ah faahfaahinta, waxaan hubaal ah in Maahir Shop yahay goobtaada ugu fiican ee tayada caalamiga ah. I weydii wax ku saabsan 'Shop', 'Courses', ama 'News'!";
    }

    // --- ARABIC RESPONSES ---
    if (isArabic(input)) {
        if (lower.includes('مرحبا') || lower.includes('سلام')) 
            return "مرحباً بك في متجر ماهر! كيف يمكنني مساعدتك اليوم؟ نحن نقدم أفضل المنتجات والدورات العالمية.";
        if (lower.includes('دورة') || lower.includes('تعلم')) 
            return "تتوفر لدينا دورات احترافية في البرمجة والتصميم والذكاء الاصطناعي. هل تود الاطلاع على القائمة؟";
        if (lower.includes('سعر') || lower.includes('كم')) 
            return "أسعارنا منافسة جداً وتبدأ من 49 دولاراً للدورات. يمكنك تصفح المتجر لمزيد من التفاصيل.";
        return "شكراً لسؤالك! متجر ماهر هو وجهتك الأولى للجودة العالمية. اسألني عن 'المتجر' أو 'الدورات' أو 'الأخبار'!";
    }

    // --- ENGLISH RESPONSES (DEFAULT) ---
    // Greetings & Basic
    if (lower.includes('hello') || lower.includes('hi')) return "Hello! Maahir AI here. I can help you with shop categories, course enrollment, or latest tech news. What's on your mind?";
    if (lower.includes('how are you')) return "I'm functioning at 100% capacity! Ready to help you explore Maahir Shop.";
    if (lower.includes('who are you') || lower.includes('what is this')) return "I am the Maahir Shop AI Assistant, built to guide you through our global marketplace and academy.";

    // Shopping & Products
    if (lower.includes('product') || lower.includes('item') || lower.includes('sell')) return "We sell premium electronics (MacBooks, Drones), Fashion (Global Hoodies), and Gaming gear. Visit our 'Shop' page to see all!";
    if (lower.includes('macbook') || lower.includes('laptop')) return "Our MacBook Pro M3 Max is a top-seller at $2,499.00. It's built for global-scale development.";
    if (lower.includes('drone')) return "The Pro 4K Ultra Drone ($1,199.00) is perfect for global photography. You can find it in the Shop.";
    if (lower.includes('shipping') || lower.includes('delivery')) return "We offer Global Express Shipping (2-4 business days) via our partners like Alibaba and Amazon.";

    // Courses & Academy
    if (lower.includes('course') || lower.includes('learn') || lower.includes('study')) return "Our Academy offers courses in Python Development ($49.99), Graphic Design, and AI. Would you like to see the course catalog?";
    if (lower.includes('python')) return "Our 'Complete Python Masterclass 2026' covers everything from OOP to AI for just $49.99.";
    if (lower.includes('certificate')) return "Yes! All Maahir Academy courses include a verifiable Certificate of Completion.";

    // Partners
    if (lower.includes('alibaba') || lower.includes('dsers') || lower.includes('amazon')) return "Maahir Shop is proudly integrated with Alibaba, Dsers, and Amazon Global to ensure world-class supply chains.";

    // Contact & Admin
    if (lower.includes('contact') || lower.includes('help') || lower.includes('support') || lower.includes('social') || lower.includes('follow')) 
        return "You can reach our global support team 24/7 at cadecade232@gmail.com, or follow us on our official channels: WhatsApp (+252616465014), YouTube (Maahir Shorts), X (@maalikAli788557), and TikTok (@malik_579).";
    if (lower.includes('admin')) return "The Admin Dashboard provides real-time analytics on revenue, orders, and student growth.";

    return "That's a great question! Maahir Shop is your premium destination for global quality. Feel free to ask more about our Marketplace, Academy, or latest Tech Insights!";
};


const handleChat = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, false);
    chatInput.value = '';

    // Show typing state
    const typing = document.createElement('div');
    typing.innerText = 'AI is thinking...';
    typing.style.fontSize = '0.7rem';
    typing.style.color = 'var(--primary)';
    typing.style.marginTop = '5px';
    typing.style.alignSelf = 'flex-start';
    chatMessages.appendChild(typing);

    setTimeout(() => {
        if (chatMessages.contains(typing)) chatMessages.removeChild(typing);
        addMessage(getAiResponse(text), true);
    }, 1000);
};

if (chatBtn && chatInput) {
    chatBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
}

// ---------- Shop Filtering Logic ----------
const shopCheckboxes = document.querySelectorAll('#shop-categories input');
const productCards = document.querySelectorAll('.product-card');

const filterShop = () => {
    const selectedCats = Array.from(shopCheckboxes)
        .filter(i => i.checked)
        .map(i => i.value);

    productCards.forEach(card => {
        const itemCat = card.dataset.cat;
        // If 'all' is checked, or the specific category is checked
        const isAll = selectedCats.includes('all');
        const isMatch = selectedCats.includes(itemCat);

        if (isAll || isMatch) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
};

shopCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
        // If clicking 'all', uncheck others. If clicking others, uncheck 'all'.
        if (e.target.value === 'all' && e.target.checked) {
            shopCheckboxes.forEach(c => { if(c.value !== 'all') c.checked = false; });
        } else if (e.target.checked) {
            shopCheckboxes.forEach(c => { if(c.value === 'all') c.checked = false; });
        }
        
        // If nothing is checked, re-check 'all'
        const noneChecked = Array.from(shopCheckboxes).every(c => !c.checked);
        if (noneChecked) {
            shopCheckboxes.forEach(c => { if(c.value === 'all') c.checked = true; });
        }

        filterShop();
    });
});

// ---------- Global Cart Logic ----------
let cart = JSON.parse(localStorage.getItem('maahir_cart') || '[]');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartBadge = document.querySelector('.nav-cart .badge');

const updateCartUI = () => {
    if (!cartItemsContainer || !cartTotalElement || !cartBadge) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--text-dim); text-align: center; margin-top: 50px;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const itemEl = document.createElement('div');
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'space-between';
            itemEl.style.alignItems = 'center';
            itemEl.style.marginBottom = '20px';
            itemEl.innerHTML = `
                <div style="display: flex; gap: 15px; align-items: center;">
                    <img src="${item.img}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                    <div style="text-align: left;">
                        <h5 style="margin:0; font-size: 0.85rem; color: var(--text-white);">${item.name}</h5>
                        <p style="margin:0; font-size: 0.75rem; color: var(--primary); font-weight: 700;">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <span style="cursor: pointer; opacity: 0.5; color: var(--accent); padding: 5px;" onclick="removeFromCart(${index})">✕</span>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }
    
    cartTotalElement.innerText = `$${total.toFixed(2)}`;
    cartBadge.innerText = cart.length;
};

window.addToCart = (name, price, img) => {
    const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
    cart.push({ name, price: numericPrice, img });
    localStorage.setItem('maahir_cart', JSON.stringify(cart));
    updateCartUI();
    
    // Auto open cart
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartDrawer && cartOverlay) {
        cartDrawer.style.right = '0';
        cartOverlay.style.display = 'block';
    }
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('maahir_cart', JSON.stringify(cart));
    updateCartUI();
};

// ---------- Elite Modernization: Theme Switcher ----------
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('maahir_theme') || 'dark';

    if (currentTheme === 'light') body.classList.add('light-theme');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const newTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('maahir_theme', newTheme);
            themeBtn.innerText = newTheme === 'light' ? '🌙' : '☀️';
        });
    }
}

// ---------- Elite Modernization: Smart Search Overlay ----------
function initSearchOverlay() {
    const openBtn = document.getElementById('open-search');
    const closeBtn = document.getElementById('close-search');
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('global-search-input');
    const resultsPreview = document.getElementById('search-results-preview');

    const toggleSearch = (show) => {
        if (!overlay) return;
        overlay.style.display = show ? 'flex' : 'none';
        if (show && input) input.focus();
        document.body.style.overflow = show ? 'hidden' : '';
    };

    if (openBtn) openBtn.addEventListener('click', () => toggleSearch(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleSearch(false));
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') toggleSearch(false);
    });

    if (input) {
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            if (term.length < 2) {
                if(resultsPreview) resultsPreview.innerHTML = '';
                return;
            }

            const mockData = [
                { name: 'MacBook Pro M3 Max', type: 'Product', icon: '💻' },
                { name: 'Python Masterclass 2026', type: 'Course', icon: '🐍' },
                { name: 'iPhone 16 Pro Max', type: 'Product', icon: '📱' },
                { name: 'UI/UX Design Course', type: 'Course', icon: '🎨' }
            ];

            const filtered = mockData.filter(d => d.name.toLowerCase().includes(term));
            if(resultsPreview) {
                resultsPreview.innerHTML = filtered.map(item => `
                    <div class="glass" style="padding: 15px; border-radius: 12px; display: flex; gap: 15px; align-items: center; cursor: pointer;">
                        <div style="font-size: 1.5rem;">${item.icon}</div>
                        <div>
                            <h5 style="margin:0; color:var(--text-white);">${item.name}</h5>
                            <p style="margin:0; font-size: 0.7rem; color: var(--primary);">${item.type}</p>
                        </div>
                    </div>
                `).join('');
            }
        });
    }
}

// ---------- Elite Modernization: Live Sales Popups ----------
function initLiveSales() {
    const names = ['Ahmed', 'Cali', 'Fadumo', 'Zahra', 'Maxamed', 'Sahra'];
    const products = ['MacBook Pro', 'Python Masterclass', 'Global Hoodie', 'iPhone 16'];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const name = names[Math.floor(Math.random() * names.length)];
            const product = products[Math.floor(Math.random() * products.length)];
            
            const popup = document.createElement('div');
            popup.className = 'glass reveal active modern-glow';
            popup.style.cssText = `
                position: fixed; bottom: 30px; left: 30px; 
                padding: 15px 25px; border-radius: 50px; 
                z-index: 10006; display: flex; gap: 15px; align-items: center;
                animation: slideUp 0.5s ease; border: 1px solid var(--primary);
                font-size: 0.8rem;
            `;
            popup.innerHTML = `
                <div style="width: 35px; height: 35px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--bg-dark);">🛍️</div>
                <div>
                    <span style="color: var(--text-white); font-weight: 700;">${name}</span> just purchased 
                    <span style="color: var(--primary); font-weight: 700;">${product}</span>
                    <p style="margin: 0; font-size: 0.6rem; color: var(--text-dim);">Live from Mogadishu</p>
                </div>
            `;
            document.body.appendChild(popup);
            setTimeout(() => {
                popup.style.opacity = '0';
                setTimeout(() => popup.remove(), 500);
            }, 5000);
        }
    }, 10000);
}

// ---------- Elite Modernization: Exit-Intent Modal ----------
function initExitIntent() {
    let fired = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !fired && !localStorage.getItem('exit_dismissed')) {
            fired = true;
            const modal = document.createElement('div');
            modal.className = 'glass';
            modal.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 90%; max-width: 500px; padding: 50px; border-radius: 30px;
                z-index: 10007; text-align: center; border: 2px solid var(--primary);
                box-shadow: 0 0 100px rgba(0, 255, 204, 0.2);
            `;
            modal.innerHTML = `
                <h2 style="font-size: 2.5rem; margin-bottom: 15px;">Wait! <span>Don't Go</span></h2>
                <p style="color: var(--text-muted); margin-bottom: 30px;">Get a <strong>20% Global Discount</strong> on your first course or product today.</p>
                <div style="font-size: 2rem; font-weight: 900; color: var(--primary); margin-bottom: 30px;">CODE: MAAHIR20</div>
                <button class="btn btn-primary">Claim My Discount →</button>
                <p style="margin-top: 20px; font-size: 0.7rem; color: var(--text-dim); cursor: pointer;" id="dismiss-exit">No thanks, I'll pay full price</p>
            `;
            const overlay = document.createElement('div');
            overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 10006;`;
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            
            const close = () => { overlay.remove(); modal.remove(); };
            modal.querySelector('button').addEventListener('click', close);
            modal.querySelector('#dismiss-exit').addEventListener('click', () => {
                localStorage.setItem('exit_dismissed', 'true');
                close();
            });
        }
    });
}

// ---------- Master Implementation Runner ----------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Core
    updateCartUI();
    setupSearch('shop-search', '.product-card', 'h3');
    setupSearch('course-search', '.course-card', 'h3');
    
    // 2. Initialize Elite Features
    initTheme();
    initSearchOverlay();
    initLiveSales();
    initExitIntent();

    // 3. Admin Charts logic
    if (window.location.pathname.includes('/admin')) {
        const graphArea = document.querySelector('.admin-graph');
        if (graphArea) {
            graphArea.innerHTML = `
                <div style="height: 200px; display: flex; align-items: flex-end; gap: 15px; padding: 20px; border-bottom: 1px solid var(--glass-border);">
                    ${[40, 70, 45, 90, 65, 80, 95].map(h => `
                        <div style="flex: 1; background: var(--primary); height: ${h}%; border-radius: 5px 5px 0 0; position: relative;" title="$${h}k Revenue">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; color: var(--text-dim); font-weight: 700;">$${h}k</div>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 20px; font-size: 0.7rem; color: var(--text-muted);">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            `;
        }
    }

    // 4. Global Animations Reveal
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealOnScroll = () => {
        reveals.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - 100) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
});





