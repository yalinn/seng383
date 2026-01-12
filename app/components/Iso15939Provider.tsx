'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Iso15939Context, Iso15939ContextType, Dimension, CaseStudy, Metric } from '../contexts/Iso15939Context';

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

  // Build dimensions array from union of all case study dimensions
  const allDimensionIds = new Set<string>();
  caseStudies.forEach((cs) => {
    cs.dimensions.forEach((dim) => allDimensionIds.add(dim));
  });

  const dimensions: Dimension[] = Array.from(allDimensionIds)
    .sort()
    .map((id) => {
      // Map dimension IDs to their sub-characteristics counts
      const subCharsMap: Record<string, string> = {
        'Performance Efficiency': '3 sub-characteristics',
        'Compatibility': '2 sub-characteristics',
        'Reliability': '4 sub-characteristics',
        'Security': '5 sub-characteristics',
        'Usability': '5 sub-characteristics',
        'Portability': '3 sub-characteristics',
        'Functional Suitability': '4 sub-characteristics',
        'Maintainability': '4 sub-characteristics',
      };
      return {
        id,
        name: id,
        subChars: subCharsMap[id] || '3 sub-characteristics',
      };
    });

  const initializeMetricsForCaseStudy = (caseStudyId: string, dimensions: string[]): Metric[] => {
    const metrics: Metric[] = [];

    if (caseStudyId === 'IoT System') {
      if (dimensions.includes('Performance Efficiency')) {
        metrics.push(
          {
            id: 'time-behaviour',
            name: 'Time Behaviour',
            description: 'Response time',
            dimensionId: 'Performance Efficiency',
            min: 0,
            max: 5000,
            direction: 'lower',
            unit: 'ms',
            value: 180,
          },
          {
            id: 'resource-utilization',
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
            id: 'capacity',
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
      }
      if (dimensions.includes('Reliability')) {
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
      if (dimensions.includes('Compatibility')) {
        metrics.push({
          id: 'co-existence',
          name: 'Co-existence',
          description: 'Ability to coexist with other products',
          dimensionId: 'Compatibility',
          min: 0,
          max: 100,
          direction: 'higher',
          unit: '%',
          value: 85,
        });
      }
      if (dimensions.includes('Security')) {
        metrics.push({
          id: 'confidentiality',
          name: 'Confidentiality',
          description: 'Data protection level',
          dimensionId: 'Security',
          min: 0,
          max: 100,
          direction: 'higher',
          unit: '%',
          value: 75,
        });
      }
    } else if (caseStudyId === 'Safety Critical (Health)') {
      if (dimensions.includes('Reliability')) {
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
      }
      if (dimensions.includes('Security')) {
        metrics.push({
          id: 'health-confidentiality',
          name: 'Confidentiality',
          description: 'Patient data protection level',
          dimensionId: 'Security',
          min: 0,
          max: 100,
          direction: 'higher',
          unit: '%',
          value: 95,
        });
      }
      if (dimensions.includes('Performance Efficiency')) {
        metrics.push({
          id: 'health-response-time',
          name: 'Response Time',
          description: 'Critical operation response time',
          dimensionId: 'Performance Efficiency',
          min: 0,
          max: 5000,
          direction: 'lower',
          unit: 'ms',
          value: 150,
        });
      }
      if (dimensions.includes('Usability')) {
        metrics.push({
          id: 'health-user-error-rate',
          name: 'User Error Rate',
          description: 'Error rate in medical procedures',
          dimensionId: 'Usability',
          min: 0,
          max: 100,
          direction: 'lower',
          unit: '%',
          value: 5,
        });
      }
    } else if (caseStudyId === 'Mobile Application') {
      if (dimensions.includes('Usability')) {
        metrics.push({
          id: 'mobile-user-error-rate',
          name: 'User Error Rate',
          description: 'User interaction error rate',
          dimensionId: 'Usability',
          min: 0,
          max: 100,
          direction: 'lower',
          unit: '%',
          value: 10,
        });
      }
      if (dimensions.includes('Compatibility')) {
        metrics.push({
          id: 'mobile-co-existence',
          name: 'Co-existence',
          description: 'Cross-platform compatibility',
          dimensionId: 'Compatibility',
          min: 0,
          max: 100,
          direction: 'higher',
          unit: '%',
          value: 90,
        });
      }
      if (dimensions.includes('Performance Efficiency')) {
        metrics.push({
          id: 'mobile-response-time',
          name: 'Response Time',
          description: 'App response time',
          dimensionId: 'Performance Efficiency',
          min: 0,
          max: 5000,
          direction: 'lower',
          unit: 'ms',
          value: 200,
        });
      }
      if (dimensions.includes('Portability')) {
        metrics.push({
          id: 'mobile-install-success-rate',
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
    }

    return metrics;
  };

  const [metrics, setMetrics] = useState<Metric[]>(() =>
    initializeMetricsForCaseStudy('IoT System', ['Performance Efficiency', 'Compatibility', 'Reliability', 'Security'])
  );

  useEffect(() => {
    const caseStudy = caseStudies.find((cs) => cs.id === selectedCaseStudy);
    if (caseStudy) {
      setMetrics(initializeMetricsForCaseStudy(selectedCaseStudy, caseStudy.dimensions));
    }
  }, [selectedCaseStudy]);

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
