import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LoginPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (error: any) {
      setError(formatErrorMessage(error));
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      navigate('/');
    } catch (error: any) {
      setError(error.message);
      console.error('Google sign-in error:', error);
    }
  };

  const formatErrorMessage = (error: any) => {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-credential': 'Invalid email or password',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account already exists with this email',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/network-request-failed': 'Connection error. Please check your internet connection',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
    };

    return errorMessages[error.code] || 'An error occurred. Please try again.';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 
                       rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 relative flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 bg-white border border-gray-200 text-gray-700 
                   py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 
                   transition-all duration-200"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="mt-6 text-center text-gray-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
} 