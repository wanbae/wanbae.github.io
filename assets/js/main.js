// ========================================
// Theme Management
// ========================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ========================================
// Smooth Scroll
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Intersection Observer for Animations
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card, .infra-card, .tech-category').forEach(el => {
        observer.observe(el);
    });
});

// ========================================
// Service Status Check (Optional)
// ========================================

async function checkServiceStatus() {
    const services = [
        { name: 'ChargeBook', url: 'https://ev.proudeng.com' },
        { name: 'Proud English', url: 'https://audio.proudeng.com' }
    ];

    // This is a simple client-side check
    // For production, use the status.json from GitHub Actions
    for (const service of services) {
        try {
            const badge = document.querySelector(`.project-card:has(h3:contains("${service.name}")) .status-badge`);
            // Note: CORS will prevent this from working directly
            // This is just a placeholder for future implementation
        } catch (error) {
            console.log(`Could not check ${service.name}`);
        }
    }
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Add scroll reveal effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.hero');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add hover effect to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--primary)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--border-color)';
        });
    });

    // Prevent disabled links from being clicked
    document.querySelectorAll('.link-btn.disabled').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
});

// ========================================
// Easter Egg - Console Message
// ========================================

console.log('%c👋 Hello Developer!', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cInterested in the code? Check out: https://github.com/wanbae', 'font-size: 14px; color: #4a5568;');
