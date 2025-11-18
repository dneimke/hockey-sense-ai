/**
 * Radar Chart Component - Displays comparative 360° feedback
 * Uses Chart.js for rendering
 */

export class RadarChart {
    constructor(container, options = {}) {
        this.container = container;
        this.chart = null;
        this.options = {
            coachScores: options.coachScores || [],
            playerScores: options.playerScores || [],
            labels: options.labels || []
        };
        this.render();
    }

    render() {
        // Create canvas element
        this.container.innerHTML = '<canvas id="radar-chart"></canvas>';
        const canvas = this.container.querySelector('#radar-chart');
        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        // Create new chart
        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: this.options.labels,
                datasets: [
                    {
                        label: 'Coach Rating',
                        data: this.options.coachScores,
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Player Self-Rating',
                        data: this.options.playerScores,
                        backgroundColor: 'rgba(156, 163, 175, 0.2)',
                        borderColor: 'rgba(156, 163, 175, 1)',
                        pointBackgroundColor: 'rgba(156, 163, 175, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 2,
                            font: {
                                size: 12
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    update(coachScores, playerScores, labels) {
        this.options.coachScores = coachScores;
        this.options.playerScores = playerScores;
        this.options.labels = labels;
        this.render();
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

