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

  const activeStep = steps.find(step => step.isActive);

  return (
    <div className="space-y-3 sm:space-y-0">
      {/* Mobile Active Step Title */}
      {activeStep && (
        <div className="sm:hidden text-center">
          <p className="text-xs text-gray-500 mb-1">Step {activeStep.number} of {steps.length}</p>
          <h3 className="text-sm font-semibold text-purple-600">{activeStep.title}</h3>
        </div>
      )}
      
      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto">
        <div className="flex items-center space-x-2 sm:space-x-4 px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${getStepClassName(step)}`}>
                  {step.isCompleted ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`hidden sm:block mt-2 text-xs font-medium ${step.isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                  {step.title}
                </span>
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-colors ${getConnectionClassName(step)}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
