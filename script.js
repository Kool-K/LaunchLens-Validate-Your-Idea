// --- 1. MOCK DATA & CONFIG ---
const mockResults = {
    web: [
        { title: 'SimilarWeb', url: 'similarweb.com', description: 'Market intelligence platform providing website traffic and engagement metrics for competitive analysis.' },
        { title: 'Ahrefs', url: 'ahrefs.com', description: 'Comprehensive SEO toolset for keyword research, competitor analysis, and website optimization.' },
        { title: 'BuzzSumo', url: 'buzzsumo.com', description: 'Content discovery and social media analytics platform for finding trending topics and influencers.' },
    ],
    playStore: [
        { name: 'App Annie Intelligence', developer: 'App Annie', rating: 4.2 },
        { name: 'Sensor Tower', developer: 'Sensor Tower Inc.', rating: 4.5 },
    ],
    appStore: [
        { name: 'Mobile Action', developer: 'Mobile Action', rating: 4.1 },
        { name: 'App Radar', developer: 'App Radar GmbH', rating: 4.3 },
    ],
    github: [
        { repoName: 'market-research-toolkit', author: 'research-labs', description: 'Open source toolkit for automated market research and web scraping capabilities.', stars: 1247, forks: 89 },
        { repoName: 'idea-validator', author: 'startup-tools', description: 'ML powered idea validation platform with sentiment analysis and market trend detection.', stars: 892, forks: 156 },
    ],
    courses: [
        { title: 'Market Research & Competitive Analysis', instructor: 'Sarah Johnson' },
        { title: 'Lean Startup Methodology', instructor: 'Eric Ries' },
    ]
};

const loadingMessages = [
    "Scanning the web...",
    "Checking app stores...",
    "Analyzing GitHub repositories...",
    "Finding relevant courses...",
    "Compiling insights..."
];

// --- 2. ELEMENT REFERENCES ---
const body = document.body;
const themeToggleButton = document.getElementById('theme-toggle');
const heroSection = document.getElementById('hero-section');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingText = document.getElementById('loading-text');
const loadingDotsContainer = document.getElementById('loading-dots');
const resultsSection = document.getElementById('results-section');
const searchForm = document.getElementById('search-form');
const ideaInput = document.getElementById('idea-input');
const analyzeButton = document.getElementById('analyze-button');
const ideaDisplay = document.getElementById('idea-display');
const resetButton = document.getElementById('reset-button');

// --- 3. THEME TOGGLE LOGIC ---
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
}

themeToggleButton.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
});

// Apply saved theme on initial load
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);


// --- 4. AUTO-EXPANDING TEXTAREA LOGIC ---
ideaInput.addEventListener('input', () => {
    ideaInput.style.height = 'auto'; // Reset height to recalculate
    ideaInput.style.height = `${ideaInput.scrollHeight}px`; // Set to content height
});


// --- 5. SEARCH & DISPLAY LOGIC ---
let loadingInterval;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idea = ideaInput.value.trim();
    if (!idea) return;

    // Start loading state
    heroSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    analyzeButton.disabled = true;
    analyzeButton.querySelector('span').textContent = 'Analyzing...';
    
    // Start informative loading text and dots
    let messageIndex = 0;
    loadingText.textContent = loadingMessages[messageIndex];
    updateLoadingDots(messageIndex);

    loadingInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingText.textContent = loadingMessages[messageIndex];
        updateLoadingDots(messageIndex);
    }, 1200);

    // Simulate API delay
    setTimeout(() => {
        clearInterval(loadingInterval);
        ideaDisplay.textContent = idea;
        populateResults();
        loadingIndicator.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        analyzeButton.disabled = false;
        analyzeButton.querySelector('span').textContent = 'Analyze Idea';
    }, 1200 * loadingMessages.length);
});

resetButton.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    heroSection.classList.remove('hidden');
    ideaInput.value = '';
    // Reset textarea height
    ideaInput.style.height = 'auto'; 
});

// --- 6. DYNAMIC CONTENT CREATION ---
function updateLoadingDots(activeIndex) {
    loadingDotsContainer.innerHTML = '';
    loadingMessages.forEach((_, index) => {
        const dot = document.createElement('div');
        if (index === activeIndex) {
            dot.classList.add('active');
        }
        loadingDotsContainer.appendChild(dot);
    });
}

function populateResults() {
    const oldCategories = resultsSection.querySelectorAll('.results-category');
    oldCategories.forEach(cat => cat.remove());

    const categories = {
        'Web & Website Competitors': { data: mockResults.web, icon: getIconHTML('globe') },
        'Google Play Store Competitors': { data: mockResults.playStore, icon: getIconHTML('playStore') },
        'Apple App Store Competitors': { data: mockResults.appStore, icon: getIconHTML('appStore') },
        'Open Source Projects (GitHub)': { data: mockResults.github, icon: getIconHTML('code') },
        'Relevant Courses': { data: mockResults.courses, icon: getIconHTML('graduationCap') }
    };

    for (const [categoryTitle, { data, icon }] of Object.entries(categories)) {
        if (data.length === 0) continue;

        const categorySection = document.createElement('div');
        categorySection.className = 'results-category';
        
        const grid = document.createElement('div');
        grid.className = 'results-grid';

        data.forEach(result => {
            grid.innerHTML += createCardHTML(result, categoryTitle);
        });
        
        categorySection.innerHTML = `<h2 class="results-category-title">${icon}${categoryTitle}</h2>`;
        categorySection.appendChild(grid);
        resultsSection.appendChild(categorySection);
    }
}

function createCardHTML(result, category) {
    const iconStar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`;
    const iconFork = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`;
    
    if (category.includes('Web')) {
        return `
        <div class="card">
            <h3>${result.title}</h3>
            <p class="line-clamp-2">${result.description}</p>
            <div class="card-footer"><span>${result.url}</span></div>
        </div>`;
    }
    if (category.includes('Store')) {
        return `
        <div class="card">
            <h3>${result.name}</h3>
            <p>by ${result.developer}</p>
            <div class="card-footer">
                <div class="stat" style="color: #f59e0b;">${iconStar} <span>${result.rating}</span></div>
            </div>
        </div>`;
    }
    if (category.includes('GitHub')) {
        return `
        <div class="card">
            <h3>${result.repoName}</h3>
            <p>by ${result.author}</p>
            <p class="line-clamp-2" style="margin-top: 0.5rem;">${result.description}</p>
            <div class="card-footer">
                <div class="stat">${iconStar} <span>${result.stars.toLocaleString()}</span></div>
                <div class="stat">${iconFork} <span>${result.forks.toLocaleString()}</span></div>
            </div>
        </div>`;
    }
    if (category.includes('Courses')) {
         return `
        <div class="card">
            <h3>${result.title}</h3>
            <p>by ${result.instructor}</p>
        </div>`;
    }
    return '';
}

function getIconHTML(iconName) {
    const icons = {
        globe: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
        playStore: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16L18.25 12z"/></svg>`,
        appStore: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z"/><path d="m8 14 1.5-2.5L12 7l2.5 4.5L16 14"/><path d="M7 18h10"/></svg>`,
        code: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
        graduationCap: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 12 3 12 0v-5"></path></svg>`
    };
    return icons[iconName] || '';
}
