'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Define the workout data type
type Workout = {
  id: string;
  name: string;
  category: string[];
  equipment: string[];
  duration: number;
  calories: number;
  rating: number;
  description: string;
  difficulty: string;
  sets: number;
  reps: string;
  instructions: string[];
  image: string;
};

// Helper function to convert exercise name to image file name
const getExerciseImage = (name: string): string => {
  // Create a normalized version of the name for comparison
  const normalized = name.trim().toLowerCase();
  
  // Look for the closest match in our assets with exact name matching
  const imageMap: Record<string, string> = {
    'back squat': '/assets/Back Squat.webp',
    'barbell bench press': '/assets/Barbell Bench Press.webp',
    'burpee': '/assets/Burpee.webp',
    'conventional deadlift': '/assets/Conventional Deadlift.webp',
    'dumbell bicep curl': '/assets/Dumbell Bicep Curl.webp',
    'hollow body plank': '/assets/Hollow Body plank.webp',
    'kettlebell swing': '/assets/Kettlebell Swing.webp',
    'overhead press': '/assets/Overhead Press.webp',
    'pull-up': '/assets/Pull-Up.webp',
    'pushup': '/assets/Pushup.webp',
    'push up': '/assets/Pushup.webp', // variation
    'russian twist': '/assets/Russian Twist.webp',
    'walking lunge': '/assets/Walking Lunge.webp',
  };
  
  // Direct match first
  if (imageMap[normalized]) {
    return imageMap[normalized];
  }
  
  // Check for partial matches with specific exercises
  if (normalized.includes('hollow') && normalized.includes('plank')) {
    return '/assets/Hollow Body plank.webp';
  } else if (normalized.includes('push') && normalized.includes('up')) {
    return '/assets/Pushup.webp';
  } else if (normalized.includes('dumbell') && normalized.includes('curl')) {
    return '/assets/Dumbell Bicep Curl.webp';
  } else if (normalized.includes('back') && normalized.includes('squat')) {
    return '/assets/Back Squat.webp';
  }
  
  // If no specific match is found, return a generic fallback
  return '/assets/Back Squat.webp'; // fallback to a default image
};

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [planWorkouts, setPlanWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Calculate metrics
  const totalExercises = planWorkouts.length;
  const totalMinutes = planWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = planWorkouts.reduce((sum, workout) => sum + workout.calories, 0);

  // Load data from localStorage
  useEffect(() => {
    const storedPlan = localStorage.getItem('todayPlan');
    const storedSaved = localStorage.getItem('savedWorkouts');
    
    if (storedPlan) {
      setPlanWorkouts(JSON.parse(storedPlan));
    }
    
    if (storedSaved) {
      setSavedWorkouts(JSON.parse(storedSaved));
    }
    
    setLoading(false);
  }, []);

  // Remove from plan
  const removeFromPlan = (id: string) => {
    const updatedPlan = planWorkouts.filter(workout => workout.id !== id);
    setPlanWorkouts(updatedPlan);
    localStorage.setItem('todayPlan', JSON.stringify(updatedPlan));
    toast.info('Workout removed from plan!');
  };

  // Remove from saved
  const removeFromSaved = (id: string) => {
    const updatedSaved = savedWorkouts.filter(workout => workout.id !== id);
    setSavedWorkouts(updatedSaved);
    localStorage.setItem('savedWorkouts', JSON.stringify(updatedSaved));
    toast.info('Workout removed from saved!');
  };

  // Move from saved to plan
  const moveToPlan = (workout: Workout) => {
    if (planWorkouts.length >= 5) {
      toast.error("You've reached the limit of 5 exercises for today's plan.");
      return;
    }

    // Check if already in plan
    if (!planWorkouts.some(item => item.id === workout.id)) {
      const newPlan = [...planWorkouts, workout];
      setPlanWorkouts(newPlan);
      localStorage.setItem('todayPlan', JSON.stringify(newPlan));

      // Remove from saved
      const updatedSaved = savedWorkouts.filter(w => w.id !== workout.id);
      setSavedWorkouts(updatedSaved);
      localStorage.setItem('savedWorkouts', JSON.stringify(updatedSaved));

      toast.success(`${workout.name} moved to today's plan!`);
    } else {
      toast.info(`${workout.name} is already in your plan.`);
    }
  };

  // Mark as done
  const markAsDone = (id: string) => {
    removeFromPlan(id);
    toast.success('Workout marked as done!');
  };

  // Get workouts to display based on active tab
  const displayedWorkouts = activeTab === 'plan' ? planWorkouts : savedWorkouts;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          <span className="text-xl font-bold">FITLOG</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-green-500 transition-colors">Workout</Link>
          <Link href="/my-plan" className="text-green-500 font-medium">My Plan</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/my-plan" className="flex items-center">
            <span className="bg-green-500 text-gray-900 px-2 py-1 rounded-md mr-1">{planWorkouts.length}</span>
            <span className="hidden sm:inline">Plan</span>
          </Link>
          <Link href="/my-plan" className="flex items-center">
            <span className="border border-gray-400 text-white px-2 py-1 rounded-md mr-1">{savedWorkouts.length}</span>
            <span className="hidden sm:inline">Saved</span>
          </Link>
        </div>
      </nav>

      <main className="py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">MY PLAN</h1>
            <p className="text-gray-400">Cap of five lifts for today. Finish them, then load more.</p>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Exercises</h3>
              <p className="text-2xl font-bold">{totalExercises}/5</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Minutes</h3>
              <p className="text-2xl font-bold">{totalMinutes}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Calories</h3>
              <p className="text-2xl font-bold">{totalCalories}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`pb-2 px-4 font-medium ${
                activeTab === 'plan' 
                  ? 'text-green-500 border-b-2 border-green-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('plan')}
            >
              Today's Plan
            </button>
            <button
              className={`pb-2 px-4 font-medium ${
                activeTab === 'saved' 
                  ? 'text-green-500 border-b-2 border-green-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              Saved
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-10">
              <p>Loading workouts…</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && displayedWorkouts.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-xl font-bold mb-2">NOTHING HERE YET</h2>
              <p className="text-gray-400 mb-6">Browse the library and add a lift to get today moving.</p>
              <Link href="/">
                <button className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-3 px-6 rounded-lg">
                  Go to workouts
                </button>
              </Link>
            </div>
          )}

          {/* Workouts List */}
          {!loading && displayedWorkouts.length > 0 && (
            <div className="space-y-4">
              {displayedWorkouts.map((workout) => (
                <div key={workout.id} className="bg-gray-800 rounded-xl p-4 flex flex-col sm:flex-row">
                  <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 sm:mr-4">
                    <img 
                      src={getExerciseImage(workout.name)} 
                      alt={workout.name} 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        // If image fails to load, show a placeholder
                        e.currentTarget.src = '/assets/Back Squat.webp';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{workout.name.toUpperCase()}</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {workout.equipment && Array.isArray(workout.equipment) ? 
                        workout.equipment.join(', ') : 
                        'Equipment not specified'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {workout.duration} min
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        {workout.calories} kcal
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {workout.rating}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push(`/fitlog/${workout.id}`)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                    >
                      View Details
                    </button>
                    
                    {activeTab === 'plan' ? (
                      <>
                        <button
                          onClick={() => markAsDone(workout.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-900 rounded-md text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Done
                        </button>
                        <button
                          onClick={() => removeFromPlan(workout.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => moveToPlan(workout)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-900 rounded-md text-sm"
                        >
                          Add to Plan
                        </button>
                        <button
                          onClick={() => removeFromSaved(workout.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <span className="text-lg font-bold">FITLOG</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 FitLog — Workout Library. Train hard, log honest.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}