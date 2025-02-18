/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../api';
import { useAuthStore } from '../stores/authStore';
import { Trophy, Users, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

export default function Auth() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    password: '',
    classSection: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, isSignUp ? formData : {
        email: formData.email,
        password: formData.password
      });

      login(data.student, data.token);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Authentication failed');
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto">
          {/* Left side - Features */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <Trophy className="h-12 w-12 text-indigo-600" />
                <h1 className="text-4xl font-bold text-gray-900 ml-3">
                  Class Engagement Tracker
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Track, measure, and celebrate student engagement in real-time
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    Student Engagement
                  </h3>
                </div>
                <p className="text-gray-600">
                  Track participation and engagement in real-time with an intuitive point system
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    Progress Tracking
                  </h3>
                </div>
                <p className="text-gray-600">
                  Monitor student progress with detailed analytics and visual insights
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    Leaderboard
                  </h3>
                </div>
                <p className="text-gray-600">
                  Foster healthy competition with real-time leaderboards and achievements
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 rounded-full p-3">
                    <GraduationCap className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    Class Management
                  </h3>
                </div>
                <p className="text-gray-600">
                  Easily manage multiple class sections and student groups
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isSignUp
                    ? 'Join your class and start tracking your engagement'
                    : 'Sign in to continue tracking your progress'}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <GoogleLoginButton />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                  </div>
                  {isSignUp && (
                    <>
                      <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                          Student ID
                        </label>
                        <input
                          id="studentId"
                          name="studentId"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                          placeholder="Enter your student ID"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                          Class Section
                        </label>
                        <input
                          id="section"
                          name="section"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                          placeholder="Enter your class section"
                          value={formData.classSection}
                          onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>
              </form>

              <div className="mt-6">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}