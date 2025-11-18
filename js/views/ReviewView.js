/**
 * Review View - Comparative 360° feedback with radar chart
 * Section 4.3 of requirements
 */

import { appState } from '../models/dataModel.js';
import { SCORING_MODEL, calculateParameterScore } from '../models/scoringModel.js';
import { RadarChart } from '../components/RadarChart.js';

export class ReviewView {
    constructor(container) {
        this.container = container;
        this.player = appState.getCurrentPlayer();
        this.radarChart = null;
        this.render();
    }

    render() {
        const coachScores = this.player.getConstructScores('coach') || {};
        const playerScores = this.player.getConstructScores('player') || {};

        // Calculate parameter scores
        const coachParamScores = {};
        const playerParamScores = {};
        const labels = [];

        Object.keys(SCORING_MODEL).forEach(paramId => {
            const param = SCORING_MODEL[paramId];
            labels.push(param.name);
            coachParamScores[paramId] = calculateParameterScore(paramId, coachScores);
            playerParamScores[paramId] = calculateParameterScore(paramId, playerScores);
        });

        const coachData = Object.values(coachParamScores);
        const playerData = Object.values(playerParamScores);

        this.container.innerHTML = `
            <div class="review-view">
                <div class="back-link" id="back-link">
                    <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Back to Inputs
                </div>

                <div class="review-header">
                    <div>
                        <h1 class="review-title">Comparative Review</h1>
                        <p class="review-subtitle">360° Analysis: Coach Assessment vs. Player Perception</p>
                    </div>
                    <div class="review-legend">
                        <div class="legend-item">
                            <div class="legend-color coach"></div>
                            <span class="legend-label">Coach</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color player"></div>
                            <span class="legend-label">Player</span>
                        </div>
                    </div>
                </div>

                <div class="review-content">
                    <div class="review-chart-container" id="radar-chart-container"></div>
                    <div class="review-details">
                        <div class="gap-analysis-card">
                            <h3 class="gap-analysis-title">Gap Analysis Details</h3>
                            <div id="gap-analysis-items"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderRadarChart(coachData, playerData, labels);
        this.renderGapAnalysis(coachParamScores, playerParamScores);
        this.attachEventListeners();
    }

    renderRadarChart(coachData, playerData, labels) {
        const container = this.container.querySelector('#radar-chart-container');
        if (this.radarChart) {
            this.radarChart.destroy();
        }
        this.radarChart = new RadarChart(container, {
            coachScores: coachData,
            playerScores: playerData,
            labels: labels
        });
    }

    renderGapAnalysis(coachScores, playerScores) {
        const container = this.container.querySelector('#gap-analysis-items');
        const gaps = [];

        Object.keys(SCORING_MODEL).forEach(paramId => {
            const coachScore = coachScores[paramId] || 0;
            const playerScore = playerScores[paramId] || 0;
            const gap = coachScore - playerScore;
            const absGap = Math.abs(gap);

            if (absGap > 0.1) { // Only show significant gaps
                gaps.push({
                    paramId,
                    paramName: SCORING_MODEL[paramId].name,
                    coachScore,
                    playerScore,
                    gap,
                    absGap
                });
            }
        });

        // Sort by absolute gap (largest first)
        gaps.sort((a, b) => b.absGap - a.absGap);

        if (gaps.length === 0) {
            container.innerHTML = `
                <div class="gap-item low">
                    <div class="gap-item-header">
                        <span class="gap-item-label">Strong Alignment</span>
                        <span class="gap-item-value">✓</span>
                    </div>
                    <p class="gap-item-description">
                        Coach and player assessments are well-aligned across all parameters.
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = gaps.map(gap => {
            const isHighGap = gap.absGap > 0.5;
            const gapClass = isHighGap ? 'high' : 'low';
            const gapSign = gap.gap > 0 ? '+' : '';
            const gapColor = isHighGap ? 'red' : 'green';

            return `
                <div class="gap-item ${gapClass}">
                    <div class="gap-item-header">
                        <span class="gap-item-label">${gap.paramName} Gap</span>
                        <span class="gap-item-value">${gapSign}${gap.gap.toFixed(1)}</span>
                    </div>
                    <p class="gap-item-description">
                        Coach rated <strong>${gap.coachScore.toFixed(1)}</strong>, 
                        Player rated <strong>${gap.playerScore.toFixed(1)}</strong>.
                        ${isHighGap ? 'Major discrepancy detected.' : 'Minor difference in perception.'}
                    </p>
                    ${isHighGap ? `
                        <div class="evidence-link">
                            <div class="evidence-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                            </div>
                            <div class="evidence-details">
                                <div class="evidence-title">Clip: Q3 Defensive Breakdown</div>
                                <div class="evidence-meta">Attached by Coach • 00:14s</div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    attachEventListeners() {
        const backLink = this.container.querySelector('#back-link');
        if (backLink) {
            backLink.addEventListener('click', () => {
                appState.currentView = 'evaluate';
                window.dispatchEvent(new CustomEvent('view-change', { 
                    detail: { view: 'evaluate' } 
                }));
            });
        }
    }

    destroy() {
        if (this.radarChart) {
            this.radarChart.destroy();
        }
    }
}

