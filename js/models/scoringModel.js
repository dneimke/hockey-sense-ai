/**
 * Scoring Model - Implements the three-level hierarchical weighted scoring system
 * Based on Section 2 of the requirements and parameters.md
 */

export const SCORING_MODEL = {
    technical: {
        id: 'technical',
        name: 'Technical Skills',
        weight: 0.4, // 40% of total player score
        constructs: [
            {
                id: 'ball_reception',
                name: 'Ball Reception',
                weight: 0.25,
                rubric: 'Receiving the ball, first-touch, first-touch carry.'
            },
            {
                id: 'ball_distribution_ball_release',
                name: 'Ball Distribution / Ball Release',
                weight: 0.25,
                rubric: 'Short/long passing, static/dynamic release, forehand/backhand, aerials.'
            },
            {
                id: 'ball_carrying_dribbling',
                name: 'Ball Carrying / Dribbling',
                weight: 0.25,
                rubric: 'Ball protection, beating defenders, carrying with vision.'
            },
            {
                id: 'ball_winning_gaining_possession',
                name: 'Ball Winning / Gaining Possession',
                weight: 0.25,
                rubric: 'Engaging and winning 1v1 contests, defensive positioning.'
            }
        ]
    },
    athletic: {
        id: 'athletic',
        name: 'Athletic Abilities / Physical Attributes',
        weight: 0.2,
        isObjective: true, // Special flag for Section 2.3
        constructs: [
            {
                id: 'physical_foundation',
                name: 'Physical Foundation',
                weight: 0.111,
                rubric: 'Body composition, injury susceptibility, running technique.'
            },
            {
                id: 'athletic_indicators_match_play',
                name: 'Athletic Indicators in Match Play',
                weight: 0.333,
                rubric: 'Speed, agility, acceleration, and strength observed during games/drills.'
            },
            {
                id: 'athletic_indicators_strength_conditioning',
                name: 'Athletic Indicators in Strength & Conditioning',
                weight: 0.222,
                rubric: 'Observed performance in S&C sessions (sprint technique, strength capacity).'
            },
            {
                id: 'measured_athletic_data',
                name: 'Measured Athletic Data',
                weight: 0.333,
                type: 'measurement',
                rubric: '(Objective Data Input) Measured metrics like 30m sprint time, T-sprint agility, Lactate testing results.',
                // Placeholder benchmark function - should be replaced with actual benchmarks
                benchmark: (val) => {
                    // This is a placeholder - actual benchmarks should be defined based on sport-specific data
                    // For now, returns a score based on a generic scale
                    if (val === null || val === undefined) return 0;
                    // This would need to be customized based on the specific metric being measured
                    return 5; // Default middle score until specific benchmarks are defined
                }
            }
        ]
    },
    game_intelligence: {
        id: 'game_intelligence',
        name: 'Game Intelligence',
        weight: 0.4,
        constructs: [
            {
                id: 'decision_making',
                name: 'Decision-Making',
                weight: 0.24,
                rubric: 'Choice of skill and efficiency/outcome of the decision.'
            },
            {
                id: 'game_management',
                name: 'Game Management',
                weight: 0.16,
                rubric: 'Situation assessment and risk appetite.'
            },
            {
                id: 'availability_for_ball',
                name: 'Availability for the Ball',
                weight: 0.20,
                rubric: 'Off-ball movement, positioning, and pre-scanning awareness.'
            },
            {
                id: 'defensive_game_understanding',
                name: 'Defensive Game Understanding',
                weight: 0.20,
                rubric: 'Intercepting, defensive positioning, and playing the contest effectively.'
            },
            {
                id: 'other_additional_indicators',
                name: 'Other / Additional Indicators',
                weight: 0.20,
                rubric: 'Ingenuity, perception, and speed of processing visual information.'
            }
        ]
    },
    social_competence: {
        id: 'social_competence',
        name: 'Social Competence',
        weight: 0.2,
        constructs: [
            {
                id: 'commitment',
                name: 'Commitment',
                weight: 0.20,
                rubric: 'Effort, attendance, and engagement in training and team activities.'
            },
            {
                id: 'behaviour',
                name: 'Behaviour',
                weight: 0.20,
                rubric: 'Influence on the team, interaction with teammates, and attitude.'
            },
            {
                id: 'response_success_setbacks',
                name: 'Response to Success and Setbacks',
                weight: 0.20,
                rubric: 'Player\'s reaction and management of high/low moments.'
            },
            {
                id: 'role_understanding',
                name: 'Role Understanding',
                weight: 0.20,
                rubric: 'Clarity and acceptance of their specific role within the team structure.'
            },
            {
                id: 'communication',
                name: 'Communication',
                weight: 0.20,
                rubric: 'Quality and effectiveness of on-field and off-field communication.'
            }
        ]
    },
    aptitude: {
        id: 'aptitude',
        name: 'Aptitude / Learn Ability',
        weight: 0.2,
        constructs: [
            {
                id: 'development',
                name: 'Development',
                weight: 0.30,
                rubric: 'Overall progression in athletic, technical, and tactical understanding.'
            },
            {
                id: 'adaptability_speed_adjustment',
                name: 'Adaptability; Speed of Adjustment',
                weight: 0.25,
                rubric: 'Quickness in adapting to new tactics, positions, or game scenarios.'
            },
            {
                id: 'input_absorption',
                name: 'Input Absorption',
                weight: 0.20,
                rubric: 'Ability to translate coaching feedback into immediate on-field action.'
            },
            {
                id: 'determination',
                name: 'Determination',
                weight: 0.25,
                rubric: 'Drive to push through challenges, assertiveness, and self-correction.'
            }
        ]
    },
    x_factor: {
        id: 'x_factor',
        name: 'X-Factor',
        weight: 0.2,
        constructs: [
            {
                id: 'penalty_corner_specialty',
                name: 'Penalty Corner Specialty',
                weight: 0.20,
                rubric: 'Offensive and defensive quality during penalty corners.'
            },
            {
                id: 'penalty_shootout_penalty_stroke',
                name: 'Penalty Shootout & Penalty Stroke',
                weight: 0.10,
                rubric: 'Performance during decisive penalty situations.'
            },
            {
                id: 'creativity_smartness',
                name: 'Creativity & Smartness',
                weight: 0.10,
                rubric: 'Unconventional playmaking and tactical cleverness.'
            },
            {
                id: 'essential_personality_traits',
                name: 'Essential Personality Traits',
                weight: 0.40,
                rubric: 'Winner\'s mentality, handling pressure, and competitive toughness.'
            },
            {
                id: 'personality_traits_nice_to_have',
                name: 'Personality Traits \'Nice-to-have\'',
                weight: 0.10,
                rubric: 'Strong personality, leadership qualities, and taking responsibility.'
            },
            {
                id: 'presence',
                name: 'Presence',
                weight: 0.10,
                rubric: 'On-field aura and visible impact a player has on others.'
            }
        ]
    },
    position_specific: {
        id: 'position_specific',
        name: 'Position-Specific Expertise / Qualities',
        weight: 0.2,
        constructs: [
            {
                id: 'role_execution',
                name: 'Role Execution',
                weight: 0.25,
                rubric: 'How effectively the player executes their specific positional duties.'
            },
            {
                id: 'position_specific_technical_skills',
                name: 'Position-Specific Technical Skills',
                weight: 0.25,
                rubric: 'Skills critical only to their position (e.g., aerial skills for a defender).'
            },
            {
                id: 'position_specific_tactical_qualities',
                name: 'Position-Specific Tactical Qualities',
                weight: 0.25,
                rubric: 'Tactical demands unique to their position (e.g., covering defense).'
            },
            {
                id: 'position_specific_physical_demands',
                name: 'Position-Specific Physical Demands',
                weight: 0.25,
                rubric: 'Physical demands unique to their position (e.g., repeat sprint ability for a striker).'
            }
        ]
    }
};

/**
 * Calculate Level 1 Parameter score from Level 2 Construct scores
 * Implements weighted sum formula from Section 2.2
 * 
 * @param {string} parameterId - The parameter ID (e.g., 'technical', 'athletic', 'game_intelligence', 'social_competence', 'aptitude', 'x_factor', 'position_specific')
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

