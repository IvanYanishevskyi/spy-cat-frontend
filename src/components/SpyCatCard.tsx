'use client';

import { useState } from 'react';
import { SpyCat } from '@/types/spyCat';
import { spyCatApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface SpyCatCardProps {
  cat: SpyCat;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function SpyCatCard({ cat, onUpdate, onDelete }: SpyCatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [salary, setSalary] = useState(cat.salary.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateSalary = async () => {
    if (isLoading) return;
    
    const newSalary = parseFloat(salary);
    if (isNaN(newSalary) || newSalary <= 0) {
      toast.error('Please enter a valid salary');
      return;
    }

    setIsLoading(true);
    try {
      await spyCatApi.update(cat.id, { salary: newSalary });
      toast.success('Salary updated successfully!');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update salary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this spy cat?')) {
      return;
    }

    setIsLoading(true);
    try {
      await spyCatApi.delete(cat.id);
      toast.success('Spy cat deleted successfully!');
      onDelete();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete spy cat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSalary(cat.salary.toString());
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{cat.name}</h3>
          <p className="text-sm text-gray-600">{cat.breed}</p>
          <p className="text-sm text-gray-600">{cat.years_of_experience} years</p>
        </div>
        <div className="text-right">
          {isEditing ? (
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-20 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:border-black"
              disabled={isLoading}
              autoFocus
            />
          ) : (
            <p className="font-medium">${cat.salary.toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="btn-secondary btn-small"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSalary}
              disabled={isLoading}
              className="btn-primary btn-small"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="btn-secondary btn-small"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn-danger btn-small"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}