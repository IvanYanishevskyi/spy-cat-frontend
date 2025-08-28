'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SpyCatCreate } from '@/types/spyCat';
import { spyCatApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AddSpyCatFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddSpyCatForm({ onSuccess, onCancel }: AddSpyCatFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SpyCatCreate>();

  const onSubmit = async (data: SpyCatCreate) => {
    setIsLoading(true);
    try {
      await spyCatApi.create(data);
      toast.success('Spy cat added successfully!');
      reset();
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add spy cat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-sm">
        <h2 className="text-lg font-medium mb-4">Add Spy Cat</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              {...register('years_of_experience', { 
                required: 'Required',
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              min="0"
              disabled={isLoading}
            />
            {errors.years_of_experience && (
              <p className="text-red-600 text-sm mt-1">{errors.years_of_experience.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Breed</label>
            <input
              type="text"
              {...register('breed', { required: 'Breed is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              placeholder="Persian, Siamese..."
              disabled={isLoading}
            />
            {errors.breed && <p className="text-red-600 text-sm mt-1">{errors.breed.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Salary</label>
            <input
              type="number"
              {...register('salary', { 
                required: 'Required',
                min: { value: 0.01, message: 'Must be greater than 0' },
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              min="0.01"
              step="0.01"
              disabled={isLoading}
            />
            {errors.salary && <p className="text-red-600 text-sm mt-1">{errors.salary.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary"
            >
              {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}