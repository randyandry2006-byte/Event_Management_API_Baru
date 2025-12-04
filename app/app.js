// Global variables
let currentUser = null;
let authToken = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const appPage = document.getElementById('appPage');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    setupEventListeners();
});

// Check login status
function checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showApp();
        updateUserUI();
        loadDashboard();
    } else {
        showLogin();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Password toggle
        const toggleBtn = loginForm.querySelector('.toggle-password');
        const passwordInput = loginForm.querySelector('input[name="password"]');
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
    }
    
    // Create event form
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEvent);
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    showLoading();
    
    const formData = new FormData(loginForm);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://localhost:3333/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('✅ Login successful! Redirecting...', 'success', loginMessage);
            
            // Save user data
            authToken = result.token.token;
            currentUser = result.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            // Show app after delay
            setTimeout(() => {
                hideLoading();
                showApp();
                updateUserUI();
                loadDashboard();
            }, 1500);
            
        } else {
            hideLoading();
            showMessage(`❌ ${result.message || 'Login failed'}`, 'error', loginMessage);
        }
    } catch (error) {
        hideLoading();
        showMessage('❌ Error: Cannot connect to server', 'error', loginMessage);
        console.error('Login error:', error);
    }
}

// Use demo account
function useDemoAccount(email) {
    const emailInput = loginForm.querySelector('input[name="email"]');
    const passwordInput = loginForm.querySelector('input[name="password"]');
    
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = 'password123';
}

// Show app page
function showApp() {
    loginPage.classList.add('hidden');
    appPage.classList.remove('hidden');
}

// Show login page
function showLogin() {
    loginPage.classList.remove('hidden');
    appPage.classList.add('hidden');
}

// Update user UI
function updateUserUI() {
    if (!currentUser) return;
    
    // Update top navigation
    document.getElementById('topUserName').textContent = currentUser.name;
    document.getElementById('topUserEmail').textContent = currentUser.email;
    
    // Update avatar
    const avatar = document.getElementById('userAvatar');
    const currentAvatar = document.getElementById('currentUserAvatar');
    if (avatar) avatar.textContent = currentUser.name.charAt(0).toUpperCase();
    if (currentAvatar) currentAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    
    // Update dashboard welcome
    const dashboardName = document.getElementById('dashboardUserName');
    if (dashboardName) dashboardName.textContent = currentUser.name.split(' ')[0];
    
    // Update current user info in modal
    const currentUserNameFull = document.getElementById('currentUserNameFull');
    const currentUserEmailFull = document.getElementById('currentUserEmailFull');
    if (currentUserNameFull) currentUserNameFull.textContent = currentUser.name;
    if (currentUserEmailFull) currentUserEmailFull.textContent = currentUser.email;
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionId}Section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update active menu
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    const activeMenuItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`).parentElement;
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

// Fungsi untuk menyembunyikan modal user list
function hideUserList() {
    const modal = document.getElementById('userListModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Juga tambahkan fungsi untuk modal lainnya
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Show user list modal
async function showUserList() {
    try {
        // Data user dari seeder (sama dengan yang di database)
        const seededUsers = [
            { 
                id: 1, 
                name: 'Admin User', 
                email: 'admin@example.com', 
                role: 'Administrator',
                initials: 'AU'
            },
            { 
                id: 2, 
                name: 'Nabil Syahputra', 
                email: 'nabil@gmail.com', 
                role: 'Event Manager',
                initials: 'NS'
            },
            { 
                id: 3, 
                name: 'John Doe', 
                email: 'john@example.com', 
                role: 'User',
                initials: 'JD'
            },
            { 
                id: 4, 
                name: 'Jane Smith', 
                email: 'jane@example.com', 
                role: 'User',
                initials: 'JS'
            }
        ];
        
        const availableUsersList = document.getElementById('availableUsersList');
        if (!availableUsersList) return;
        
        availableUsersList.innerHTML = seededUsers
            .filter(user => user.email !== currentUser?.email)
            .map(user => `
                <div class="user-list-item" onclick="switchToUser('${user.email}')">
                    <div class="user-avatar-medium">
                        ${user.initials}
                    </div>
                    <div class="user-list-details">
                        <div class="user-list-name">${user.name}</div>
                        <div class="user-list-email">${user.email}</div>
                        <div class="user-list-role">
                            <span class="role-badge ${user.role.toLowerCase().replace(' ', '-')}">
                                ${user.role}
                            </span>
                        </div>
                    </div>
                    <div class="user-list-action">
                        <i class="fas fa-sign-in-alt"></i>
                    </div>
                </div>
            `).join('');
        
        // Tampilkan modal
        document.getElementById('userListModal').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Error loading user list', 'error');
    }
}

// Switch to another user
// Fungsi ini di app.js
async function switchToUser(email) {
    showLoading();
    
    try {
        // Gunakan password default dari seeder
        const password = 'password123';
        
        console.log(`Attempting to login as: ${email}`);
        
        const response = await fetch('http://localhost:3333/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        });

        console.log('Response status:', response.status);
        
        // Handle response
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Login error response:', errorText);
            throw new Error(`Login failed: ${response.status}`);
        }

        const result = await response.json();
        console.log('Login result:', result);
        
        if (response.ok && result.message === 'Login berhasil') {
            // Update current user
            authToken = result.token.token;
            currentUser = result.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            // Update UI
            updateUserUI();
            loadDashboard();
            hideUserList();
            hideLoading();
            
            // Show success message
            showNotification(`✅ Successfully switched to ${currentUser.name}`, 'success');
            
        } else {
            throw new Error(result.message || 'Login failed');
        }
        
    } catch (error) {
        hideLoading();
        console.error('Switch user error:', error);
        showNotification(`❌ Failed to switch user: ${error.message}`, 'error');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        authToken = null;
        currentUser = null;
        showLogin();
        showMessage('Logged out successfully', 'info', loginMessage);
    }
}

// Load dashboard data
async function loadDashboard() {
    showLoading();
    
    try {
        // Load events
        const eventsResponse = await fetch('http://localhost:3333/events', {
            headers: getAuthHeaders()
        });
        
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            
            // Update stats
            document.getElementById('totalEvents').textContent = events.length || 0;
            
            // Filter completed/upcoming events
            const today = new Date();
            const completed = events.filter(event => new Date(event.date) < today).length;
            const upcoming = events.filter(event => new Date(event.date) >= today).length;
            
            document.getElementById('completedEvents').textContent = completed;
            document.getElementById('upcomingEvents').textContent = upcoming;
            
            // Update recent events table
            const recentEventsTable = document.getElementById('recentEventsTable');
            if (recentEventsTable) {
                recentEventsTable.innerHTML = events.slice(0, 5).map(event => `
                    <tr>
                        <td>${event.title}</td>
                        <td>${new Date(event.date).toLocaleDateString()}</td>
                        <td>${event.location || 'N/A'}</td>
                        <td>
                            <span class="status-badge ${new Date(event.date) >= today ? 'upcoming' : 'completed'}">
                                ${new Date(event.date) >= today ? 'Upcoming' : 'Completed'}
                            </span>
                        </td>
                        <td>
                            <button class="btn-small" onclick="viewEvent(${event.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
            
            // Update next event
            const nextEvent = events.find(event => new Date(event.date) >= today);
            const nextEventElement = document.getElementById('nextEvent');
            if (nextEventElement && nextEvent) {
                nextEventElement.innerHTML = `
                    <div class="preview-icon">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="preview-info">
                        <h5>${nextEvent.title}</h5>
                        <p>${new Date(nextEvent.date).toLocaleDateString()} • ${nextEvent.location || 'TBD'}</p>
                    </div>
                `;
            }
        }
        
        // Load participants
        const participantsResponse = await fetch('http://localhost:3333/participants', {
            headers: getAuthHeaders()
        });
        
        if (participantsResponse.ok) {
            const participants = await participantsResponse.json();
            document.getElementById('totalParticipants').textContent = participants.length || 0;
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Error loading dashboard:', error);
        showMessage('Error loading dashboard data', 'error');
    }
}

// Show create event modal
function showCreateEventModal() {
    document.getElementById('createEventModal').classList.remove('hidden');
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Handle create event
async function handleCreateEvent(e) {
    e.preventDefault();
    showLoading();
    
    const formData = new FormData(e.target);
    const eventData = {
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location'),
        date: formData.get('date')
    };
    
    try {
        const response = await fetch('http://localhost:3333/events', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            showMessage('✅ Event created successfully!', 'success');
            closeModal('createEventModal');
            e.target.reset();
            loadDashboard();
        } else {
            const result = await response.json();
            showMessage(`❌ ${result.message || 'Failed to create event'}`, 'error');
        }
    } catch (error) {
        showMessage('❌ Error creating event', 'error');
        console.error('Create event error:', error);
    } finally {
        hideLoading();
    }
}

// Refresh dashboard
function refreshDashboard() {
    loadDashboard();
    showMessage('Dashboard refreshed', 'info');
}

// Export data
function exportData() {
    showMessage('Export feature coming soon!', 'info');
}

// Get auth headers
function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
}

// Show loading
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

// Hide loading
function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Show message
function showMessage(text, type = 'info', element = null) {
    const messageElement = element || document.getElementById('loginMessage');
    if (messageElement) {
        messageElement.innerHTML = text;
        messageElement.className = `message ${type}`;
        setTimeout(() => {
            messageElement.innerHTML = '';
            messageElement.className = 'message';
        }, 5000);
    }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya
    const existingNotif = document.querySelector('.notification-toast');
    if (existingNotif) existingNotif.remove();
    
    // Buat notifikasi baru
    const notif = document.createElement('div');
    notif.className = `notification-toast ${type}`;
    notif.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notif);
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (notif.parentElement) {
            notif.remove();
        }
    }, 5000);
}

// View event (placeholder)
function viewEvent(eventId) {
    showMessage(`Viewing event ${eventId}`, 'info');
}

// Add CSS for status badges
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .status-badge.upcoming {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-badge.completed {
        background: #d4edda;
        color: #155724;
    }
    
    .user-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .user-item:hover {
        background: #f5f5f5;
        border-color: #4361ee;
    }
    
    .btn-small {
        padding: 6px 12px;
        border: 1px solid #e0e0e0;
        background: white;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .btn-small:hover {
        background: #f5f5f5;
    }
`;
document.head.appendChild(style);