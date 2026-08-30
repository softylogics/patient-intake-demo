import React from 'react';

interface ProgressIndicatorProps {
  steps: { id: number; label: string }[];
  currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute top-2 left-0 right-0 h-1 bg-gray-200" />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = step.id <= currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                  } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                />
                <span className={`mt-1 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};