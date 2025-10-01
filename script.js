// Global variables
let modpackData = null;

// DOM elements
const serversContainer = document.getElementById('servers-container');
const websiteTitle = document.getElementById('website-title');
const websiteDescription = document.getElementById('website-description');
const toast = document.getElementById('toast');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadModpackData();
});

// Load modpack data from JSON file
async function loadModpackData() {
    try {
        showLoading();
        const response = await fetch('modpack-data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        modpackData = await response.json();
        renderWebsite();
    } catch (error) {
        console.error('Error loading modpack data:', error);
        showError('Failed to load modpack data. Please check if modpack-data.json exists and is valid.');
    }
}

// Show loading state
function showLoading() {
    serversContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>Loading modpack data...</p>
        </div>
    `;
}

// Show error state
function showError(message) {
    serversContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-triangle" style="color: #e53e3e;"></i>
            <p>${message}</p>
        </div>
    `;
}

// Render the entire website
function renderWebsite() {
    if (!modpackData) return;
    
    // Update website info
    websiteTitle.textContent = modpackData.website_info.title;
    websiteDescription.textContent = modpackData.website_info.description;
    
    // Render servers
    renderServers();
}

// Render all servers
function renderServers() {
    if (!modpackData || !modpackData.servers) return;
    
    serversContainer.innerHTML = modpackData.servers.map(server => `
        <div class="server-card">
            <div class="server-header">
                <h2 class="server-name">${server.name}</h2>
                <div class="server-info">
                    <div class="info-item clickable" onclick="copyToClipboard('${server.minecraft_version}', 'Minecraft version')">
                        <i class="fas fa-gamepad"></i>
                        MC ${server.minecraft_version}
                    </div>
                    <div class="info-item clickable" onclick="copyToClipboard('${server.forge_version}', 'Forge version')">
                        <i class="fas fa-cog"></i>
                        Forge ${server.forge_version}
                    </div>
                    <div class="info-item ip-address" onclick="copyToClipboard('${server.ip}', 'IP address')">
                        <i class="fas fa-copy"></i>
                        ${server.ip}
                    </div>
                </div>
            </div>
            
            <div class="modpacks-section">
                <h3 class="modpacks-title">
                    <i class="fas fa-download"></i>
                    Available Modpacks
                </h3>
                <div class="modpack-list">
                    ${server.modpacks.map(modpack => renderModpack(modpack)).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Render individual modpack
function renderModpack(modpack) {
    return `
        <div class="modpack-item">
            <div class="modpack-header">
                <div>
                    <h4 class="modpack-name">${modpack.name}</h4>
                    <div class="modpack-stats">
                        <span><i class="fas fa-archive"></i> ${modpack.file_size}</span>
                        <span><i class="fas fa-puzzle-piece"></i> ${modpack.mod_count} mods</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(modpack.last_updated)}</span>
                    </div>
                </div>
            </div>
            <p class="modpack-description">${modpack.description}</p>
            <div class="modpack-actions">
                <a href="${modpack.download_url}" class="download-btn" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-download"></i>
                    Download Modpack
                </a>
                <div class="modpack-meta">
                    Updated: ${formatDate(modpack.last_updated)}
                </div>
            </div>
        </div>
    `;
}

// Copy text to clipboard
async function copyToClipboard(text, type = 'text') {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`${type} copied to clipboard!`);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(`${type} copied to clipboard!`);
    }
}

// Show toast notification
function showToast(message) {
    const toastElement = document.getElementById('toast');
    const toastText = toastElement.querySelector('span');
    
    toastText.textContent = message;
    toastElement.classList.add('show');
    
    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility function to refresh data (can be called from browser console)
function refreshData() {
    loadModpackData();
}

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add keyboard support for IP copying
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const target = e.target;
            if (target.classList.contains('ip-address')) {
                e.preventDefault();
                target.click();
            }
        }
    });
});

// Add error handling for failed downloads
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('download-btn')) {
        // Add analytics or tracking here if needed
        console.log('Download initiated:', e.target.href);
    }
});
