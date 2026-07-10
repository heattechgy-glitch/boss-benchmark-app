import React, { useState, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { scheduleTask } from '../utils/api';
import { format, addYears } from 'date-fns';
import { toast } from 'react-hot-toast';

const ScheduleModal = ({ isOpen, onClose, taskId, onScheduleSuccess }) => {
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxDate = useMemo(() => {
    const oneYearFromNow = addYears(new Date(), 1);
    return format(oneYearFromNow, "yyyy-MM-dd'T'HH:mm");
  }, []);

  const minDate = useMemo(() => {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm");
  }, []);

  const handleDateChange = (e) => {
    const selectedValue = e.target.value;
    const selectedDate = new Date(selectedValue);
    const maxAllowedDate = addYears(new Date(), 1);

    if (selectedDate > maxAllowedDate) {
      toast.error('Cannot schedule more than 1 year in the future');
      return;
    }

    setScheduledTime(selectedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduledTime) {
      toast.error('Please select a scheduled time');
      return;
    }

    const selectedDate = new Date(scheduledTime);
    const maxAllowedDate = addYears(new Date(), 1);

    if (selectedDate > maxAllowedDate) {
      toast.error('Cannot schedule more than 1 year in the future');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await scheduleTask(taskId, {
        scheduled_time: scheduledTime,
        notes: notes.trim() || null
      });
      
      toast.success(`Task scheduled for ${format(new Date(scheduledTime), 'PPpp')}`);
      onScheduleSuccess(result);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to schedule task:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setScheduledTime('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Schedule Task
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Time *
              </label>
              <input
                type="datetime-local"
                id="scheduledTime"
                value={scheduledTime}
                onChange={handleDateChange}
                min={minDate}
                max={maxDate}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum scheduling date: 1 year from today
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                placeholder="Add any notes about this scheduled task..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Task'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ScheduleModal;