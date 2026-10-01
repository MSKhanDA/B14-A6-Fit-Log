# FitLog - Workout Library

FitLog is a sleek, dark-themed gym companion application designed for serious fitness enthusiasts. It allows users to browse a comprehensive workout library, plan their daily exercises, and track their progress efficiently. With a focus on simplicity and functionality, FitLog helps you train with intent and log every set.

## Technologies Used

- Next.js 14 (with App Router)
- React 18
- TypeScript
- Tailwind CSS
- FitLog API (https://api.abcz.workers.dev/api/fitlog)
- LocalStorage for data persistence

## Features

1. **Responsive Design**: Fully responsive layout that works seamlessly on mobile, tablet, and desktop devices.
2. **Workout Library**: Browse through a collection of 12 carefully selected lifts covering every major muscle group.
3. **Personalized Planning**: Add workouts to your daily plan or save them for later with easy-to-use controls.
4. **Detailed Workout Views**: Access comprehensive information about each exercise including instructions, equipment needed, and specifications.
5. **Progress Tracking**: Track your planned exercises with metrics for exercises, minutes, and calories burned.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone [<repository-url>](https://github.com/MSKhanDA/B14-A6-Fit-Log.git)
   ```

2. Navigate to the project directory:
   ```bash
   cd fitlog-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the application in action.

## Project Structure

```
app/
├── layout.tsx          # Root layout for the application
├── page.tsx            # Home page with hero section and workout library
├── my-plan/            # My Plan page
│   └── page.tsx
├── fitlog/             # Dynamic route for workout details
│   └── [id]/
│       └── page.tsx
├── not-found.tsx       # 404 page
└── globals.css         # Global styles and Tailwind directives
```

## API Integration

The application integrates with the FitLog API to fetch workout data:

- Fetch all workouts: `GET https://api.abcz.workers.dev/api/fitlog`
- Fetch single workout: `GET https://api.abcz.workers.dev/api/fitlog/:id`

## Local Storage Usage

The application uses localStorage to persist:
- Today's planned workouts (up to 5 exercises)
- Saved workouts for later

This ensures that your plans persist even after page refreshes.

## Responsive Design

The UI is fully responsive and adapts to different screen sizes:
- Mobile: Single column layout for workout cards
- Tablet: Two column layout for workout cards
- Desktop: Three column grid for optimal viewing

## Sorting Functionality

On the home page, users can sort workouts by:
- Duration (default)
- Calories
- Rating

## License

This project is open-source and available under the MIT License.
