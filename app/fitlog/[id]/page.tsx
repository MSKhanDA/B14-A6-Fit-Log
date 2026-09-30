'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  // Fetch workout data by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error('Error fetching workout:', error);
        // Redirect to 404 if not found
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
      
      // Load plan and saved counts from localStorage
      const storedPlan = localStorage.getItem('todayPlan');
      const storedSaved = localStorage.getItem('savedWorkouts');
      setPlanCount(storedPlan ? JSON.parse(storedPlan).length : 0);
      setSavedCount(storedSaved ? JSON.parse(storedSaved).length : 0);
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  // Handle adding to plan
  const addToPlan = () => {
    if (!workout) return;
    
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
    } else {
      toast.info(`${workout.name} is already in your plan.`);
    }
  };

  // Handle saving for later
  const saveForLater = () => {
    if (!workout) return;
    
    const storedSaved = localStorage.getItem('savedWorkouts');
    let saved = storedSaved ? JSON.parse(storedSaved) : [];
    
    // Check if already saved
    if (!saved.some((item: Workout) => item.id === workout.id)) {
      saved.push(workout);
      localStorage.setItem('savedWorkouts', JSON.stringify(saved));
      setSavedCount(saved.length);
      toast.success(`Saved ${workout.name} for later!`);
    } else {
      toast.info(`${workout.name} is already saved.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading workout...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Workout not found</p>
      </div>
    );
  }

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
          <Link href="/my-plan" className="hover:text-green-500 transition-colors">My Plan</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/my-plan" className="flex items-center">
            <span className="bg-green-500 text-gray-900 px-2 py-1 rounded-md mr-1">{planCount}</span>
            <span className="hidden sm:inline">Plan</span>
          </Link>
          <Link href="/my-plan" className="flex items-center">
            <span className="border border-gray-400 text-white px-2 py-1 rounded-md mr-1">{savedCount}</span>
            <span className="hidden sm:inline">Saved</span>
          </Link>
        </div>
      </nav>

      <main className="py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Image */}
            <div className="lg:w-1/2">
              <div className="bg-gray-800 rounded-xl p-4 h-full">
                <img 
                  src={getExerciseImage(workout.name)} 
                  alt={workout.name} 
                  className="w-full h-96 object-cover rounded-xl"
                  onError={(e) => {
                    // If image fails to load, show a placeholder
                    e.currentTarget.src = '/assets/Back Squat.webp';
                  }}
                />
              </div>
            </div>
            
            {/* Right Side - Details */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold mb-2">{workout.name.toUpperCase()}</h1>
              <p className="text-gray-400 mb-6">{workout.description || 'Description not available'}</p>
              
              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {workout.category && Array.isArray(workout.category) ? 
                  workout.category.map((cat, idx) => (
                    <span key={idx} className="bg-gray-800 text-green-400 px-3 py-1 rounded-full text-sm">
                      {cat}
                    </span>
                  ))
                : <span className="bg-gray-800 text-green-400 px-3 py-1 rounded-full text-sm">N/A</span>}
              </div>
              
              {/* Key Specs Table */}
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">KEY SPECS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">EQUIPMENT</p>
                    <p>
                      {workout.equipment && Array.isArray(workout.equipment) ? 
                        workout.equipment.join(', ') : 
                        'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">DIFFICULTY</p>
                    <p>{workout.difficulty || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">SETS</p>
                    <p>{workout.sets || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">REPS</p>
                    <p>{workout.reps || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">DURATION</p>
                    <p>{typeof workout.duration === 'number' && !isNaN(workout.duration) ? `${workout.duration} min` : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">CALORIES</p>
                    <p>{typeof workout.calories === 'number' && !isNaN(workout.calories) ? `${workout.calories} kcal` : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">RATING</p>
                    <p>{typeof workout.rating === 'number' && !isNaN(workout.rating) ? `${workout.rating}/5` : 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">INSTRUCTIONS</h2>
                {workout.instructions && Array.isArray(workout.instructions) && workout.instructions.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-2">
                    {workout.instructions.map((instruction, idx) => (
                      <li key={idx} className="text-gray-300">{instruction}</li>
                    ))}
                  </ol>
                ) : (
                  <p>No instructions available</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={addToPlan}
                  disabled={planCount >= 5}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                    planCount >= 5 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 text-gray-900 hover:bg-green-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add to today's plan
                </button>
                
                <button 
                  onClick={saveForLater}
                  className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save for later
                </button>
              </div>
            </div>
          </div>
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