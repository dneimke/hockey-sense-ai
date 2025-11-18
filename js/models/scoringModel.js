/**
 * Scoring Model - Implements the three-level hierarchical weighted scoring system
 * Based on Section 2 of the requirements
 */

export const SCORING_MODEL = {
    technical: {
        id: 'technical',
        name: 'Technical Skills',
        weight: 0.4, // 40% of total player score
        constructs: [
            {
                id: 'ball_distribution',
                name: 'Ball Distribution',
                weight: 0.3,
                rubric: 'Focuses on pass accuracy, speed, and decision making under pressure.'
            },
            {
                id: 'ball_reception',
                name: 'Ball Reception',
                weight: 0.3,
                rubric: 'Ability to receive open and closed stick while moving.'
            },
            {
                id: 'elimination_skills',
                name: 'Elimination Skills',
                weight: 0.4,
                rubric: '1v1 offensive capability and stick work.'
            }
        ]
    },
    tactical: {
        id: 'tactical',
        name: 'Game Intelligence',
        weight: 0.4,
        constructs: [
            {
                id: 'offensive_positioning',
                name: 'Offensive Positioning',
                weight: 0.5,
                rubric: 'Finding space in the circle and passing lanes.'
            },
            {
                id: 'defensive_structure',
                name: 'Defensive Structure',
                weight: 0.5,
                rubric: 'Man-marking tightness and zonal awareness.'
            }
        ]
    },
    physical: {
        id: 'physical',
        name: 'Athletic Abilities',
        weight: 0.2,
        isObjective: true, // Special flag for Section 2.3
        constructs: [
            {
                id: 'sprint_30m',
                name: '30m Sprint (sec)',
                weight: 0.5,
                type: 'measurement',
                unit: 'seconds',
                benchmark: (val) => {
                    if (val < 4.0) return 10;
                    if (val < 4.2) return 8;
                    if (val < 4.5) return 6;
                    return 4;
                }
            },
            {
                id: 'yo_yo_test',
                name: 'Yo-Yo Test (level)',
                weight: 0.5,
                type: 'measurement',
                unit: 'level',
                benchmark: (val) => {
                    if (val > 20) return 10;
                    if (val > 18) return 8;
                    if (val > 16) return 6;
                    return 4;
                }
            }
        ]
    }
};

/**
 * Calculate Level 1 Parameter score from Level 2 Construct scores
 * Implements weighted sum formula from Section 2.2
 * 
 * @param {string} parameterId - The parameter ID (e.g., 'technical', 'tactical', 'physical')
 * @param {Object} constructScores - Object mapping construct IDs to their scores
 * @returns {number} Calculated parameter score (1-10)
 */
export function calculateParameterScore(parameterId, constructScores) {
    const parameter = SCORING_MODEL[parameterId];
    if (!parameter) return 0;

    let weightedSum = 0;
    let totalWeight = 0;

    parameter.constructs.forEach(construct => {
        let rawScore = constructScores[construct.id] || 0;

        // Handle objective data (Section 2.3)
        if (construct.type === 'measurement' && construct.benchmark) {
            rawScore = construct.benchmark(rawScore);
        }

        weightedSum += rawScore * construct.weight;
        totalWeight += construct.weight;
    });

    // Normalize in case weights don't sum to 1.0 perfectly
    const normalizedScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
    
    // Ensure score is between 1 and 10
    return Math.max(1, Math.min(10, parseFloat(normalizedScore.toFixed(1))));
}

/**
 * Get all parameter IDs
 */
export function getParameterIds() {
    return Object.keys(SCORING_MODEL);
}

/**
 * Get all construct IDs for a parameter
 */
export function getConstructIds(parameterId) {
    const parameter = SCORING_MODEL[parameterId];
    return parameter ? parameter.constructs.map(c => c.id) : [];
}

