'use client';

import { useState, useEffect } from 'react';
import { SpyCat } from '@/types/spyCat';
import { spyCatApi } from '@/lib/api';
import SpyCatCard from '@/components/SpyCatCard';
import AddSpyCatForm from '@/components/AddSpyCatForm';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [cats, setCats] = useState<SpyCat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCats = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Fetching cats...');
      const data = await spyCatApi.getAll();
      console.log('Received cats:', data);
      setCats(data);
    } catch (error) {
      console.error('Error in fetchCats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch spy cats';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAddSuccess = () => {
    setIsAddingCat(false);
    fetchCats();
  };

  const handleUpdateOrDelete = () => {
    fetchCats();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading spy cats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900"> Spy Cats Dashboard</h1>
            </div>
            <button
              onClick={() => setIsAddingCat(true)}
              className="bg-primary-600 text-black px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              + Add New Spy Cat
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p><strong>Status:</strong> {isLoading ? 'Loading...' : error ? 'Error' : `Loaded ${cats.length} cats`}</p>
      </div>

      {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchCats}
                    className="bg-red-100 px-3 py-1 rounded text-sm text-red-800 hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {cats.length === 0 && !error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spy cats found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first spy cat to the team.</p>
            <button
              onClick={() => setIsAddingCat(true)}
              className="bg-primary-600 text-black px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Add Your First Spy Cat
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Spy Cats ({cats.length})
              </h2>
              <div className="text-sm text-gray-500">
                Total Team Salary: ${cats.reduce((sum, cat) => sum + cat.salary, 0).toLocaleString()}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cats.map((cat) => (
                <SpyCatCard
                  key={cat.id}
                  cat={cat}
                  onUpdate={handleUpdateOrDelete}
                  onDelete={handleUpdateOrDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Add Cat Modal */}
      {isAddingCat && (
        <AddSpyCatForm
          onSuccess={handleAddSuccess}
          onCancel={() => setIsAddingCat(false)}
        />
      )}

    </div>
  );
}