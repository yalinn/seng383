'use client';

import { createContext, useContext } from 'react';

export interface Dimension {
  id: string;
  name: string;
  subChars: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  dimensions: string[];
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  dimensionId: string;
  subCharacteristic: string; // ISO 25010 sub-characteristic (required, embedded in metric definition)
  min: number;
  max: number;
  direction: 'higher' | 'lower';
  unit: string;
  value: number;
}

export interface Iso15939ContextType {
  // State
  currentStep: number;
  selectedDimensions: string[];
  selectedCaseStudy: string;
  dimensionWeights: Record<string, number>;
  metrics: Metric[];
  
  // Data
  dimensions: Dimension[];
  caseStudies: CaseStudy[];
  
  // Methods
  setCurrentStep: (step: number) => void;
  selectDimension: (dimensionId: string) => void;
  deselectDimension: (dimensionId: string) => void;
  toggleDimension: (dimensionId: string) => void;
  selectCaseStudy: (caseStudyId: string) => void;
  selectCaseStudyButton: (caseStudyId: string) => void;
  setDimensionWeight: (dimensionId: string, weight: number) => void;
  setMetricValue: (metricId: string, value: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  startNewMeasurement: () => void;
}

export const Iso15939Context = createContext<Iso15939ContextType | undefined>(undefined);

export const useIso15939 = () => {
  const context = useContext(Iso15939Context);
  if (!context) {
    throw new Error('useIso15939 must be used within Iso15939Provider');
  }
  return context;
};

