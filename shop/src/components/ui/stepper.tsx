import React, { ReactElement, ReactNode, useState } from "react";

interface StepProps {
  isValid: boolean;
  children: ReactNode;
  title: string;
}

export const Step: React.FC<StepProps> = ({ children, title }) => (
  <>
    <h2 className="text-2xl font-bold mb-10">{title}</h2>
    {children}
  </>
);

interface StepperProps {
  children: ReactElement<StepProps>[];
  activeColor?: string;
  completedColor?: string;
}

const Stepper: React.FC<StepperProps> = ({
  children,
  activeColor = "bg-blue-500",
  completedColor = "bg-green-500",
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = React.Children.toArray(children);

  const isStepValid = (index: number) => {
    const step = steps[index] as React.ReactElement<{ isValid: boolean }>;
    return step.props.isValid ?? true;
  };

  const isStepActive = (index: number) => index === currentStep;
  const isStepCompleted = (index: number) => index < currentStep;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full mx-1 transition-all ${
              isStepCompleted(index)
                ? completedColor
                : isStepActive(index)
                ? activeColor
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-4">{steps[currentStep]}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-black"
        >
          Back
        </button>
        {currentStep !== steps.length - 1 && (
          <button
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="px-4 py-2 bg-brand text-black rounded disabled:opacity-50"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper;
