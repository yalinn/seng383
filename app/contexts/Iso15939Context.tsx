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

export interface Iso15939ContextType {
  // State
  currentStep: number;
  selectedDimensions: string[];
  selectedCaseStudy: string;
  dimensionWeights: Record<string, number>;
  
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

