'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

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

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [sortOption, setSortOption] = useState<'duration' | 'calories' | 'rating'>('duration');
  const router = useRouter();

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.abcz.workers.dev/api/fitlog');
        const data = await response.json();
        
        // Apply sorting
        let sortedData = [...data];
        switch(sortOption) {
          case 'duration':
            sortedData.sort((a, b) => a.duration - b.duration);
            break;
          case 'calories':
            sortedData.sort((a, b) => a.calories - b.calories);
            break;
          case 'rating':
            sortedData.sort((a, b) => b.rating - a.rating);
            break;
        }
        
        setWorkouts(sortedData);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
      
      // Load plan and saved counts from localStorage
      const storedPlan = localStorage.getItem('todayPlan');
      const storedSaved = localStorage.getItem('savedWorkouts');
      setPlanCount(storedPlan ? JSON.parse(storedPlan).length : 0);
      setSavedCount(storedSaved ? JSON.parse(storedSaved).length : 0);
    };

    fetchData();
  }, [sortOption]);

  // Handle adding to plan
  const addToPlan = (workout: Workout) => {
    if (planCount >= 5) {
      toast.error("You've reached the limit of 5 exercises for today's plan.");
      return;
    }

    const storedPlan = localStorage.getItem('todayPlan');
    let plan = storedPlan ? JSON.parse(storedPlan) : [];
    
    // Check if already in plan
    if (!plan.some((item: Workout) => item.id === workout.id)) {
      plan.push(workout);
      localStorage.setItem('todayPlan', JSON.stringify(plan));
      setPlanCount(plan.length);
      toast.success(`Added ${workout.name} to today's plan!`);
    }
  };

  // Handle saving for later
  const saveForLater = (workout: Workout) => {
    const storedSaved = localStorage.getItem('savedWorkouts');
    let saved = storedSaved ? JSON.parse(storedSaved) : [];
    
    // Check if already saved
    if (!saved.some((item: Workout) => item.id === workout.id)) {
      saved.push(workout);
      localStorage.setItem('savedWorkouts', JSON.stringify(saved));
      setSavedCount(saved.length);
      toast.success(`Saved ${workout.name} for later!`);
    }
  };

  // Handle sort change
  const handleSortChange = (option: 'duration' | 'calories' | 'rating') => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          <span className="text-xl font-bold">FITLOG</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-green-500 transition-colors">Workout</a>
          <a href="/my-plan" className="hover:text-green-500 transition-colors">My Plan</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="/my-plan" className="flex items-center">
            <span className="bg-green-500 text-gray-900 px-2 py-1 rounded-md mr-1">{planCount}</span>
            <span className="hidden sm:inline">Plan</span>
          </a>
          <a href="/my-plan" className="flex items-center">
            <span className="border border-gray-400 text-white px-2 py-1 rounded-md mr-1">{savedCount}</span>
            <span className="hidden sm:inline">Saved</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 md:px-8 bg-gray-800">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="text-sm text-green-500 font-semibold mb-2">WORKOUT LIBRARY</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              TRAIN WITH INTENT. LOG EVERY SET.
            </h1>
            <p className="text-gray-300 mb-6">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.
            </p>
            <button 
              onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-3 px-6 rounded-lg flex items-center"
            >
              BROWSE WORKOUTS
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/assets/banner.png" 
              alt="FitLog Banner" 
              className="w-full h-64 md:h-80 object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">THE LIBRARY</h2>
              <p className="text-gray-400">Twelve lifts covering every major muscle group.</p>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e: { target: { value: string } }) => handleSortChange(e.target.value as any)}
                className="bg-gray-800 text-white py-2 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <p>Loading workouts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout: Workout) => (
                <div 
                  key={workout.id} 
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/fitlog/${workout.id}`)}
                >
                  <div className="h-48 w-full">
                    <img 
                      src={getExerciseImage(workout.name)} 
                      alt={workout.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If image fails to load, show a placeholder
                        e.currentTarget.src = '/assets/Back Squat.webp';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {workout.category && 
                      ((Array.isArray(workout.category) && workout.category.length > 0) ||
                       (typeof workout.category === 'string' && workout.category.trim() !== '')) ?
                        Array.isArray(workout.category) ?
                          workout.category.map((cat, idx) => (
                            <span key={idx} className="bg-gray-700 text-green-400 text-xs px-2 py-1 rounded-full">
                              {cat}
                            </span>
                          )) :
                          [<span key="single-cat" className="bg-gray-700 text-green-400 text-xs px-2 py-1 rounded-full">
                            {String(workout.category)}
                          </span>] 
                        : <span className="bg-gray-700 text-green-400 text-xs px-2 py-1 rounded-full">N/A</span>}
                    </div>
                    <h3 className="text-lg font-bold mb-1">{workout.name.toUpperCase()}</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {workout.equipment && 
                      ((Array.isArray(workout.equipment) && workout.equipment.length > 0) ||
                       (typeof workout.equipment === 'string' && workout.equipment.trim() !== '')) ?
                        Array.isArray(workout.equipment) ? 
                          workout.equipment.join(', ') : 
                          String(workout.equipment) :
                        'Equipment not specified'}
                    </p>
                    
                    <div className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-3">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {typeof workout.duration === 'number' && !isNaN(workout.duration) ? `${workout.duration} min` : 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        {typeof workout.calories === 'number' && !isNaN(workout.calories) ? `${workout.calories} kcal` : 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {typeof workout.rating === 'number' && !isNaN(workout.rating) ? workout.rating : 'N/A'}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToPlan(workout);
                        }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                          planCount >= 5 
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 text-gray-900 hover:bg-green-600'
                        }`}
                        disabled={planCount >= 5}
                      >
                        Add to Plan
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          saveForLater(workout);
                        }}
                        className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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