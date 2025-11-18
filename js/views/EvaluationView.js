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
        this.currentView = 'overview'; // 'overview' or 'parameterDetail'
        this.currentParameterId = null;
        this.unsavedChanges = false;
        this.savedScores = JSON.parse(JSON.stringify(this.constructScores)); // Deep copy for comparison
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

                <!-- Main Content Area -->
                <div class="evaluation-content" id="evaluation-main-content">
                    <!-- Content will be rendered based on currentView -->
                </div>
            </div>
        `;

        this.renderParameterScores();
        if (this.currentView === 'overview') {
            this.renderParameterOverview();
        } else if (this.currentView === 'parameterDetail') {
            this.renderParameterDetail(this.currentParameterId);
        }
        this.attachEventListeners();
    }

    renderParameterScores() {
        const container = this.container.querySelector('#parameter-scores-container');
        if (!container) return;
        
        const parameters = Object.values(SCORING_MODEL);
        
        container.innerHTML = parameters.map(param => {
            const score = calculateParameterScore(param.id, this.constructScores);
            const isActive = this.currentView === 'parameterDetail' && this.currentParameterId === param.id;

            return `
                <div class="parameter-nav-item ${isActive ? 'active' : ''}" data-parameter-id="${param.id}">
                    <div class="parameter-nav-indicator"></div>
                    <div class="parameter-nav-content">
                        <div class="parameter-nav-name">${param.name}</div>
                        <div class="parameter-nav-score">${score.toFixed(1)}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Make sidebar navigation items clickable
        container.querySelectorAll('.parameter-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const paramId = e.currentTarget.dataset.parameterId;
                this.navigateToParameter(paramId);
            });
        });
    }

    renderParameterOverview() {
        const container = this.container.querySelector('#evaluation-main-content');
        const isPlayer = appState.currentUser === 'player';
        const parameters = Object.values(SCORING_MODEL);

        container.innerHTML = `
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
                        ? 'Select a parameter to rate your performance.'
                        : 'Select a parameter to begin assessment. Level 1 Parameters calculate automatically from Level 2 constructs.'}
                </p>

                <div class="parameter-overview-table-container">
                    <table class="parameter-overview-table">
                        <thead>
                            <tr>
                                <th class="col-parameter">Parameter</th>
                                <th class="col-score">Score</th>
                                <th class="col-progress">Progress</th>
                                <th class="col-factors">Factors</th>
                                <th class="col-action"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${parameters.map(param => {
                                const score = calculateParameterScore(param.id, this.constructScores);
                                const constructCount = param.constructs.length;
                                const firstWeight = param.constructs[0].weight;
                                const allEqual = param.constructs.every(c => c.weight === firstWeight);
                                const avgWeight = allEqual ? (firstWeight * 100).toFixed(0) : 'varies';
                                const isActive = this.currentView === 'parameterDetail' && this.currentParameterId === param.id;

                                return `
                                    <tr class="parameter-table-row ${isActive ? 'active' : ''}" data-parameter-id="${param.id}">
                                        <td class="col-parameter">
                                            <div class="parameter-table-name">${param.name}</div>
                                        </td>
                                        <td class="col-score">
                                            <div class="parameter-table-score">
                                                <span class="parameter-table-score-value">${score.toFixed(1)}</span>
                                                <span class="parameter-table-score-max">/10</span>
                                            </div>
                                        </td>
                                        <td class="col-progress">
                                            <div class="parameter-table-progress-bar">
                                                <div class="parameter-table-progress-fill blue" style="width: ${score * 10}%"></div>
                                            </div>
                                        </td>
                                        <td class="col-factors">
                                            <div class="parameter-table-factors">
                                                ${constructCount} factors${avgWeight !== 'varies' ? ` • ${avgWeight}% each` : ' • Weighted'}
                                            </div>
                                        </td>
                                        <td class="col-action">
                                            <svg class="parameter-table-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="9 18 15 12 9 6"/>
                                            </svg>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Make table rows clickable
        container.querySelectorAll('.parameter-table-row').forEach(row => {
            row.addEventListener('click', (e) => {
                const paramId = e.currentTarget.dataset.parameterId;
                this.navigateToParameter(paramId);
            });
        });
    }

    renderParameterDetail(parameterId) {
        const container = this.container.querySelector('#evaluation-main-content');
        const parameter = SCORING_MODEL[parameterId];
        if (!parameter) return;

        const isPlayer = appState.currentUser === 'player';
        const isLocked = isPlayer && this.player.status === 'Completed';
        const score = calculateParameterScore(parameterId, this.constructScores);
        const colorClass = this.getParameterColorClass(parameterId);
        const constructCount = parameter.constructs.length;
        
        // Get actual weight percentages (check if all weights are equal)
        const firstWeight = parameter.constructs[0].weight;
        const allEqual = parameter.constructs.every(c => c.weight === firstWeight);
        const weightPercent = allEqual ? (firstWeight * 100).toFixed(0) : 'varies';

        // Get parameter description (we'll use a simple description for now)
        const descriptions = {
            'technical': 'Core hockey handling and possession mechanics.',
            'athletic': 'Physical capabilities and measured performance metrics.',
            'game_intelligence': 'Tactical awareness and decision-making on the field.',
            'social_competence': 'Team interaction, communication, and role understanding.',
            'aptitude': 'Learning ability, adaptability, and development potential.',
            'x_factor': 'Specialized skills and intangible competitive qualities.',
            'position_specific': 'Position-specific technical, tactical, and physical demands.'
        };

        container.innerHTML = `
            <div class="parameter-detail-view">
                <!-- Header Section -->
                <div class="parameter-detail-header blue">
                    <div class="parameter-detail-header-content">
                        <div class="parameter-detail-back" id="parameter-detail-back">
                            <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </div>
                        <div class="parameter-detail-title-section">
                            <h1 class="parameter-detail-title">${parameter.name}</h1>
                            <p class="parameter-detail-subtitle">${descriptions[parameterId] || 'Assessment parameter'}</p>
                        </div>
                        <div class="parameter-detail-rating">
                            <div class="parameter-detail-rating-label">CALCULATED RATING</div>
                            <div class="parameter-detail-rating-value">
                                <span class="parameter-detail-rating-number">${score.toFixed(1)}</span>
                                <span class="parameter-detail-rating-max">/10</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Assessment Breakdown Section -->
                <div class="parameter-detail-content">
                    <div class="assessment-breakdown">
                        <div class="assessment-breakdown-header">
                            <h2 class="assessment-breakdown-title">Assessment Breakdown</h2>
                            <div class="assessment-breakdown-weighting">
                                ${constructCount} Factors${weightPercent !== 'varies' ? ` (${weightPercent}% Weight each)` : ' (Weighted)'}
                            </div>
                        </div>

                        <div class="construct-rows" id="construct-rows">
                            ${parameter.constructs.map(construct => {
                                const constructScore = this.constructScores[construct.id] || 0;
                                const contribution = (constructScore / 10) * construct.weight * 10;
                                const evidenceCount = 0; // TODO: Get from evidence system
                                
                                const weightPercent = (construct.weight * 100).toFixed(1);
                                
                                return `
                                    <div class="construct-row" data-construct-id="${construct.id}">
                                        <div class="construct-row-left">
                                            <div class="construct-name-wrapper">
                                                <div class="construct-name">${construct.name}</div>
                                                <div class="construct-weighting">${weightPercent}% Weight</div>
                                            </div>
                                            <div class="construct-contribution">
                                                <span class="construct-contribution-label">CONTRIBUTION</span>
                                                <span class="construct-contribution-value">+${contribution.toFixed(2)} pts</span>
                                            </div>
                                        </div>
                                        <div class="construct-row-right">
                                            <button class="evidence-button ${evidenceCount > 0 ? 'has-evidence' : ''}" 
                                                    data-construct-id="${construct.id}"
                                                    ${isLocked ? 'disabled' : ''}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                                                    <circle cx="12" cy="13" r="3"/>
                                                </svg>
                                                ${evidenceCount > 0 ? `${evidenceCount} Clips` : 'Add Evidence'}
                                            </button>
                                            <div class="construct-score-slider-wrapper">
                                                <div class="construct-score-slider-header">
                                                    <span class="construct-score-display">${constructScore.toFixed(1)}</span>
                                                </div>
                                                <input type="range" 
                                                       min="1" 
                                                       max="10" 
                                                       step="0.1"
                                                       value="${constructScore || 5}" 
                                                       class="construct-score-slider"
                                                       data-construct-id="${construct.id}"
                                                       ${isLocked ? 'disabled' : ''}>
                                                <div class="construct-score-slider-labels">
                                                    <span>1</span>
                                                    <span>10</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="parameter-detail-footer">
                    <button class="btn-discard" id="btn-discard" ${!this.unsavedChanges ? 'disabled' : ''}>
                        Discard Changes
                    </button>
                    <button class="btn-save" id="btn-save" ${!this.unsavedChanges ? 'disabled' : ''}>
                        <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Save Assessment
                    </button>
                </div>
            </div>
        `;

        // Attach event listeners for score sliders
        container.querySelectorAll('.construct-score-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const constructId = e.target.dataset.constructId;
                const value = parseFloat(e.target.value) || 0;
                const display = e.target.closest('.construct-score-slider-wrapper').querySelector('.construct-score-display');
                if (display) {
                    display.textContent = value.toFixed(1);
                }
                this.handleScoreChange(constructId, value);
            });
        });

        // Attach evidence button listeners
        container.querySelectorAll('.evidence-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!isLocked) {
                    e.stopPropagation();
                    const constructId = e.currentTarget.dataset.constructId;
                    this.showEvidenceDialog(constructId);
                }
            });
        });
    }

    getParameterColorClass(parameterId) {
        // Unified color scheme - all parameters use the same primary color
        return 'blue';
    }

    navigateToParameter(parameterId) {
        // Check for unsaved changes
        if (this.unsavedChanges) {
            if (!confirm('You have unsaved changes. Do you want to discard them and continue?')) {
                return;
            }
            this.discardChanges();
        }

        this.currentView = 'parameterDetail';
        this.currentParameterId = parameterId;
        this.render();
    }

    navigateToOverview() {
        // Check for unsaved changes
        if (this.unsavedChanges) {
            if (!confirm('You have unsaved changes. Do you want to discard them and continue?')) {
                return;
            }
            this.discardChanges();
        }

        this.currentView = 'overview';
        this.currentParameterId = null;
        this.render();
    }

    findConstructById(constructId) {
        for (const param of Object.values(SCORING_MODEL)) {
            const construct = param.constructs.find(c => c.id === constructId);
            if (construct) return construct;
        }
        return null;
    }

    handleScoreChange(constructId, value) {
        // Clamp value between 1 and 10
        value = Math.max(1, Math.min(10, value));
        
        this.constructScores[constructId] = value;
        this.player.updateConstructScore(appState.currentUser, constructId, value);

        // Mark as having unsaved changes
        this.unsavedChanges = true;
        this.updateSaveDiscardButtons();

        // Recalculate and update parameter scores
        const parameters = Object.keys(SCORING_MODEL);
        parameters.forEach(paramId => {
            const paramScore = calculateParameterScore(paramId, this.constructScores);
            this.player.updateParameterScore(appState.currentUser, paramId, paramScore);
        });

        // Update sidebar display
        this.renderParameterScores();

        // If in detail view, update the contribution display and progress bars
        if (this.currentView === 'parameterDetail' && this.currentParameterId) {
            this.updateParameterDetailView();
        }
    }

    updateParameterDetailView() {
        const parameter = SCORING_MODEL[this.currentParameterId];
        if (!parameter) return;

        const score = calculateParameterScore(this.currentParameterId, this.constructScores);

        // Update header rating
        const ratingNumber = this.container.querySelector('.parameter-detail-rating-number');
        if (ratingNumber) {
            ratingNumber.textContent = score.toFixed(1);
        }

        // Update each construct row
        parameter.constructs.forEach(construct => {
            const constructScore = this.constructScores[construct.id] || 0;
            const contribution = (constructScore / 10) * construct.weight * 10;
            const row = this.container.querySelector(`[data-construct-id="${construct.id}"]`);
            
            if (row) {
                // Update contribution
                const contributionValue = row.querySelector('.construct-contribution-value');
                if (contributionValue) {
                    contributionValue.textContent = `+${contribution.toFixed(2)} pts`;
                }

                // Update slider value and display if they don't match
                const slider = row.querySelector('.construct-score-slider');
                const display = row.querySelector('.construct-score-display');
                if (slider && parseFloat(slider.value) !== constructScore) {
                    slider.value = constructScore || 5;
                }
                if (display) {
                    display.textContent = constructScore.toFixed(1);
                }
            }
        });
    }

    saveChanges() {
        // Save current scores as the new baseline
        this.savedScores = JSON.parse(JSON.stringify(this.constructScores));
        this.unsavedChanges = false;
        this.updateSaveDiscardButtons();
        
        // Show feedback (could be a toast notification)
        const saveBtn = this.container.querySelector('#btn-save');
        if (saveBtn) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Saved!';
            saveBtn.disabled = true;
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                this.updateSaveDiscardButtons();
            }, 2000);
        }
    }

    discardChanges() {
        // Revert to saved scores
        this.constructScores = JSON.parse(JSON.stringify(this.savedScores));
        
        // Update player model
        Object.keys(this.constructScores).forEach(constructId => {
            this.player.updateConstructScore(appState.currentUser, constructId, this.constructScores[constructId]);
        });

        // Recalculate parameter scores
        const parameters = Object.keys(SCORING_MODEL);
        parameters.forEach(paramId => {
            const paramScore = calculateParameterScore(paramId, this.constructScores);
            this.player.updateParameterScore(appState.currentUser, paramId, paramScore);
        });

        this.unsavedChanges = false;
        this.updateSaveDiscardButtons();
        
        // Re-render current view to show reverted values
        if (this.currentView === 'parameterDetail') {
            this.renderParameterDetail(this.currentParameterId);
        } else {
            this.renderParameterOverview();
        }
        this.renderParameterScores();
    }

    updateSaveDiscardButtons() {
        const saveBtn = this.container.querySelector('#btn-save');
        const discardBtn = this.container.querySelector('#btn-discard');
        
        if (saveBtn) {
            saveBtn.disabled = !this.unsavedChanges;
        }
        if (discardBtn) {
            discardBtn.disabled = !this.unsavedChanges;
        }
    }

    showEvidenceDialog(constructId) {
        const construct = this.findConstructById(constructId);
        if (!construct) return;

        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'evidence-modal-overlay';
        modal.innerHTML = `
            <div class="evidence-modal">
                <div class="evidence-modal-header">
                    <h3 class="evidence-modal-title">Add Evidence - ${construct.name}</h3>
                    <button class="evidence-modal-close" id="evidence-modal-close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="evidence-modal-content">
                    <div class="evidence-modal-tabs">
                        <button class="evidence-tab active" data-tab="video">Video Evidence</button>
                        <button class="evidence-tab" data-tab="note">Add Note</button>
                    </div>
                    <div class="evidence-modal-body">
                        <div class="evidence-tab-content active" data-content="video">
                            <div class="evidence-upload-area">
                                <svg class="evidence-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                                    <circle cx="12" cy="13" r="3"/>
                                </svg>
                                <p class="evidence-upload-text">Click to upload video or drag and drop</p>
                                <p class="evidence-upload-hint">MP4, MOV up to 100MB</p>
                                <input type="file" accept="video/*" class="evidence-file-input" id="evidence-file-input" style="display: none;">
                            </div>
                            <div class="evidence-uploaded-files" id="evidence-uploaded-files" style="display: none;">
                                <div class="evidence-file-item">
                                    <span class="evidence-file-name">video_clip_1.mp4</span>
                                    <button class="evidence-file-remove">Remove</button>
                                </div>
                            </div>
                        </div>
                        <div class="evidence-tab-content" data-content="note">
                            <div class="evidence-note-form">
                                <label class="evidence-note-label">Note</label>
                                <textarea class="evidence-note-textarea" 
                                          placeholder="Add your notes about this construct..."></textarea>
                                <div class="evidence-note-char-count">
                                    <span id="note-char-count">0</span> / 1000 characters
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="evidence-modal-footer">
                    <button class="btn-secondary" id="evidence-modal-cancel">Cancel</button>
                    <button class="btn-primary" id="evidence-modal-save">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Tab switching
        modal.querySelectorAll('.evidence-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                modal.querySelectorAll('.evidence-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.evidence-tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                modal.querySelector(`[data-content="${tabName}"]`).classList.add('active');
            });
        });

        // File input handling
        const uploadArea = modal.querySelector('.evidence-upload-area');
        const fileInput = modal.querySelector('#evidence-file-input');
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const uploadedFiles = modal.querySelector('#evidence-uploaded-files');
                uploadedFiles.style.display = 'block';
                uploadedFiles.innerHTML = Array.from(e.target.files).map(file => `
                    <div class="evidence-file-item">
                        <span class="evidence-file-name">${file.name}</span>
                        <button class="evidence-file-remove">Remove</button>
                    </div>
                `).join('');
            }
        });

        // Note character count
        const noteTextarea = modal.querySelector('.evidence-note-textarea');
        const charCount = modal.querySelector('#note-char-count');
        noteTextarea.addEventListener('input', (e) => {
            charCount.textContent = e.target.value.length;
        });

        // Close handlers
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        modal.querySelector('#evidence-modal-close').addEventListener('click', closeModal);
        modal.querySelector('#evidence-modal-cancel').addEventListener('click', closeModal);
        modal.querySelector('.evidence-modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Save handler
        modal.querySelector('#evidence-modal-save').addEventListener('click', () => {
            // TODO: Implement actual save logic
            alert(`Evidence saved for construct: ${constructId}`);
            closeModal();
        });
    }

    handleAttachEvidence(constructId) {
        // This method is kept for backward compatibility but now uses showEvidenceDialog
        this.showEvidenceDialog(constructId);
    }

    attachEventListeners() {
        const backLink = this.container.querySelector('#back-link');
        if (backLink) {
            backLink.addEventListener('click', () => {
                if (this.unsavedChanges) {
                    if (!confirm('You have unsaved changes. Do you want to discard them and leave?')) {
                        return;
                    }
                    this.discardChanges();
                }
                appState.currentView = 'dashboard';
                window.dispatchEvent(new CustomEvent('view-change', { 
                    detail: { view: 'dashboard' } 
                }));
            });
        }

        const parameterDetailBack = this.container.querySelector('#parameter-detail-back');
        if (parameterDetailBack) {
            parameterDetailBack.addEventListener('click', () => {
                this.navigateToOverview();
            });
        }

        const saveBtn = this.container.querySelector('#btn-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveChanges();
            });
        }

        const discardBtn = this.container.querySelector('#btn-discard');
        if (discardBtn) {
            discardBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to discard all unsaved changes?')) {
                    this.discardChanges();
                }
            });
        }

        const reviewBtn = this.container.querySelector('#review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                if (this.unsavedChanges) {
                    if (!confirm('You have unsaved changes. Do you want to save them before viewing the review?')) {
                        return;
                    }
                    this.saveChanges();
                }
                appState.currentView = 'review';
                window.dispatchEvent(new CustomEvent('view-change', { 
                    detail: { view: 'review' } 
                }));
            });
        }
    }
}

