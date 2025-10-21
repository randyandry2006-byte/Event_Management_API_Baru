const API_BASE = 'http://localhost:3333';
let isLoggedIn = false;

// Check if user is already logged in (from localStorage)
function checkLoginStatus() {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') {
        isLoggedIn = true;
        showApp();
    }
}

// Login Form
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const username = formData.get('username');
    const password = formData.get('password');

    // Simple authentication (in real app, this would call your API)
    if (username === 'admin' && password === 'password') {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        showApp();
        showMessage('loginMessage', 'Login berhasil!', true);
    } else {
        showMessage('loginMessage', 'Username atau password salah!', false);
    }
});

// Show/Hide sections
function showApp() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('appSection').classList.remove('hidden');
    loadAllData();
    updateDashboard();
}

function logout() {
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('appSection').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

// Event Form
document.getElementById('eventForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!isLoggedIn) {
        showMessage('eventMessage', 'Silakan login terlebih dahulu!', false);
        return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showMessage('eventMessage', result.message || 'Event berhasil dibuat!', response.ok);
        if (response.ok) {
            this.reset();
            loadAllData();
            updateDashboard();
        }
    } catch (error) {
        showMessage('eventMessage', 'Error: ' + error.message, false);
    }
});

// Participant Form
document.getElementById('participantForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!isLoggedIn) {
        showMessage('participantMessage', 'Silakan login terlebih dahulu!', false);
        return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showMessage('participantMessage', result.message || 'Participant berhasil ditambahkan!', response.ok);
        if (response.ok) {
            this.reset();
            loadAllData();
        }
    } catch (error) {
        showMessage('participantMessage', 'Error: ' + error.message, false);
    }
});

// Registration Form
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!isLoggedIn) {
        showMessage('registrationMessage', 'Silakan login terlebih dahulu!', false);
        return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE}/registrations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_id: data.event_id,
                participant_id: data.participant_id
            })
        });
        
        const result = await response.json();
        showMessage('registrationMessage', result.message || 'Registration berhasil dibuat!', response.ok);
        if (response.ok) {
            this.reset();
            loadAllData();
        }
    } catch (error) {
        showMessage('registrationMessage', 'Error: ' + error.message, false);
    }
});

// Load Data Functions
async function loadAllData() {
    if (!isLoggedIn) return;
    
    await loadEvents();
    await loadParticipants();
    await loadRegistrations();
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/events`);
        const result = await response.json();
        const events = result.data || result;
        
        document.getElementById('eventsData').innerHTML = events.length > 0 
            ? events.map(event => `
                <div class="data-item">
                    <strong>${event.title}</strong><br>
                    <small>${event.location || 'No location'} • ${formatDisplayDate(event.date)}</small>
                </div>
            `).join('')
            : '<p>No events found</p>';
    } catch (error) {
        document.getElementById('eventsData').innerHTML = '<p>Error loading events</p>';
    }
}

async function loadParticipants() {
    try {
        const response = await fetch(`${API_BASE}/participants`);
        const result = await response.json();
        const participants = result.data || result;
        
        document.getElementById('participantsData').innerHTML = participants.length > 0 
            ? participants.map(participant => `
                <div class="data-item">
                    <strong>${participant.name}</strong><br>
                    <small>${participant.email}</small>
                </div>
            `).join('')
            : '<p>No participants found</p>';
    } catch (error) {
        document.getElementById('participantsData').innerHTML = '<p>Error loading participants</p>';
    }
}

async function loadRegistrations() {
    try {
        const response = await fetch(`${API_BASE}/registrations`);
        const result = await response.json();
        const registrations = result.data || result;
        
        document.getElementById('registrationsData').innerHTML = registrations.length > 0 
            ? registrations.map(reg => `
                <div class="data-item">
                    <strong>Event ID: ${reg.eventId}</strong><br>
                    <small>Participant ID: ${reg.participantId}</small>
                </div>
            `).join('')
            : '<p>No registrations found</p>';
    } catch (error) {
        document.getElementById('registrationsData').innerHTML = '<p>Error loading registrations</p>';
    }
}

// Dashboard Functions
async function updateDashboard() {
    if (!isLoggedIn) return;
    
    try {
        const response = await fetch(`${API_BASE}/events`);
        const result = await response.json();
        const events = result.data || result;
        
        // Calculate statistics
        const today = new Date().toISOString().split('T')[0];
        const totalEvents = events.length;
        const completedEvents = events.filter(event => event.date < today).length;
        const upcomingEvents = events.filter(event => event.date >= today).length;
        
        // Update dashboard numbers
        document.getElementById('totalEvents').textContent = totalEvents;
        document.getElementById('completedEvents').textContent = completedEvents;
        document.getElementById('upcomingEvents').textContent = upcomingEvents;
        
        // Update recent events list
        updateRecentEvents(events);
        
    } catch (error) {
        console.error('Error updating dashboard:', error);
        // Fallback to default values
        document.getElementById('totalEvents').textContent = '12';
        document.getElementById('completedEvents').textContent = '8';
        document.getElementById('upcomingEvents').textContent = '4';
    }
}

function updateRecentEvents(events) {
    const recentEventsContainer = document.querySelector('.events-list');
    
    if (events.length === 0) {
        recentEventsContainer.innerHTML = '<p>No events found</p>';
        return;
    }
    
    // Sort events by date (newest first) and take latest 2
    const recentEvents = events
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);
    
    const today = new Date().toISOString().split('T')[0];
    
    recentEventsContainer.innerHTML = recentEvents.map(event => {
        const isCompleted = event.date < today;
        const statusClass = isCompleted ? 'completed' : 'upcoming';
        const statusText = isCompleted ? 'Completed' : 'Upcoming';
        
        return `
            <div class="event-card">
                <div class="event-header">
                    <span class="event-title">${event.title}</span>
                    <span class="event-status ${statusClass}">${statusText}</span>
                </div>
                <div class="event-date">${formatDisplayDate(event.date)}</div>
            </div>
        `;
    }).join('');
}

function formatDisplayDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function showMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${isSuccess ? 'success' : 'error'}`;
}

// Check login status when page loads
checkLoginStatus();