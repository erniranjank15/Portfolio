/**
 * Niranjan Kasote - Personal Portfolio Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initScrollspy();
    initScrollProgress();
    initCategoryFilters();
    initCopyButtons();
    initContactForm();
    initMobileNav();
    initProjectModals();
});

/* -------------------------------------------------------------------------
 * 1. DYNAMIC TYPING EFFECT FOR SIDEBAR SUBTITLE
 * ------------------------------------------------------------------------- */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const roles = [
        "Junior Software Developer Intern",
        "Full Stack Developer",
        "React & FastAPI Developer",
        "Node.js & Express Enthusiast",
        "Spring Boot & Java Developer",
        "B.Tech CSE Graduate"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at top
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* -------------------------------------------------------------------------
 * 2. SCROLLSPY & SMOOTH SCROLL HIGHLIGHTING
 * ------------------------------------------------------------------------- */
function initScrollspy() {
    const sections = document.querySelectorAll('div[id], section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* -------------------------------------------------------------------------
 * 3. TOP SCROLL PROGRESS BAR
 * ------------------------------------------------------------------------- */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* -------------------------------------------------------------------------
 * 4. SKILLS & PROJECTS CATEGORY FILTERING
 * ------------------------------------------------------------------------- */
function initCategoryFilters() {
    // Skill Filter
    const skillBtns = document.querySelectorAll('.skill-filter-btn');
    const skillItems = document.querySelectorAll('.skill-card');

    skillBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            skillItems.forEach(item => {
                const category = item.dataset.category || 'all';
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'flex';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    });

    // Project Filter
    const projectBtns = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project');

    projectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            projectItems.forEach(item => {
                const category = item.dataset.category || 'all';
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'flex';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    });
}

/* -------------------------------------------------------------------------
 * 5. QUICK COPY TO CLIPBOARD & TOAST NOTIFICATION
 * ------------------------------------------------------------------------- */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('[data-copy]');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.dataset.copy;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied "${textToCopy}" to clipboard!`);
                }).catch(() => {
                    showToast('Failed to copy');
                });
            } else {
                showToast(`Contact: ${textToCopy}`);
            }
        });
    });
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* -------------------------------------------------------------------------
 * 6. CONTACT FORM HANDLING
 * ------------------------------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.btn-submit');
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            showToast("Please fill in all fields before sending.");
            return;
        }

        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;

        try {
            // FastAPI endpoint (change to your deployed URL if hosting on cloud)
            const API_URL = "http://127.0.0.1:8000/api/contact";

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Message sent successfully! I will get back to you soon.");
                contactForm.reset();
            } else {
                showToast(data.detail || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Contact Form Submission Error:", error);
            showToast("Network error: Could not reach the email server. Please check your backend.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    });
}

/* -------------------------------------------------------------------------
 * 7. MOBILE NAVIGATION DRAWER
 * ------------------------------------------------------------------------- */
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });
}

/* -------------------------------------------------------------------------
 * 8. PROJECT MODALS / EXPANDABLE DETAILS
 * ------------------------------------------------------------------------- */
const projectData = {
    "bank-app": {
        title: "Bank Management System",
        subtitle: "Full-Stack Banking Web Application with Auth & RBAC",
        image: "./assets/p3.webp",
        description: "Developed a full-stack banking web application featuring secure JWT authentication, role-based access control (RBAC), RESTful APIs for account management, deposit/withdrawal transactions, and MongoDB persistence.",
        tech: ["React.js", "FastAPI", "MongoDB", "JWT", "RBAC", "REST API"],
        live: "https://banknk.netlify.app/",
        backend: "https://bank-4-yt2f.onrender.com/docs",
        features: [
            "JWT & RBAC Security Authentication",
            "RESTful APIs for Deposits, Withdrawals, & Transactions",
            "Protected Routes & Middleware-based Authorization",
            "MongoDB Database for Persistent Data Storage"
        ]
    },
    "job-portal": {
        title: "Job Portal System",
        subtitle: "Full-Stack Job Search & Recruitment Platform",
        image: "./assets/Job_Portal.webp",
        description: "Developed a full-stack Job Portal platform enabling candidates to search & apply for positions, and recruiters to post jobs, track applications, and manage candidates with integrated resume uploads via Multer and Cloudinary.",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Multer", "Cloudinary"],
        live: "https://jobportalnk.netlify.app/",
        github: "https://github.com/erniranjank15",
        features: [
            "JWT Authentication & Role-based Access (Users & Recruiters)",
            "Job Posting, Candidate Tracking & Application Features",
            "Multer & Cloudinary Cloud Integration for Resume Uploads",
            "Express.js & MongoDB Backend Service Architecture"
        ]
    },
    "library-system": {
        title: "Library Management System",
        subtitle: "Spring Boot & SQLite RESTful Management System",
        image: "./assets/goran-ivos-iOykDIkZLQw-unsplash.webp",
        description: "Built a Library Management System using Spring Boot and SQLite for managing books, members, and borrowing records with CRUD operations, RESTful APIs, JDBC integration, validation, and robust exception handling.",
        tech: ["Spring Boot", "JDBC", "SQLite", "Maven", "REST APIs", "Java"],
        github: "https://github.com/erniranjank15",
        features: [
            "Book, Member, Borrow & Return Management Workflows",
            "RESTful API Endpoints & Complete CRUD Capabilities",
            "JDBC Integration with SQLite Database",
            "Applied Data Validation & Reliable Exception Handling"
        ]
    },
    "portfolio": {
        title: "Personal Portfolio Website",
        subtitle: "Modern Responsive Developer Showcase",
        image: "./assets/p7.webp",
        description: "A customized dark glassmorphism portfolio site engineered to highlight software projects, technical skills, education timeline, and professional contact channels.",
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        live: "https://personalportfolionk.netlify.app/",
        github: "https://github.com/erniranjank15/Portfolio",
        features: [
            "Glassmorphism Visual Aesthetic & Ambient Glow",
            "Interactive Category Filtering for Projects & Skills",
            "Dynamic Typing Subtitle Animation",
            "Scrollspy Navigation & Fast Mobile Drawer"
        ]
    },
    "heart-disease": {
        title: "Heart Disease Prediction System",
        subtitle: "Machine Learning Diagnostic Web Application",
        image: "./assets/p9.webp",
        description: "An intelligent healthcare prediction web tool utilizing Scikit-learn Machine Learning classification models to assess heart disease risk from clinical metrics.",
        tech: ["Python", "Scikit-Learn", "Streamlit", "Pandas", "NumPy"],
        live: "https://heart-disease-web-app-mckaf9ocupljknoutjprmj.streamlit.app/",
        github: "https://github.com/erniranjank15/heart_app",
        features: [
            "ML Classification Model for Risk Assessment",
            "Interactive Streamlit Web Dashboard",
            "Custom Medical Feature Inputs & Instant Output",
            "Trained on Verified Cardiac Clinical Data"
        ]
    },
    "bone-fracture": {
        title: "Bone Fracture Detection",
        subtitle: "YOLO Computer Vision Medical Image Analysis",
        image: "./assets/p8.webp",
        description: "Deep learning computer vision project leveraging YOLO object detection models to accurately locate and identify bone fractures from X-Ray diagnostic images.",
        tech: ["Python", "YOLO Model", "OpenCV", "Deep Learning", "PyTorch"],
        github: "https://github.com/erniranjank15/Bone-fracture-detection-yolo",
        features: [
            "Automated X-Ray Fracture Region Localization",
            "YOLO Object Detection Architecture",
            "Dataset Augmentation & Model Optimization",
            "High Recall & Accuracy Diagnostics"
        ]
    },
    "weather-app": {
        title: "Dynamic Weather App",
        subtitle: "Real-time Weather Forecast Application",
        image: "./assets/p5.webp",
        description: "Responsive weather dashboard fetching live meteorological data, temperature metrics, humidity, and forecasts from external RESTful Weather APIs.",
        tech: ["HTML5", "CSS3", "JavaScript", "OpenWeather API"],
        github: "https://github.com/erniranjank15/Weather-App",
        features: [
            "Real-time City Weather Search",
            "Dynamic Weather Condition Visual Icons",
            "Temperature, Humidity, & Wind Speed Data",
            "Asynchronous Fetch API Integration"
        ]
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const projectCards = document.querySelectorAll('.project[data-id]');

    if (!modal || !modalClose) return;

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent opening modal if user clicked a direct external link button inside card
            if (e.target.closest('a')) return;

            const id = card.dataset.id;
            const data = projectData[id];
            if (!data) return;

            populateModal(data);
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function populateModal(data) {
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-subtitle').textContent = data.subtitle;
    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-desc').textContent = data.description;

    // Tech tags
    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    // Features list
    const featuresContainer = document.getElementById('modal-features');
    if (data.features && data.features.length) {
        featuresContainer.innerHTML = `
            <h4>Key Features</h4>
            <ul>
                ${data.features.map(f => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> ${f}</li>`).join('')}
            </ul>
        `;
    } else {
        featuresContainer.innerHTML = '';
    }

    // Action links
    const linksContainer = document.getElementById('modal-links');
    let linksHtml = '';
    if (data.live) {
        linksHtml += `<a href="${data.live}" target="_blank" class="btn btn-primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Live Demo</a>`;
    }
    if (data.backend) {
        linksHtml += `<a href="${data.backend}" target="_blank" class="btn btn-secondary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> API Specs</a>`;
    }
    if (data.github) {
        linksHtml += `<a href="${data.github}" target="_blank" class="btn btn-secondary"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> View Code</a>`;
    }
    linksContainer.innerHTML = linksHtml;
}
