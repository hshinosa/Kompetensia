import React from 'react';

interface Step {
  readonly number: number;
  readonly title: string;
  readonly isActive: boolean;
  readonly isCompleted: boolean;
}

interface Props {
  readonly steps: Step[];
}

export default function StepIndicator({ steps }: Props) {
  const getStepClassName = (step: Step) => {
    if (step.isCompleted) return 'bg-green-500 text-white';
    if (step.isActive) return 'bg-purple-600 text-white';
    return 'bg-gray-200 text-gray-600';
  };

  const getConnectionClassName = (step: Step) => {
    return step.isCompleted ? 'bg-green-500' : 'bg-gray-200';
  };

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${getStepClassName(step)}`}>
                {step.isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${step.isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                {step.title}
              </span>
            </div>

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 transition-colors ${getConnectionClassName(step)}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
