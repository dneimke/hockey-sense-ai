/**
 * Evaluation View - Scoring engine for Level 2 Constructs
 * Section 4.2 of requirements
 */

import { appState } from '../models/dataModel.js';
import { SCORING_MODEL, calculateParameterScore } from '../models/scoringModel.js';
import { ScoreInput } from '../components/ScoreInput.js';

export class EvaluationView {
    constructor(container) {
        this.container = container;
        this.player = appState.getCurrentPlayer();
        this.constructScores = this.player.getConstructScores(appState.currentUser) || {};
        this.scoreInputs = {};
        this.render();
    }

    render() {
        const isPlayer = appState.currentUser === 'player';
        const isLocked = isPlayer && this.player.status === 'Completed';

        this.container.innerHTML = `
            <div class="evaluation-view">
                <!-- Sidebar Summary -->
                <div class="evaluation-sidebar">
                    <div class="evaluation-sidebar-header">
                        <div class="evaluation-sidebar-avatar">${this.player.avatar}</div>
                        <div class="evaluation-sidebar-name">${this.player.name}</div>
                        <div class="evaluation-sidebar-position">${this.player.position}</div>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; margin-bottom: 16px;">
                            Calculated Parameters
                        </h3>
                        <div id="parameter-scores-container"></div>
                    </div>

                    <button id="review-btn" class="btn btn-primary" style="width: 100%; margin-top: 32px;">
                        <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="22 6 13.5 15.5 8.5 10.5 2 17"/>
                            <polyline points="16 6 22 6 22 12"/>
                        </svg>
                        Comparative Review
                    </button>
                </div>

                <!-- Main Scoring Area -->
                <div class="evaluation-content">
                    <div class="evaluation-content-inner">
                        <div class="back-link" id="back-link">
                            <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                            Back to Roster
                        </div>
                        <h1 class="evaluation-title">
                            ${isPlayer ? 'Player Self-Reflection' : 'Coach Assessment'}
                        </h1>
                        <p class="evaluation-subtitle">
                            ${isPlayer 
                                ? 'Rate your own performance blindly. You will not see coach scores until the review.'
                                : 'Rate the Level 2 constructs below. Level 1 Parameters will calculate automatically.'}
                        </p>

                        <div id="constructs-container"></div>
                    </div>
                </div>
            </div>
        `;

        this.renderParameterScores();
        this.renderConstructs(isLocked);
        this.attachEventListeners();
    }

    renderParameterScores() {
        const container = this.container.querySelector('#parameter-scores-container');
        const parameters = Object.values(SCORING_MODEL);
        
        container.innerHTML = parameters.map(param => {
            const score = calculateParameterScore(param.id, this.constructScores);
            const colorClass = {
                'technical': 'blue',
                'tactical': 'purple',
                'physical': 'green'
            }[param.id] || 'blue';

            return `
                <div class="parameter-card">
                    <div class="parameter-header">
                        <span class="parameter-label">${param.name}</span>
                        <span class="parameter-score">${score}</span>
                    </div>
                    <div class="parameter-bar">
                        <div class="parameter-bar-fill ${colorClass}" style="width: ${score * 10}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderConstructs(isLocked) {
        const container = this.container.querySelector('#constructs-container');
        const parameters = Object.values(SCORING_MODEL);

        // Clear container and existing inputs
        container.innerHTML = '';
        this.scoreInputs = {};

        parameters.forEach(param => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'parameter-section';
            
            sectionDiv.innerHTML = `
                <div class="parameter-section-header">
                    <div class="parameter-section-indicator"></div>
                    <div class="parameter-section-title">${param.name}</div>
                    ${param.isObjective ? '<span class="parameter-section-badge">Objective Data Mode</span>' : ''}
                </div>
            `;

            param.constructs.forEach(construct => {
                const constructContainer = document.createElement('div');
                constructContainer.id = `construct-${construct.id}`;
                
                const scoreInput = new ScoreInput(constructContainer, construct, {
                    value: this.constructScores[construct.id],
                    onChange: (value) => this.handleScoreChange(construct.id, value),
                    isLocked: isLocked,
                    onAttach: (constructId) => this.handleAttachEvidence(constructId)
                });

                this.scoreInputs[construct.id] = scoreInput;
                sectionDiv.appendChild(constructContainer);
            });

            container.appendChild(sectionDiv);
        });
    }

    findConstructById(constructId) {
        for (const param of Object.values(SCORING_MODEL)) {
            const construct = param.constructs.find(c => c.id === constructId);
            if (construct) return construct;
        }
        return null;
    }

    handleScoreChange(constructId, value) {
        this.constructScores[constructId] = value;
        this.player.updateConstructScore(appState.currentUser, constructId, value);

        // Recalculate and update parameter scores
        const parameters = Object.keys(SCORING_MODEL);
        parameters.forEach(paramId => {
            const paramScore = calculateParameterScore(paramId, this.constructScores);
            this.player.updateParameterScore(appState.currentUser, paramId, paramScore);
        });

        // Update sidebar display
        this.renderParameterScores();
    }

    handleAttachEvidence(constructId) {
        // TODO: Implement file upload/note attachment
        alert(`Mockup: File picker would open here for construct: ${constructId}`);
    }

    attachEventListeners() {
        const backLink = this.container.querySelector('#back-link');
        if (backLink) {
            backLink.addEventListener('click', () => {
                appState.currentView = 'dashboard';
                window.dispatchEvent(new CustomEvent('view-change', { 
                    detail: { view: 'dashboard' } 
                }));
            });
        }

        const reviewBtn = this.container.querySelector('#review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                appState.currentView = 'review';
                window.dispatchEvent(new CustomEvent('view-change', { 
                    detail: { view: 'review' } 
                }));
            });
        }
    }
}

