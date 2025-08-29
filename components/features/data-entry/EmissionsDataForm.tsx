'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, AlertCircle, Loader2 } from 'lucide-react'
import { emissionsDataSchema, type EmissionsData } from '@/lib/utils/esg-validation'
import { useEmissionsData } from '@/hooks/mutations/use-emissions-data'

interface EmissionsDataFormProps {
  onSuccess?: (data: EmissionsData) => void
  organizationId?: string
}

export function EmissionsDataForm({ onSuccess, organizationId }: EmissionsDataFormProps) {
  const { mutate, isPending, isError, error } = useEmissionsData()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EmissionsData>({
    resolver: zodResolver(emissionsDataSchema),
    defaultValues: {
      unit: 'tCO2e'
    }
  })
  
  const onSubmit = async (data: EmissionsData) => {
    try {
      const result = await mutate(data)
      if (result.success) {
        reset()
        onSuccess?.(data)
      }
    } catch (err) {
      console.error('Failed to submit emissions data:', err)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Scope 1 Emissions */}
      <div>
        <label htmlFor="scope1" className="block text-sm font-medium text-gray-700 mb-1">
          Scope 1 Emissions *
        </label>
        <input
          id="scope1"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('scope1', { valueAsNumber: true })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.scope1 ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-label="Scope 1 emissions"
          aria-describedby={errors.scope1 ? 'scope1-error' : undefined}
        />
        {errors.scope1 && (
          <p id="scope1-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.scope1.message}
          </p>
        )}
      </div>
      
      {/* Scope 2 Emissions */}
      <div>
        <label htmlFor="scope2" className="block text-sm font-medium text-gray-700 mb-1">
          Scope 2 Emissions *
        </label>
        <input
          id="scope2"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('scope2', { valueAsNumber: true })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.scope2 ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-label="Scope 2 emissions"
          aria-describedby={errors.scope2 ? 'scope2-error' : undefined}
        />
        {errors.scope2 && (
          <p id="scope2-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.scope2.message}
          </p>
        )}
      </div>
      
      {/* Scope 3 Emissions (Optional) */}
      <div>
        <label htmlFor="scope3" className="block text-sm font-medium text-gray-700 mb-1">
          Scope 3 Emissions (Optional)
        </label>
        <input
          id="scope3"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('scope3', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Scope 3 emissions"
        />
        {errors.scope3 && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.scope3.message}
          </p>
        )}
      </div>
      
      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <div className="relative">
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label="Start date"
            />
            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.startDate.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <div className="relative">
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label="End date"
            />
            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>
      
      {/* Unit Selection */}
      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
          Unit
        </label>
        <select
          id="unit"
          {...register('unit')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Unit"
        >
          <option value="tCO2e">tCO2e (Metric tons CO₂ equivalent)</option>
          <option value="kgCO2e">kgCO2e (Kilograms CO₂ equivalent)</option>
          <option value="mtCO2e">MtCO2e (Million tons CO₂ equivalent)</option>
        </select>
      </div>
      
      {/* Notes (Optional) */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register('notes')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Add any additional context or notes..."
        />
      </div>
      
      {/* Error Display */}
      {isError && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">Failed to save emissions data</p>
        </div>
      )}
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </form>
  )
}
