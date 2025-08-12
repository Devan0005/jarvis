// DOM Elements
const orderForm = document.getElementById('orderForm');
const navLinks = document.querySelectorAll('.nav-menu a');

// Admin access variables (simplified - no multiple clicks needed)

// Smooth scrolling for navigation links (only for internal anchor links)
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for internal anchor links (starting with #)
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        // For external links (services.html, customers.html, etc.), allow normal navigation
    });
});

// Form submission handling
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(orderForm);
    const projectData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        projectType: formData.get('projectType'),
        budget: formData.get('budget'),
        timeline: formData.get('timeline'),
        description: formData.get('description'),
        submittedAt: new Date().toISOString()
    };
    
    // Basic form validation
    if (!projectData.name || !projectData.email || !projectData.projectType || !projectData.description) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(projectData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    submitProjectRequest(projectData);
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate project request submission
function submitProjectRequest(data) {
    // Show loading state
    const submitBtn = orderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showMessage('Thank you! Your project request has been submitted. We\'ll get back to you within 24 hours.', 'success');
        
        // Send email notification
        sendEmailNotification(data);
        
        // Reset form
        orderForm.reset();
        
        // Log project data (in real implementation, this would be sent to a server)
        console.log('Project Request Submitted:', data);
        
        // Store in localStorage for demo purposes
        storeProjectRequest(data);
        
    }, 2000);
}

// Store project request in localStorage (demo purposes)
function storeProjectRequest(data) {
    let projects = JSON.parse(localStorage.getItem('projectRequests') || '[]');
    projects.push(data);
    localStorage.setItem('projectRequests', JSON.stringify(projects));
}

// Send email notification for new orders
function sendEmailNotification(data) {
    const businessEmail = 'gamingspider0005@gmail.com';
    const estimate = calculateEstimate();
    
    // Check if EmailJS is available
    if (typeof emailjs !== 'undefined') {
        // Use EmailJS to send actual email
        sendEmailViaEmailJS(data, estimate);
    } else {
        // Fallback to mailto (your current method)
        sendEmailViaMailto(data, estimate);
    }
}

// Send email using EmailJS service (actual email delivery)
function sendEmailViaEmailJS(data, estimate) {
    const templateParams = {
        to_email: 'gamingspider0005@gmail.com',
        from_name: data.name,
        from_email: data.email,
        phone: data.phone || 'Not provided',
        project_type: data.projectType,
        budget_range: data.budget || 'Not specified',
        timeline: data.timeline || 'Not specified',
        estimated_price: `₹${estimate}`,
        project_description: data.description,
        submitted_time: new Date(data.submittedAt).toLocaleString('en-IN'),
        reply_to: data.email
    };

    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
        .then(function(response) {
            console.log('✅ Email sent successfully!', response.status, response.text);
            showMessage('Email notification sent successfully!', 'success');
        })
        .catch(function(error) {
            console.log('❌ Email sending failed:', error);
            // Fallback to mailto if EmailJS fails
            sendEmailViaMailto(data, estimate);
        });
}

// Fallback email method using mailto
function sendEmailViaMailto(data, estimate) {
    const businessEmail = 'gamingspider0005@gmail.com';
    const subject = `New Project Request - ${data.projectType} from ${data.name}`;
    const body = `
New Project Request Details:

Customer Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}

Project Details:
- Type: ${data.projectType}
- Budget Range: ${data.budget || 'Not specified'}
- Timeline: ${data.timeline || 'Not specified'}
- Estimated Price: ₹${estimate}

Project Description:
${data.description}

Submitted: ${new Date(data.submittedAt).toLocaleString('en-IN')}

Please respond to the customer within 24 hours.
    `.trim();
    
    const mailtoLink = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
        window.open(mailtoLink, '_blank');
        console.log('📧 Email client opened for:', data.name);
    } catch (error) {
        console.log('Could not open email client, email details logged:', {
            to: businessEmail,
            subject: subject,
            body: body
        });
    }
}

// Send confirmation email to customer
function sendCustomerConfirmation(data) {
    const subject = 'Project Request Received - FreelanceProjects';
    const body = `
Dear ${data.name},

Thank you for your project request! We have received your inquiry for a ${data.projectType} project.

Your Request Details:
- Project Type: ${data.projectType}
- Budget Range: ${data.budget || 'Not specified'}
- Timeline: ${data.timeline || 'Not specified'}

We will review your requirements and get back to you within 24 hours with a detailed quote and timeline.

If you have any immediate questions, please reply to this email or contact us at gamingspider0005@gmail.com.

Best regards,
FreelanceProjects Team
    `.trim();
    
    const customerMailto = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    console.log('Customer confirmation email prepared for:', data.email);
    // Note: In a real implementation, this would be sent automatically via a backend service
}

// Show success/error messages
function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = orderForm.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    
    // Insert at the beginning of the form
    orderForm.insertBefore(messageDiv, orderForm.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Add animation to service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Add hover effects to navigation (only on desktop)
    const navLogo = document.querySelector('.nav-logo h2');
    if (navLogo) {
        navLogo.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        navLogo.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'scale(1)';
            }
        });
        
        // Add transition to logo
        navLogo.style.transition = 'transform 0.3s ease';
    }
    
    // Admin access - click detection
    const secretLogo = document.getElementById('secretLogo');
    if (secretLogo) {
        secretLogo.addEventListener('click', handleAdminClick);
        console.log('🔐 Admin access initialized! Click the logo to access admin panel.');
    } else {
        console.log('❌ Admin logo element not found!');
    }
});

// Handle mobile navigation (if needed for future enhancements)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Utility function to get all project requests (for future admin panel)
function getAllProjectRequests() {
    return JSON.parse(localStorage.getItem('projectRequests') || '[]');
}

// Utility function to clear all project requests (for testing)
function clearProjectRequests() {
    localStorage.removeItem('projectRequests');
    console.log('All project requests cleared');
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceID: 'service_your_service_id', // You'll need to replace this
    templateID: 'template_your_template_id', // You'll need to replace this
    publicKey: 'your_public_key' // You'll need to replace this
};

// Initialize EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized successfully!');
    } else {
        console.log('EmailJS not loaded. Using fallback email method.');
    }
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change hamburger icon
            const icon = navToggle.querySelector('span');
            if (navMenu.classList.contains('active')) {
                icon.textContent = '✕';
            } else {
                icon.textContent = '☰';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.querySelector('span').textContent = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.querySelector('span').textContent = '☰';
            }
        });
    }
}

// Add some console logs for debugging
console.log('FreelanceProjects website loaded successfully!');
console.log('Available functions: getAllProjectRequests(), clearProjectRequests()');
console.log('Email service: Ready to send notifications to gamingspider0005@gmail.com');

// Dynamic pricing calculation (basic example)
function calculateEstimate() {
    const projectType = document.getElementById('projectType').value;
    const timeline = document.getElementById('timeline').value;
    
    let basePrice = 0;
    
    switch(projectType) {
        case 'student':
            basePrice = 299;
            break;
        case 'application':
            basePrice = 599;
            break;
        case 'website':
            basePrice = 899;
            break;
        default:
            basePrice = 599;
    }
    
    // Timeline multiplier
    if (timeline === '1-week') {
        basePrice *= 1.5; // Rush job
    }
    
    return basePrice;
}

// Add real-time form updates
document.getElementById('projectType')?.addEventListener('change', function() {
    const estimate = calculateEstimate();
    console.log(`Estimated price: ₹${estimate}`);
    // Could show this to user in future enhancement
});

document.getElementById('timeline')?.addEventListener('change', function() {
    const estimate = calculateEstimate();
    console.log(`Estimated price: ₹${estimate}`);
    // Could show this to user in future enhancement
});

// Admin access function (simplified)
function handleAdminClick(event) {
    event.preventDefault();
    
    // Visual feedback for click
    const secretLogo = document.getElementById('secretLogo');
    if (secretLogo) {
        secretLogo.style.transform = 'scale(0.95)';
        secretLogo.style.background = '#3498db';
        secretLogo.style.borderRadius = '5px';
        secretLogo.style.padding = '2px 5px';
        
        setTimeout(() => {
            secretLogo.style.transform = 'scale(1)';
            secretLogo.style.background = 'transparent';
            secretLogo.style.padding = '0';
        }, 150);
    }
    
    console.log('🔐 Opening admin panel...');
    
    // Small delay for visual feedback, then open admin
    setTimeout(() => {
        openAdminPanel();
    }, 200);
}

function openAdminPanel() {
    console.log('🔐 Admin access granted!');
    
    // Navigate to admin page
    window.location.href = 'admin.html';
}

// Removed: generateAdminHTML function (no longer needed - using separate admin.html page)

function calculateProjectEstimate(projectType, timeline) {
    let basePrice = 0;
    
    switch(projectType) {
        case 'student':
            basePrice = 299;
            break;
        case 'application':
            basePrice = 599;
            break;
        case 'website':
            basePrice = 899;
            break;
        default:
            basePrice = 599;
    }
    
    // Timeline multiplier
    if (timeline === '1-week') {
        basePrice *= 1.5; // Rush job
    }
    
    return basePrice;
}

function showAdminInCurrentWindow() {
    // Fallback: show admin data in console and alert
    const orders = getAllProjectRequests();
    console.log('🔐 ADMIN PANEL - All Orders:', orders);
    alert(`Admin Access: Found ${orders.length} orders. Check browser console for details.`);
} 