// Base JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.checked = savedTheme === 'dark';
        }
    }

    // Initialize font size from localStorage
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    document.body.className = `font-${savedFontSize}`;
    const fontSizeSelect = document.getElementById('font-size');
    if (fontSizeSelect) {
        fontSizeSelect.value = savedFontSize;
    }

    // Close settings dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const settingsDropdown = document.getElementById('settings-dropdown');
        const settingsButton = document.querySelector('.settings-btn');
        
        if (settingsDropdown && settingsButton && !settingsDropdown.contains(event.target) && !settingsButton.contains(event.target)) {
            settingsDropdown.classList.remove('show');
        }
    });

    // Add fade-in animation to main content
    const mainContent = document.querySelector('.content');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
});

// Toggle settings dropdown
function toggleSettings() {
    const dropdown = document.getElementById('settings-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update checkbox state
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = newTheme === 'dark';
    }
}

// Change font size
function changeFontSize() {
    const fontSizeSelect = document.getElementById('font-size');
    if (fontSizeSelect) {
        const fontSize = fontSizeSelect.value;
        document.body.className = `font-${fontSize}`;
        localStorage.setItem('fontSize', fontSize);
    }
}

// Utility functions for common UI interactions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:1rem;">&times;</button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)'};
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Loading spinner utility
function showLoading(element) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '⏳ 読み込み中...';
    spinner.style.cssText = `
        text-align: center;
        padding: 2rem;
        color: var(--text-color);
    `;
    
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    
    if (element) {
        element.innerHTML = '';
        element.appendChild(spinner);
    }
}

function hideLoading(element, content = '') {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    
    if (element) {
        element.innerHTML = content;
    }
}

// Form validation utilities
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--border-color)';
        }
    });
    
    return isValid;
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Format time utility
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Local storage utilities
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}
