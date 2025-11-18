/**
 * Dashboard View - Team management and triage interface
 * Section 4.1 of requirements
 */

import { appState } from '../models/dataModel.js';

export class DashboardView {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        const players = appState.players;
        const pendingCount = players.filter(p => p.status === 'Review Pending').length;
        const completedCount = players.filter(p => p.status === 'Completed').length;
        const neededCount = players.filter(p => p.status === 'Self-Rating Needed').length;

        this.container.innerHTML = `
            <div class="dashboard-view">
                <!-- Macro Triage Header -->
                <div class="dashboard-header">
                    <div class="dashboard-kpi blue">
                        <div class="dashboard-kpi-label">Evaluation Status</div>
                        <div class="dashboard-kpi-value">
                            <span class="dashboard-kpi-number">${completedCount}/${players.length}</span>
                            <span class="dashboard-kpi-subtext">${pendingCount} Pending Review</span>
                        </div>
                    </div>
                    <div class="dashboard-kpi green">
                        <div class="dashboard-kpi-label">Team Avg Score</div>
                        <div class="dashboard-kpi-value">
                            <span class="dashboard-kpi-number">7.4</span>
                            <span class="dashboard-kpi-subtext">↗ +0.3 vs last cycle</span>
                        </div>
                    </div>
                    <div class="dashboard-kpi gradient">
                        <div class="dashboard-kpi-label">Next Match</div>
                        <div class="dashboard-kpi-value">
                            <div>
                                <div style="font-size: 24px; font-weight: 700; margin-top: 4px;">vs. Amsterdam HC</div>
                                <div style="font-size: 14px; margin-top: 4px; opacity: 0.9;">Saturday, 14:00</div>
                            </div>
                            <svg class="dashboard-kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Roster Management -->
                <div class="roster-section">
                    <div class="roster-header">
                        <h2 class="roster-title">Roster & Ratings</h2>
                        <div class="roster-actions">
                            <button class="btn btn-secondary" style="font-size: 14px; padding: 6px 12px;">Filter</button>
                            <button class="btn btn-secondary" style="font-size: 14px; padding: 6px 12px;">Sort</button>
                        </div>
                    </div>
                    <table class="roster-table">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Status</th>
                                <th>Rating Gap</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${players.map(player => this.renderPlayerRow(player)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Attach event listeners
        this.attachEventListeners();
    }

    renderPlayerRow(player) {
        const statusClass = {
            'Completed': 'completed',
            'Review Pending': 'pending',
            'Self-Rating Needed': 'needed'
        }[player.status] || 'needed';

        const gapHtml = player.gap !== null ? `
            <div class="gap-indicator">
                <div class="gap-bar">
                    <div class="gap-bar-fill ${player.gap > 0.5 ? 'high' : 'low'}" 
                         style="width: ${Math.min(100, player.gap * 100)}%"></div>
                </div>
                <span class="gap-value">${player.gap}</span>
            </div>
        ` : `
            <span style="font-size: 12px; color: #9ca3af; font-style: italic;">Waiting for data</span>
        `;

        return `
            <tr data-player-id="${player.id}">
                <td>
                    <div class="player-info">
                        <div class="player-avatar">${player.avatar}</div>
                        <div class="player-details">
                            <div class="player-name">${player.name}</div>
                            <div class="player-position">${player.position}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${player.status}</span>
                </td>
                <td>${gapHtml}</td>
                <td>
                    <button class="eval-btn" data-player-id="${player.id}" 
                            style="color: #2563eb; font-size: 14px; font-weight: 500; background: none; border: none; cursor: pointer; text-decoration: underline;">
                        Open Eval
                    </button>
                </td>
            </tr>
        `;
    }

    attachEventListeners() {
        const evalButtons = this.container.querySelectorAll('.eval-btn');
        evalButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const playerId = parseInt(e.target.dataset.playerId);
                appState.setSelectedPlayer(playerId);
                appState.currentView = 'evaluate';
                // Dispatch custom event to notify app
                window.dispatchEvent(new CustomEvent('view-change', { 
                    detail: { view: 'evaluate' } 
                }));
            });
        });
    }
}

