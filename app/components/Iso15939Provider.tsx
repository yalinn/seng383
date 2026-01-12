'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { Iso15939Context, Iso15939ContextType, Dimension, CaseStudy, Metric } from '../contexts/Iso15939Context';

interface Iso15939ProviderProps {
  children: ReactNode;
}

// All 8 ISO 25010 Product Quality characteristics
const ALL_ISO_25010_DIMENSIONS = [
  'Functional Suitability',
  'Performance Efficiency',
  'Compatibility',
  'Usability',
  'Reliability',
  'Security',
  'Maintainability',
  'Portability',
];

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

  const dimensions: Dimension[] = ALL_ISO_25010_DIMENSIONS.map((id) => {
    const subCharsMap: Record<string, string> = {
      'Functional Suitability': 'Functional completeness',
      'Performance Efficiency': '3 sub-characteristics',
      'Compatibility': '2 sub-characteristics',
      'Usability': 'User error protection',
      'Reliability': '4 sub-characteristics',
      'Security': '5 sub-characteristics',
      'Maintainability': 'Modifiability',
      'Portability': 'Installability',
    };
    return {
      id,
      name: id,
      subChars: subCharsMap[id] || '3 sub-characteristics',
    };
  });

  // Get default metrics for a dimension (used for manual selection)
  const getMetricsForDimension = useCallback((dimensionId: string, caseStudyId: string = ''): Metric[] => {
    const metrics: Metric[] = [];

    if (dimensionId === 'Functional Suitability') {
      metrics.push({
        id: `functional-completeness-${caseStudyId || 'default'}`,
        name: 'Functional Completeness',
        description: 'Degree to which functions cover required tasks',
        dimensionId: 'Functional Suitability',
        min: 0,
        max: 100,
        direction: 'higher',
        unit: '%',
        value: 85,
      });
    } else if (dimensionId === 'Performance Efficiency') {
      metrics.push(
        {
          id: `time-behaviour-${caseStudyId || 'default'}`,
          name: 'Time Behaviour',
          description: 'Response time',
          dimensionId: 'Performance Efficiency',
          min: 0,
          max: 5000,
          direction: 'lower',
          unit: 'ms',
          value: caseStudyId === 'Safety Critical (Health)' ? 150 : caseStudyId === 'Mobile Application' ? 200 : 180,
        },
        {
          id: `resource-utilization-${caseStudyId || 'default'}`,
          name: 'Resource Utilization',
          description: 'CPU/Memory usage',
          dimensionId: 'Performance Efficiency',
          min: 0,
          max: 100,
          direction: 'lower',
          unit: '%',
          value: 45,
        },
        {
          id: `capacity-${caseStudyId || 'default'}`,
          name: 'Capacity',
          description: 'Concurrent users',
          dimensionId: 'Performance Efficiency',
          min: 0,
          max: 10000,
          direction: 'higher',
          unit: 'users',
          value: 500,
        }
      );
    } else if (dimensionId === 'Compatibility') {
      metrics.push({
        id: `co-existence-${caseStudyId || 'default'}`,
        name: 'Co-existence',
        description: caseStudyId === 'Mobile Application' 
          ? 'Cross-platform compatibility' 
          : 'Ability to coexist with other products',
        dimensionId: 'Compatibility',
        min: 0,
        max: 100,
        direction: 'higher',
        unit: '%',
        value: caseStudyId === 'Mobile Application' ? 90 : 85,
      });
    } else if (dimensionId === 'Usability') {
      metrics.push({
        id: `user-error-rate-${caseStudyId || 'default'}`,
        name: 'User Error Rate',
        description: caseStudyId === 'Safety Critical (Health)'
          ? 'Error rate in medical procedures'
          : 'User interaction error rate',
        dimensionId: 'Usability',
        min: 0,
        max: 100,
        direction: 'lower',
        unit: '%',
        value: caseStudyId === 'Safety Critical (Health)' ? 5 : 12,
      });
    } else if (dimensionId === 'Reliability') {
      if (caseStudyId === 'Safety Critical (Health)') {
        metrics.push({
          id: 'health-availability',
          name: 'Availability',
          description: 'System uptime percentage',
          dimensionId: 'Reliability',
          min: 0,
          max: 100,
          direction: 'higher',
          unit: '%',
          value: 99.5,
        });
      } else {
        metrics.push(
          {
            id: 'availability',
            name: 'Availability',
            description: 'Uptime percentage',
            dimensionId: 'Reliability',
            min: 0,
            max: 100,
            direction: 'higher',
            unit: '%',
            value: 98,
          },
          {
            id: 'recoverability',
            name: 'Recoverability',
            description: 'Recovery time',
            dimensionId: 'Reliability',
            min: 0,
            max: 300,
            direction: 'lower',
            unit: 'seconds',
            value: 30,
          }
        );
      }
    } else if (dimensionId === 'Security') {
      metrics.push({
        id: caseStudyId === 'Safety Critical (Health)' ? 'health-confidentiality' : 'confidentiality',
        name: 'Confidentiality',
        description: caseStudyId === 'Safety Critical (Health)' 
          ? 'Patient data protection level' 
          : 'Data protection level',
        dimensionId: 'Security',
        min: 0,
        max: 100,
        direction: 'higher',
        unit: '%',
        value: caseStudyId === 'Safety Critical (Health)' ? 95 : 75,
      });
    } else if (dimensionId === 'Maintainability') {
      metrics.push({
        id: `test-coverage-${caseStudyId || 'default'}`,
        name: 'Test Coverage',
        description: 'Percentage of code covered by tests',
        dimensionId: 'Maintainability',
        min: 0,
        max: 100,
        direction: 'higher',
        unit: '%',
        value: 60,
      });
    } else if (dimensionId === 'Portability') {
      metrics.push({
        id: `install-success-rate-${caseStudyId || 'default'}`,
        name: 'Install Success Rate',
        description: 'Successful installation rate',
        dimensionId: 'Portability',
        min: 0,
        max: 100,
        direction: 'higher',
        unit: '%',
        value: 90,
      });
    }

    return metrics;
  }, []);

  const initializeMetricsForCaseStudy = useCallback((caseStudyId: string, dimensions: string[]): Metric[] => {
    const allMetrics: Metric[] = [];
    dimensions.forEach((dimId) => {
      const dimensionMetrics = getMetricsForDimension(dimId, caseStudyId);
      allMetrics.push(...dimensionMetrics);
    });
    return allMetrics;
  }, [getMetricsForDimension]);

  const [metrics, setMetrics] = useState<Metric[]>(() =>
    initializeMetricsForCaseStudy('IoT System', ['Performance Efficiency', 'Compatibility', 'Reliability', 'Security'])
  );

  // Update metrics when case study or dimensions change
  useEffect(() => {
    const caseStudy = caseStudies.find((cs) => cs.id === selectedCaseStudy);
    const dimensionsMatchCaseStudy = caseStudy && 
      selectedDimensions.length === caseStudy.dimensions.length &&
      selectedDimensions.every((id) => caseStudy.dimensions.includes(id)) &&
      caseStudy.dimensions.every((id) => selectedDimensions.includes(id));
    
    if (dimensionsMatchCaseStudy) {
      // Dimensions match case study: initialize metrics for case study
      setMetrics(initializeMetricsForCaseStudy(selectedCaseStudy, caseStudy.dimensions));
    } else {
      // Dimensions don't match case study (manual selection): update metrics incrementally
      setMetrics((prevMetrics) => {
        const currentDimensionIds = new Set(prevMetrics.map((m) => m.dimensionId));
        const selectedDimensionIds = new Set(selectedDimensions);
        
        // Check if we need to update (dimensions changed)
        const dimensionsChanged = 
          currentDimensionIds.size !== selectedDimensionIds.size ||
          Array.from(currentDimensionIds).some((id) => !selectedDimensionIds.has(id)) ||
          Array.from(selectedDimensionIds).some((id) => !currentDimensionIds.has(id));

        if (!dimensionsChanged) {
          return prevMetrics;
        }

        const newMetrics: Metric[] = [];
        selectedDimensions.forEach((dimId) => {
          const existingMetrics = prevMetrics.filter((m) => m.dimensionId === dimId);
          if (existingMetrics.length > 0) {
            newMetrics.push(...existingMetrics);
          } else {
            // Add default metrics for this dimension
            const defaultMetrics = getMetricsForDimension(dimId, selectedCaseStudy);
            newMetrics.push(...defaultMetrics);
          }
        });
        return newMetrics;
      });
    }
  }, [selectedCaseStudy, selectedDimensions, initializeMetricsForCaseStudy, getMetricsForDimension]);

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
    const caseStudy = caseStudies.find((cs) => cs.id === caseStudyId);
    if (caseStudy) {
      setSelectedCaseStudy(caseStudyId);
      setSelectedDimensions([...caseStudy.dimensions]);
      // Initialize weights with equal distribution for the case study dimensions
      const weightPerDimension = Math.round(100 / caseStudy.dimensions.length);
      const remainder = 100 - (weightPerDimension * caseStudy.dimensions.length);
      const newWeights: Record<string, number> = {};
      caseStudy.dimensions.forEach((dimId, index) => {
        newWeights[dimId] = weightPerDimension + (index < remainder ? 1 : 0);
      });
      setDimensionWeights(newWeights);
      setMetrics(initializeMetricsForCaseStudy(caseStudyId, caseStudy.dimensions));
    } else {
      selectCaseStudy(caseStudyId);
    }
  };

  const setDimensionWeight = (dimensionId: string, weight: number) => {
    setDimensionWeights((prev) => ({
      ...prev,
      [dimensionId]: weight,
    }));
  };

  const setMetricValue = (metricId: string, value: number) => {
    setMetrics((prev) =>
      prev.map((metric) =>
        metric.id === metricId
          ? { ...metric, value: Math.max(metric.min, Math.min(metric.max, value)) }
          : metric
      )
    );
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
    const defaultDimensions = ['Performance Efficiency', 'Compatibility', 'Reliability', 'Security'];
    setSelectedDimensions(defaultDimensions);
    setSelectedCaseStudy('IoT System');
    setDimensionWeights({
      'Performance Efficiency': 30,
      'Compatibility': 25,
      'Reliability': 25,
      'Security': 20,
    });
    setMetrics(initializeMetricsForCaseStudy('IoT System', defaultDimensions));
  };

  const value: Iso15939ContextType = {
    currentStep,
    selectedDimensions,
    selectedCaseStudy,
    dimensionWeights,
    metrics,
    dimensions,
    caseStudies,
    setCurrentStep,
    selectDimension,
    deselectDimension,
    toggleDimension,
    selectCaseStudy,
    selectCaseStudyButton,
    setDimensionWeight,
    setMetricValue,
    nextStep,
    previousStep,
    startNewMeasurement,
  };

  return <Iso15939Context.Provider value={value}>{children}</Iso15939Context.Provider>;
}
