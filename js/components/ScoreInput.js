/**
 * Score Input Component - Handles Level 2 Construct scoring
 * Supports both subjective sliders and objective measurement inputs
 */

import { SCORING_MODEL } from '../models/scoringModel.js';

export class ScoreInput {
    constructor(container, construct, options = {}) {
        this.container = container;
        this.construct = construct;
        this.value = options.value || (construct.type === 'measurement' ? null : 5);
        this.onChange = options.onChange || (() => {});
        this.isLocked = options.isLocked || false;
        this.onAttach = options.onAttach || (() => {});
        this.render();
    }

    render() {
        // Handle objective data (Section 2.3)
        if (this.construct.type === 'measurement') {
            this.renderMeasurementInput();
        } else {
            this.renderSliderInput();
        }
    }

    renderMeasurementInput() {
        const calculatedScore = this.value ? this.construct.benchmark(this.value) : '-';
        
        this.container.innerHTML = `
            <div class="measurement-input">
                <div class="measurement-header">
                    <label class="measurement-label">${this.construct.name}</label>
                    <span class="measurement-calculated">
                        Calculated Rating: ${calculatedScore} / 10
                    </span>
                </div>
                <div class="measurement-field">
                    <input
                        type="number"
                        step="0.1"
                        ${this.isLocked ? 'disabled' : ''}
                        value="${this.value || ''}"
                        class="measurement-input-field"
                        placeholder="Enter raw data..."
                    />
                    <div class="measurement-hint">Benchmarks against elite tier data</div>
                </div>
            </div>
        `;

        const input = this.container.querySelector('.measurement-input-field');
        if (!this.isLocked) {
            input.addEventListener('input', (e) => {
                const newValue = parseFloat(e.target.value);
                this.value = newValue;
                this.onChange(newValue);
                // Update calculated score display
                const calculatedDisplay = this.container.querySelector('.measurement-calculated');
                if (calculatedDisplay) {
                    calculatedDisplay.textContent = `Calculated Rating: ${this.construct.benchmark(newValue)} / 10`;
                }
            });
        }
    }

    renderSliderInput() {
        const showRubric = this.construct.rubric ? 'block' : 'none';
        
        this.container.innerHTML = `
            <div class="score-slider">
                <div class="score-slider-header">
                    <div class="score-slider-label">
                        <label class="score-slider-title">${this.construct.name}</label>
                        ${this.construct.rubric ? `
                            <div class="info-icon-wrapper" style="position: relative;">
                                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 16v-4M12 8h.01"/>
                                </svg>
                                <div class="tooltip">
                                    <strong>Indicators:</strong>
                                    ${this.construct.rubric}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="score-slider-value">${this.value || 0}</div>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value="${this.value || 5}"
                    ${this.isLocked ? 'disabled' : ''}
                    class="score-slider-input"
                />
                <div class="score-slider-labels">
                    <span>Developing (1)</span>
                    <span>Elite (10)</span>
                </div>
                <div class="evidence-actions">
                    <button class="evidence-btn" ${this.isLocked ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                            <circle cx="12" cy="13" r="3"/>
                        </svg>
                        Add Video Evidence
                    </button>
                    <button class="evidence-btn" ${this.isLocked ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                        Add Note
                    </button>
                </div>
            </div>
        `;

        const slider = this.container.querySelector('.score-slider-input');
        const valueDisplay = this.container.querySelector('.score-slider-value');
        
        if (!this.isLocked) {
            slider.addEventListener('input', (e) => {
                const newValue = parseFloat(e.target.value);
                this.value = newValue;
                valueDisplay.textContent = newValue.toFixed(1);
                this.onChange(newValue);
            });
        }

        // Tooltip handling
        const infoIcon = this.container.querySelector('.info-icon');
        const tooltip = this.container.querySelector('.tooltip');
        if (infoIcon && tooltip) {
            infoIcon.addEventListener('mouseenter', () => {
                tooltip.classList.add('show');
            });
            infoIcon.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        }

        // Evidence attachment buttons
        const evidenceBtns = this.container.querySelectorAll('.evidence-btn');
        evidenceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.isLocked) {
                    this.onAttach(this.construct.id);
                }
            });
        });
    }

    updateValue(newValue) {
        this.value = newValue;
        this.render();
    }

    setLocked(locked) {
        this.isLocked = locked;
        this.render();
    }
}

