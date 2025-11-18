# HockeySense AI - Talent Evaluation Platform

A VanillaJS application for digitizing a proprietary, hierarchical, and weighted evaluation framework for field hockey talent assessment.

## Overview

HockeySense AI is an Athlete Management System (AMS) designed for high-performance field hockey coaches and athletes. The application moves the coaching process from subjective spreadsheet tracking to a structured, evidence-based, and collaborative assessment model.

## Features

### Core Functionality

- **Three-Level Hierarchical Scoring Model**
  - Level 1: Parameters (Technical Skills, Game Intelligence, Athletic Abilities)
  - Level 2: Constructs (coach/player input fields with 1-10 sliders)
  - Level 3: Indicators (scoring rubrics/checklists)

- **Weighted Sum Calculations**
  - Automatic calculation of Level 1 Parameter scores from Level 2 Construct inputs
  - Support for objective data (e.g., 30m sprint time) with benchmarking

- **360° Feedback System**
  - Coach and player self-assessment
  - Comparative review with radar chart visualization
  - Gap analysis between coach and player perceptions

- **Evidence Management**
  - Link media (video, images, notes) to specific Construct scores
  - Evidence attachment tool for each scoring input

### User Roles

- **Coach**: Full access to all features, can rate all players, attach evidence, view team-wide trends
- **Player**: Access to own profile only, can input self-ratings, view final comparative evaluation

### Application Views

1. **Team Dashboard** - Coach's command center with roster management, status tracking, and team trends
2. **Player Evaluation & Input Screens** - Scoring engine for Level 2 Constructs
3. **Comparative Review Screen** - 360° feedback interface with radar chart and gap analysis

## Project Structure

```
HockeySense AI/
├── index.html              # Main HTML entry point
├── css/
│   ├── main.css           # Base styles and layout
│   ├── components.css     # Component-specific styles
│   └── views.css          # View-specific styles
├── js/
│   ├── app.js             # Main application entry point
│   ├── models/
│   │   ├── scoringModel.js    # Scoring hierarchy and calculations
│   │   └── dataModel.js       # Data structures and state management
│   ├── components/
│   │   ├── ScoreInput.js      # Level 2 Construct input component
│   │   └── RadarChart.js      # Radar chart visualization component
│   └── views/
│       ├── DashboardView.js    # Team dashboard view
│       ├── EvaluationView.js  # Scoring input view
│       └── ReviewView.js      # Comparative review view
└── README.md
```

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (for ES6 modules)

### Installation

1. Clone or download this repository

2. Start a local web server. You can use one of these methods:

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Development

The application uses ES6 modules, so it must be served from a web server (not opened directly as a file).

## Usage

### For Coaches

1. **Dashboard View**: View the entire roster, filter by status, and identify players needing attention
2. **Evaluation View**: Input scores for Level 2 Constructs using sliders or measurement inputs
3. **Review View**: Compare coach ratings with player self-assessments using the radar chart

### For Players

1. **Self-Assessment View**: Input your own ratings (blind to coach scores)
2. **Review View**: View the comparative analysis after coach finalizes assessment

## Technical Details

### Scoring Calculation

The application implements a weighted sum formula:

```
Parameter Score = Σ(Construct Score × Construct Weight) / Total Weight
```

### Objective Data Handling

For "Athletic Abilities" parameter, raw measurements (e.g., 30m sprint time) are automatically converted to 1-10 scores using benchmarking functions.

### Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

- Firebase Storage integration for media files
- Backend API for data persistence
- User authentication and authorization
- Team trends charts and analytics
- Export functionality for reports

## License

This is a proprietary application for field hockey talent evaluation.

## Support

For questions or issues, please contact the development team.

