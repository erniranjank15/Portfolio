'use client';

import React, { useState, useEffect, useRef } from 'react';

// Data types
interface Project {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  categories: string[];
  tech: string[];
  live?: string;
  github?: string;
  backend?: string;
  features: string[];
}

interface Skill {
  name: string;
  tag: string;
  icon: string;
  categories: string[];
}

const projectsData: Project[] = [
  {
    id: 'bank-app',
    title: 'Bank Management System',
    subtitle: 'Full-Stack Banking Web Application with Auth & RBAC',
    image: '/assets/p3.webp',
    description: 'Developed a full-stack banking web application featuring secure JWT authentication, role-based access control (RBAC), RESTful APIs for account management, deposit/withdrawal transactions, and MongoDB persistence.',
    categories: ['fullstack', 'web'],
    tech: ['React.js', 'FastAPI', 'MongoDB', 'JWT', 'RBAC', 'REST API'],
    live: 'https://banknk.netlify.app/',
    backend: 'https://bank-4-yt2f.onrender.com/docs',
    features: [
      'JWT & RBAC Security Authentication',
      'RESTful APIs for Deposits, Withdrawals, & Transactions',
      'Protected Routes & Middleware-based Authorization',
      'MongoDB Database for Persistent Data Storage',
    ],
  },
  {
    id: 'job-portal',
    title: 'Job Portal System',
    subtitle: 'Full-Stack Job Search & Recruitment Platform',
    image: '/assets/Job_Portal.webp',
    description: 'Developed a full-stack Job Portal platform enabling candidates to search & apply for positions, and recruiters to post jobs, track applications, and manage candidates with integrated resume uploads via Multer and Cloudinary.',
    categories: ['fullstack', 'web'],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Multer', 'Cloudinary'],
    live: 'https://jobportalnk.netlify.app/',
    github: 'https://github.com/erniranjank15',
    features: [
      'JWT Authentication & Role-based Access (Users & Recruiters)',
      'Job Posting, Candidate Tracking & Application Features',
      'Multer & Cloudinary Cloud Integration for Resume Uploads',
      'Express.js & MongoDB Backend Service Architecture',
    ],
  },
  {
    id: 'library-system',
    title: 'Library Management System',
    subtitle: 'Spring Boot & SQLite RESTful Management System',
    image: '/assets/goran-ivos-iOykDIkZLQw-unsplash.webp',
    description: 'Built a Library Management System using Spring Boot and SQLite for managing books, members, and borrowing records with CRUD operations, RESTful APIs, JDBC integration, validation, and robust exception handling.',
    categories: ['fullstack', 'web'],
    tech: ['Spring Boot', 'JDBC', 'SQLite', 'Maven', 'REST APIs', 'Java'],
    github: 'https://github.com/erniranjank15',
    features: [
      'Book, Member, Borrow & Return Management Workflows',
      'RESTful API Endpoints & Complete CRUD Capabilities',
      'JDBC Integration with SQLite Database',
      'Applied Data Validation & Reliable Exception Handling',
    ],
  },
  {
    id: 'heart-disease',
    title: 'Heart Disease Prediction System',
    subtitle: 'Machine Learning Diagnostic Web Application',
    image: '/assets/p9.webp',
    description: 'An intelligent healthcare prediction web tool utilizing Scikit-learn Machine Learning classification models to assess heart disease risk from clinical metrics.',
    categories: ['ml'],
    tech: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'NumPy'],
    live: 'https://heart-disease-web-app-mckaf9ocupljknoutjprmj.streamlit.app/',
    github: 'https://github.com/erniranjank15/heart_app',
    features: [
      'ML Classification Model for Risk Assessment',
      'Interactive Streamlit Web Dashboard',
      'Custom Medical Feature Inputs & Instant Output',
      'Trained on Verified Cardiac Clinical Data',
    ],
  },
  {
    id: 'bone-fracture',
    title: 'Bone Fracture Detection',
    subtitle: 'YOLO Computer Vision Medical Image Analysis',
    image: '/assets/p8.webp',
    description: 'Deep learning computer vision project leveraging YOLO object detection models to accurately locate and identify bone fractures from X-Ray diagnostic images.',
    categories: ['ml'],
    tech: ['Python', 'YOLO Model', 'OpenCV', 'Deep Learning', 'PyTorch'],
    github: 'https://github.com/erniranjank15/Bone-fracture-detection-yolo',
    features: [
      'Automated X-Ray Fracture Region Localization',
      'YOLO Object Detection Architecture',
      'Dataset Augmentation & Model Optimization',
      'High Recall & Accuracy Diagnostics',
    ],
  },
  {
    id: 'weather-app',
    title: 'Dynamic Weather App',
    subtitle: 'Real-time Weather Forecast Application',
    image: '/assets/p5.webp',
    description: 'Responsive weather dashboard fetching live meteorological data, temperature metrics, humidity, and forecasts from external RESTful Weather APIs.',
    categories: ['web'],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'OpenWeather API'],
    github: 'https://github.com/erniranjank15/Weather-App',
    features: [
      'Real-time City Weather Search',
      'Dynamic Weather Condition Visual Icons',
      'Temperature, Humidity, & Wind Speed Data',
      'Asynchronous Fetch API Integration',
    ],
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio Website',
    subtitle: 'Modern Responsive Developer Showcase',
    image: '/assets/p7.webp',
    description: 'A customized dark glassmorphism portfolio site engineered to highlight software projects, technical skills, education timeline, and professional contact channels.',
    categories: ['web'],
    tech: ['Next.js', 'React', 'CSS3', 'Brevo API'],
    live: 'https://personalportfolionk.netlify.app/',
    github: 'https://github.com/erniranjank15/Portfolio',
    features: [
      'Glassmorphism Visual Aesthetic & Ambient Glow',
      'Interactive Category Filtering for Projects & Skills',
      'Dynamic Typing Subtitle Animation',
      'Full Next.js App Router & API Route Integration',
    ],
  },
];

const skillsData: Skill[] = [
  { name: 'HTML5', tag: 'Structure', icon: '/assets/html5.svg', categories: ['frontend', 'lang'] },
  { name: 'CSS3', tag: 'Styling', icon: '/assets/css.svg', categories: ['frontend'] },
  { name: 'JavaScript', tag: 'ES6+', icon: '/assets/javascript.svg', categories: ['frontend', 'lang'] },
  { name: 'React.js', tag: 'Frontend UI', icon: '/assets/react.svg', categories: ['frontend'] },
  { name: 'FastAPI', tag: 'Python API', icon: '/assets/fastapi.svg', categories: ['backend'] },
  { name: 'Node.js', tag: 'Runtime', icon: '/assets/NodeFill.svg', categories: ['backend'] },
  { name: 'Express.js', tag: 'REST Framework', icon: '/assets/Express.svg', categories: ['backend'] },
  { name: 'Spring Boot', tag: 'Java Framework', icon: '/assets/java-svgrepo-com.svg', categories: ['backend'] },
  { name: 'MongoDB', tag: 'NoSQL Database', icon: '/assets/mongodb-svgrepo-com.svg', categories: ['tools'] },
  { name: 'SQL', tag: 'Database Query', icon: '/assets/sqlalchemy.svg', categories: ['lang', 'tools'] },
  { name: 'PostgreSQL', tag: 'SQL Database', icon: '/assets/postgresql-svgrepo-com.svg', categories: ['tools'] },
  { name: 'Python', tag: 'Backend & ML', icon: '/assets/python.svg', categories: ['lang', 'backend'] },
  { name: 'Java', tag: 'OOP & Logic', icon: '/assets/java-svgrepo-com.svg', categories: ['lang'] },
  { name: 'C++', tag: 'Data Structures', icon: '/assets/cplusplus.svg', categories: ['lang'] },
  { name: 'C', tag: 'Programming', icon: '/assets/c.svg', categories: ['lang'] },
  { name: 'Git & GitHub', tag: 'Version Control', icon: '/assets/github.svg', categories: ['tools'] },
];

export default function Home() {
  // Typing state
  const [roleText, setRoleText] = useState('Full Stack Developer');
  
  // Navigation & Scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('about');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Filters
  const [skillFilter, setSkillFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  // Modal
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Contact Form
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast display trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(`Copied "${text}" to clipboard!`))
        .catch(() => showToast(`Contact: ${text}`));
    } else {
      showToast(`Contact: ${text}`);
    }
  };

  // Typing Effect
  useEffect(() => {
    const roles = [
      'Junior Software Developer Intern',
      'Full Stack Developer',
      'React & FastAPI Developer',
      'Node.js & Express Enthusiast',
      'Spring Boot & Java Developer',
      'B.Tech CSE Graduate',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        setRoleText(currentRole.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setRoleText(currentRole.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500;
      }

      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll Progress and Scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }

      const sections = ['about', 'experience', 'skills', 'education', 'portfolio', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Contact Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all fields before sending.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Message sent successfully! I will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        showToast(data.detail || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error: Could not reach the email service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSkills = skillsData.filter(
    (skill) => skillFilter === 'all' || skill.categories.includes(skillFilter)
  );

  const filteredProjects = projectsData.filter(
    (proj) => projectFilter === 'all' || proj.categories.includes(projectFilter)
  );

  return (
    <>
      {/* Background glow and Scroll progress */}
      <div className="bg-glow"></div>
      <div id="scroll-progress" className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast show">
          {toastMessage}
        </div>
      )}

      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-inner">
            {/* Profile Avatar & Status */}
            <div className="profile">
              <div className="avatar-wrapper">
                <img src="/assets/Niranjan Kasote (1).webp" alt="Niranjan Kasote" className="avatar-img" />
                <span className="status-badge" title="Open to Opportunities"></span>
              </div>
              <h1 className="profile-name">Niranjan Kasote</h1>
              <div className="role-badge">
                <span id="typing-text">{roleText}</span>
                <span className="cursor">|</span>
              </div>
            </div>

            {/* Contact Quick Info */}
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="info-text">
                  <span className="label">Email</span>
                  <button
                    onClick={() => copyToClipboard('kasoteniranjan23@gmail.com')}
                    className="value copy-link"
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  >
                    kasoteniranjan23@gmail.com
                  </button>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="info-text">
                  <span className="label">Phone</span>
                  <button
                    onClick={() => copyToClipboard('+919146842375')}
                    className="value copy-link"
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  >
                    +91 91468 42375
                  </button>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="info-text">
                  <span className="label">Location</span>
                  <span className="value">Kolhapur, Maharashtra</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              <a href="https://github.com/erniranjank15" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <img src="/assets/github.svg" alt="GitHub" />
              </a>
              <a href="https://www.linkedin.com/in/niranjan-kasote-3913ab228/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <img src="/assets/linkedin-logo-svgrepo-com.svg" alt="LinkedIn" />
              </a>
              <a href="https://linktr.ee/niranjankasote" target="_blank" rel="noopener noreferrer" aria-label="Linktree">
                <img src="/assets/linktree.svg" alt="Linktree" />
              </a>
            </div>

            {/* Resume / Profile */}
            <div className="resume-wrapper">
              <a href="https://github.com/erniranjank15" target="_blank" rel="noopener noreferrer" className="btn btn-outline full-width">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                View GitHub Profile
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Header Nav */}
          <header id="navigation" className="nav-header">
            <div className="nav-brand">Er. Niranjan</div>
            <button
              id="nav-toggle"
              className={`nav-toggle ${mobileNavOpen ? 'active' : ''}`}
              aria-label="Toggle navigation"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav id="nav-menu" className={`nav-links ${mobileNavOpen ? 'open' : ''}`}>
              {['about', 'experience', 'skills', 'education', 'portfolio', 'contact'].map((sec) => (
                <a
                  key={sec}
                  href={`#${sec}`}
                  className={`nav-link ${activeSection === sec ? 'active' : ''}`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </a>
              ))}
            </nav>
          </header>

          {/* About Section */}
          <section id="about" className="section-container">
            <div className="section-header">
              <h2 className="heading">About Me</h2>
              <div className="heading-line"></div>
            </div>
            <p className="content bio-text">
              Computer Science graduate with a strong foundation in software development, problem-solving, and application design. Experienced in developing full-stack web applications using <strong>React.js</strong>, <strong>FastAPI</strong>, <strong>Node.js</strong>, <strong>Express.js</strong>, <strong>Spring Boot</strong>, and <strong>MongoDB</strong>. Passionate about building efficient, user-focused software solutions and continuously expanding technical expertise. Seeking an entry-level Software Developer role to contribute, learn, and grow professionally.
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">6+</div>
                <div className="stat-label">Full Stack & ML Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">14+</div>
                <div className="stat-label">Tech Stack Tools</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">2025</div>
                <div className="stat-label">B.Tech CSE Graduate</div>
              </div>
            </div>
          </section>

          {/* Professional Experience Section */}
          <section id="experience" className="section-container">
            <div className="section-header">
              <h2 className="heading">Professional Experience</h2>
              <div className="heading-line"></div>
            </div>

            <div className="experience-card glass-card">
              <div className="exp-header">
                <div>
                  <h3 className="exp-role-title">Junior Software Developer Intern</h3>
                  <div className="exp-company">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    Aarmarks Media Pvt Ltd, Kolhapur
                  </div>
                </div>
                <span className="exp-date">June 2026 – Present</span>
              </div>
              <ul className="exp-bullet-list">
                <li>Implemented <strong>lead search, filtering, bulk selection, and status management</strong>.</li>
                <li>Developed <strong>FastAPI REST APIs</strong> for leads, campaigns, and user/email-account data.</li>
                <li>Built <strong>custom reports and analytics</strong> with bar, pie, and line charts and time-based filtering.</li>
                <li>Implemented <strong>PDF report export</strong> using jsPDF and jspdf-autotable.</li>
                <li>Improved <strong>responsive UI, navigation, filtering, and data-table interactions</strong>.</li>
              </ul>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="section-container">
            <div className="section-header">
              <h2 className="heading">Technical Skills</h2>
              <div className="heading-line"></div>
            </div>

            <div className="filter-tabs">
              {[
                { id: 'all', label: 'All' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend' },
                { id: 'lang', label: 'Languages' },
                { id: 'tools', label: 'Database & Deployment' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`skill-filter-btn ${skillFilter === tab.id ? 'active' : ''}`}
                  onClick={() => setSkillFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid-container skills-grid">
              {filteredSkills.map((skill, idx) => (
                <div key={idx} className="item skill-card fade-in">
                  <img src={skill.icon} alt={skill.name} />
                  <h3>{skill.name}</h3>
                  <span className="skill-tag">{skill.tag}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section id="education" className="section-container">
            <div className="section-header">
              <h2 className="heading">Education</h2>
              <div className="heading-line"></div>
            </div>

            <div className="timeline-container">
              <div className="timeline-line"></div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content glass-card">
                  <span className="timeline-year">2021 – 2025</span>
                  <h3 className="degree">Bachelor of Technology in Computer Science & Engineering</h3>
                  <p className="college">Ashokrao Mane Group Of Institutions, Vathar</p>
                  <div className="timeline-footer">
                    <span className="grade-badge">CGPA: 6.85</span>
                    <span className="degree-tag">Degree</span>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content glass-card">
                  <span className="timeline-year">2019 – 2021</span>
                  <h3 className="degree">Higher Secondary Certificate (HSC)</h3>
                  <p className="college">Shriram Junior College, Kuditre</p>
                  <div className="timeline-footer">
                    <span className="grade-badge">Grade: First Class</span>
                    <span className="degree-tag">Class 12th</span>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content glass-card">
                  <span className="timeline-year">2018 – 2019</span>
                  <h3 className="degree">Secondary School Certificate (SSC)</h3>
                  <p className="college">Sangrul Highschool, Sangrul</p>
                  <div className="timeline-footer">
                    <span className="grade-badge">Grade: Distinction</span>
                    <span className="degree-tag">Class 10th</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Projects Section */}
          <section id="portfolio" className="section-container">
            <div className="section-header">
              <h2 className="heading">Featured Projects</h2>
              <div className="heading-line"></div>
            </div>

            <div className="filter-tabs">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'fullstack', label: 'Full Stack' },
                { id: 'web', label: 'Web Apps' },
                { id: 'ml', label: 'Machine Learning' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`project-filter-btn ${projectFilter === tab.id ? 'active' : ''}`}
                  onClick={() => setProjectFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="project-container">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="project glass-card"
                  onClick={() => setActiveModalProject(proj)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-img-wrapper">
                    <img src={proj.image} alt={proj.title} />
                    <div className="project-overlay">
                      <span className="overlay-btn">View Details</span>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <h3>{proj.title}</h3>
                    </div>
                    <p>{proj.description.slice(0, 110)}...</p>
                    <div className="tech-tags">
                      {proj.tech.slice(0, 3).map((t, i) => (
                        <span key={i}>{t}</span>
                      ))}
                    </div>
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      {proj.live && (
                        <a href={proj.live} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                          Live Demo
                        </a>
                      )}
                      {proj.backend && (
                        <a href={proj.backend} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                          API Docs
                        </a>
                      )}
                      {proj.github && !proj.backend && (
                        <a href={proj.github} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="section-container">
            <div className="section-header">
              <h2 className="heading">Get In Touch</h2>
              <div className="heading-line"></div>
            </div>

            <div className="contact-wrapper glass-card">
              <div className="contact-prompt">
                <h3>Let's work together!</h3>
                <p>I'm currently seeking entry-level Software Developer / Full Stack opportunities. Feel free to send a message or reach out directly.</p>
              </div>

              <form id="contact-form" className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="form-name">Your Name</label>
                  <input
                    type="text"
                    id="form-name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-email">Your Email</label>
                  <input
                    type="email"
                    id="form-email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-message">Message</label>
                  <textarea
                    id="form-message"
                    rows={4}
                    placeholder="Hi Niranjan, I'd like to discuss an opportunity..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer>
            <div className="footer-content">
              <p>&copy; 2025 Niranjan Kasote. Designed & Built with Precision.</p>
              <a href="#about" className="back-to-top" aria-label="Back to top">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </a>
            </div>
          </footer>
        </main>
      </div>

      {/* Project Details Modal */}
      {activeModalProject && (
        <div className="modal-backdrop open" onClick={() => setActiveModalProject(null)}>
          <div className="modal-container glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModalProject(null)} aria-label="Close dialog">
              &times;
            </button>
            <div className="modal-body">
              <div className="modal-img-wrapper">
                <img src={activeModalProject.image} alt={activeModalProject.title} />
              </div>
              <div className="modal-content">
                <h3 className="modal-title">{activeModalProject.title}</h3>
                <p className="modal-subtitle">{activeModalProject.subtitle}</p>
                <div className="modal-tech">
                  {activeModalProject.tech.map((t, idx) => (
                    <span key={idx} className="tech-tag">{t}</span>
                  ))}
                </div>
                <p className="modal-desc">{activeModalProject.description}</p>
                {activeModalProject.features && activeModalProject.features.length > 0 && (
                  <div className="modal-features">
                    <h4>Key Features</h4>
                    <ul>
                      {activeModalProject.features.map((f, idx) => (
                        <li key={idx}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {' '}{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="modal-links">
                  {activeModalProject.live && (
                    <a href={activeModalProject.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Live Demo
                    </a>
                  )}
                  {activeModalProject.backend && (
                    <a href={activeModalProject.backend} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      API Specs
                    </a>
                  )}
                  {activeModalProject.github && (
                    <a href={activeModalProject.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

