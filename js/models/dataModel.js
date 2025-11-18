/**
 * Data Model - Player and evaluation data structures
 */

// Mock roster data
export const MOCK_ROSTER = [
    {
        id: 1,
        name: 'Sarah Van Dijk',
        position: 'Midfielder',
        status: 'Review Pending',
        avatar: 'SV',
        gap: 0.8,
        scores: {
            coach: {},
            player: {}
        }
    },
    {
        id: 2,
        name: 'Tom Becker',
        position: 'Striker',
        status: 'Completed',
        avatar: 'TB',
        gap: 0.2,
        scores: {
            coach: {},
            player: {}
        }
    },
    {
        id: 3,
        name: 'Emily Chen',
        position: 'Defender',
        status: 'Self-Rating Needed',
        avatar: 'EC',
        gap: null,
        scores: {
            coach: {},
            player: {}
        }
    }
];

/**
 * Player data structure
 */
export class Player {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.position = data.position;
        this.status = data.status;
        this.avatar = data.avatar;
        this.gap = data.gap;
        this.scores = {
            coach: data.scores?.coach || {},
            player: data.scores?.player || {}
        };
    }

    /**
     * Calculate rating gap between coach and player scores
     */
    calculateGap() {
        const coachScores = this.getParameterScores('coach');
        const playerScores = this.getParameterScores('player');

        if (!coachScores || !playerScores) return null;

        const parameters = Object.keys(coachScores);
        let totalGap = 0;
        let count = 0;

        parameters.forEach(param => {
            if (coachScores[param] && playerScores[param]) {
                totalGap += Math.abs(coachScores[param] - playerScores[param]);
                count++;
            }
        });

        return count > 0 ? parseFloat((totalGap / count).toFixed(1)) : null;
    }

    /**
     * Get parameter scores for a role
     */
    getParameterScores(role) {
        return this.scores[role]?.parameters || {};
    }

    /**
     * Get construct scores for a role
     */
    getConstructScores(role) {
        return this.scores[role]?.constructs || {};
    }

    /**
     * Update construct score
     */
    updateConstructScore(role, constructId, score) {
        if (!this.scores[role].constructs) {
            this.scores[role].constructs = {};
        }
        this.scores[role].constructs[constructId] = score;
    }

    /**
     * Update parameter score
     */
    updateParameterScore(role, parameterId, score) {
        if (!this.scores[role].parameters) {
            this.scores[role].parameters = {};
        }
        this.scores[role].parameters[parameterId] = score;
    }
}

/**
 * Application state
 */
export class AppState {
    constructor() {
        this.currentUser = 'coach'; // 'coach' or 'player'
        this.currentView = 'dashboard'; // 'dashboard', 'evaluate', 'review'
        this.selectedPlayer = null;
        this.players = MOCK_ROSTER.map(p => new Player(p));
    }

    /**
     * Get current player
     */
    getCurrentPlayer() {
        if (this.currentUser === 'player') {
            // Player can only see themselves
            return this.players[0]; // In real app, would filter by user ID
        }
        return this.selectedPlayer || this.players[0];
    }

    /**
     * Set selected player
     */
    setSelectedPlayer(playerId) {
        this.selectedPlayer = this.players.find(p => p.id === playerId);
    }

    /**
     * Get players by status
     */
    getPlayersByStatus(status) {
        return this.players.filter(p => p.status === status);
    }
}

// Singleton instance
export const appState = new AppState();

