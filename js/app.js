/**
 * Main Application Entry Point
 * HockeySense AI - Talent Evaluation Platform
 */

import { appState } from './models/dataModel.js';
import { DashboardView } from './views/DashboardView.js';
import { EvaluationView } from './views/EvaluationView.js';
import { ReviewView } from './views/ReviewView.js';

class App {
    constructor() {
        this.mainContainer = document.getElementById('app-main');
        this.currentView = null;
        this.init();
    }

    init() {
        // Set up role switcher
        this.setupRoleSwitcher();
        
        // Set up view change listener
        window.addEventListener('view-change', (e) => {
            this.navigateToView(e.detail.view);
        });

        // Initial view
        this.navigateToView(appState.currentView);
    }

    setupRoleSwitcher() {
        const coachBtn = document.getElementById('role-coach');
        const playerBtn = document.getElementById('role-player');
        const avatar = document.getElementById('user-avatar');

        const updateRole = (role) => {
            appState.currentUser = role;
            coachBtn.classList.toggle('active', role === 'coach');
            playerBtn.classList.toggle('active', role === 'player');
            avatar.textContent = role === 'coach' ? 'CO' : 'PL';
            
            // Re-render current view with new role
            this.navigateToView(appState.currentView);
        };

        coachBtn.addEventListener('click', () => updateRole('coach'));
        playerBtn.addEventListener('click', () => updateRole('player'));

        // Set initial state
        coachBtn.classList.add('active');
    }

    navigateToView(viewName) {
        appState.currentView = viewName;

        // Clean up previous view
        if (this.currentView && typeof this.currentView.destroy === 'function') {
            this.currentView.destroy();
        }

        // Render new view
        switch (viewName) {
            case 'dashboard':
                this.currentView = new DashboardView(this.mainContainer);
                break;
            case 'evaluate':
                this.currentView = new EvaluationView(this.mainContainer);
                break;
            case 'review':
                this.currentView = new ReviewView(this.mainContainer);
                break;
            default:
                console.error(`Unknown view: ${viewName}`);
                this.currentView = new DashboardView(this.mainContainer);
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}

