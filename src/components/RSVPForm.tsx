import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { readGuestFromLocation } from '../guest';
import { sendToSheet } from '../sheets';

interface RSVPFormData {
  name: string;
  phone: string;
  guests: string;
  attendance: 'yes' | 'no';
  dietaryRestrictions: string;
}

export function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Name from the personal invite link (e.g. "Mr. & Mrs. Perera"), saved with the RSVP so you can
  // see which invitation each reply came from even if the guest edits the name field.
  const [invitedAs] = useState(() => readGuestFromLocation());
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RSVPFormData>({
    defaultValues: { name: invitedAs },
  });

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);

    try {
      await sendToSheet('RSVP', {
        name: data.name.trim(),
        phone: data.phone.trim(),
        guests: data.guests,
        attendance: data.attendance === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline',
        dietaryRestrictions: (data.dietaryRestrictions || '').trim(),
        invitedAs,
      });

      toast.success('Thank you! Your RSVP has been received.');
      reset({ name: invitedAs, phone: '', guests: '', dietaryRestrictions: '' });
    } catch (error) {
      console.error('RSVP submit failed:', error);
      toast.error('Could not send RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-gradient-to-br from-white to-stone-50 rounded-2xl p-8 shadow-xl border-2 border-[#7d8f4e]/30 relative"
    >
      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#7d8f4e]" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[#7d8f4e]" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[#7d8f4e]" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#7d8f4e]" />

      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-serif text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7d8f4e] focus:outline-none transition-colors bg-white"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-serif text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^\+?[0-9\s-]{9,15}$/,
                message: 'Invalid phone number'
              }
            })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7d8f4e] focus:outline-none transition-colors bg-white"
            placeholder="0771234567"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Number of Guests */}
        <div>
          <label className="block text-sm font-serif text-gray-700 mb-2">
            Number of Guests *
          </label>
          <select
            {...register('guests', { required: 'Please select number of guests' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7d8f4e] focus:outline-none transition-colors bg-white"
          >
            <option value="">Select...</option>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5+">5+ Guests</option>
          </select>
          {errors.guests && (
            <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
          )}
        </div>

        {/* Attendance */}
        <div>
          <label className="block text-sm font-serif text-gray-700 mb-3">
            Will you be attending? *
          </label>
          <div className="flex gap-4">
            <label className="flex-1 relative">
              <input
                {...register('attendance', { required: 'Please select an option' })}
                type="radio"
                value="yes"
                className="peer sr-only"
              />
              <div className="px-6 py-3 rounded-lg border-2 border-gray-200 text-center cursor-pointer peer-checked:border-[#7d8f4e] peer-checked:bg-[#7d8f4e]/10 transition-all">
                <span className="font-serif">Joyfully Accept</span>
              </div>
            </label>
            <label className="flex-1 relative">
              <input
                {...register('attendance', { required: 'Please select an option' })}
                type="radio"
                value="no"
                className="peer sr-only"
              />
              <div className="px-6 py-3 rounded-lg border-2 border-gray-200 text-center cursor-pointer peer-checked:border-[#7d8f4e] peer-checked:bg-[#7d8f4e]/10 transition-all">
                <span className="font-serif">Regretfully Decline</span>
              </div>
            </label>
          </div>
          {errors.attendance && (
            <p className="text-red-500 text-sm mt-1">{errors.attendance.message}</p>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-serif text-gray-700 mb-2">
            Dietary Restrictions or Special Requests
          </label>
          <textarea
            {...register('dietaryRestrictions')}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7d8f4e] focus:outline-none transition-colors resize-none bg-white"
            placeholder="Let us know if you have any dietary restrictions..."
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-[#7d8f4e] to-[#556b2f] text-white rounded-lg font-serif text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Sending...</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send RSVP</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
