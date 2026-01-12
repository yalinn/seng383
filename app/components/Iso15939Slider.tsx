'use client';

import { useIso15939 } from '../contexts/Iso15939Context';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';

export default function Iso15939Slider() {
  const { currentStep, nextStep, previousStep, startNewMeasurement, selectedDimensions, dimensionWeights } = useIso15939();
  
  // Calculate total weight for Step2 validation
  const totalWeight = selectedDimensions.reduce((sum, dimId) => sum + (dimensionWeights[dimId] || 0), 0);
  const isStep2Valid = currentStep !== 2 || totalWeight === 100;

  const steps = [
    { id: 1, component: <Step1 /> },
    { id: 2, component: <Step2 /> },
    { id: 3, component: <Step3 /> },
    { id: 4, component: <Step4 /> },
  ];

  const currentStepData = steps.find((step) => step.id === currentStep) || steps[0];

  return (
    <div className="iso-body">
      <div className="iso-container">
        <div className="screenshot-content">
          {currentStepData.component}

          <div className="navigation">
            <button
              className="nav-btn"
              onClick={previousStep}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <div className="nav-info">
              {currentStep} / {steps.length}
            </div>
            {currentStep === steps.length ? (
              <button className="nav-btn" onClick={startNewMeasurement} style={{ background: "#48bb78" }}>
                Start New Measurement
              </button>
            ) : (
              <button className="nav-btn" onClick={nextStep} disabled={!isStep2Valid} style={{ opacity: isStep2Valid ? 1 : 0.5, cursor: isStep2Valid ? 'pointer' : 'not-allowed' }}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

