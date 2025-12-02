'use client';

import { useState, ReactNode } from 'react';
import { Iso15939Context, Iso15939ContextType, Dimension, CaseStudy } from '../contexts/Iso15939Context';

interface Iso15939ProviderProps {
  children: ReactNode;
}

export default function Iso15939Provider({ children }: Iso15939ProviderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['Performance Efficiency', 'Compatibility', 'Reliability', 'Security']);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string>('IoT System');
  const [dimensionWeights, setDimensionWeights] = useState<Record<string, number>>({
    'Performance Efficiency': 30,
    'Compatibility': 25,
    'Reliability': 25,
    'Security': 20,
  });

  const dimensions: Dimension[] = [
    { id: 'Performance Efficiency', name: 'Performance Efficiency', subChars: '3 sub-characteristics' },
    { id: 'Compatibility', name: 'Compatibility', subChars: '2 sub-characteristics' },
    { id: 'Reliability', name: 'Reliability', subChars: '4 sub-characteristics' },
    { id: 'Security', name: 'Security', subChars: '5 sub-characteristics' },
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: 'IoT System',
      title: 'IoT System',
      description: 'Internet of Things device with resource constraints and connectivity requirements',
      dimensions: ['Performance Efficiency', 'Compatibility', 'Reliability', 'Security'],
    },
    {
      id: 'Safety Critical (Health)',
      title: 'Safety Critical (Health)',
      description: 'Healthcare system where reliability and accuracy are life-critical',
      dimensions: ['Reliability', 'Security', 'Performance Efficiency', 'Usability'],
    },
    {
      id: 'Mobile Application',
      title: 'Mobile Application',
      description: 'Consumer mobile app focused on user experience and cross-platform compatibility',
      dimensions: ['Usability', 'Compatibility', 'Performance Efficiency', 'Portability'],
    },
  ];

  const selectDimension = (dimensionId: string) => {
    setSelectedDimensions((prev) => {
      if (!prev.includes(dimensionId)) {
        return [...prev, dimensionId];
      }
      return prev;
    });
  };

  const deselectDimension = (dimensionId: string) => {
    setSelectedDimensions((prev) => prev.filter((id) => id !== dimensionId));
  };

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dimensionId)
        ? prev.filter((id) => id !== dimensionId)
        : [...prev, dimensionId]
    );
  };

  const selectCaseStudy = (caseStudyId: string) => {
    setSelectedCaseStudy(caseStudyId);
  };

  const selectCaseStudyButton = (caseStudyId: string) => {
    selectCaseStudy(caseStudyId);
  };

  const setDimensionWeight = (dimensionId: string, weight: number) => {
    setDimensionWeights((prev) => ({
      ...prev,
      [dimensionId]: weight,
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startNewMeasurement = () => {
    setCurrentStep(1);
    setSelectedDimensions(['Performance Efficiency', 'Compatibility', 'Reliability', 'Security']);
    setSelectedCaseStudy('IoT System');
    setDimensionWeights({
      'Performance Efficiency': 30,
      'Compatibility': 25,
      'Reliability': 25,
      'Security': 20,
    });
  };

  const value: Iso15939ContextType = {
    currentStep,
    selectedDimensions,
    selectedCaseStudy,
    dimensionWeights,
    dimensions,
    caseStudies,
    setCurrentStep,
    selectDimension,
    deselectDimension,
    toggleDimension,
    selectCaseStudy,
    selectCaseStudyButton,
    setDimensionWeight,
    nextStep,
    previousStep,
    startNewMeasurement,
  };

  return <Iso15939Context.Provider value={value}>{children}</Iso15939Context.Provider>;
}

