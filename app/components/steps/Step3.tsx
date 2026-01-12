'use client';

import { useIso15939 } from '../../contexts/Iso15939Context';
import { useState, useEffect, useMemo } from 'react';

export default function Step3() {
  const { selectedDimensions, metrics, setMetricValue } = useIso15939();
  
  // Local state for input values to allow proper display and editing
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  // Get metric IDs as a stable reference for dependency
  const metricIds = useMemo(() => metrics.map(m => m.id).sort().join(','), [metrics]);
  
  // Initialize input values from metrics when metrics are first loaded or new metrics are added
  useEffect(() => {
    setInputValues((prev) => {
      const newInputValues: Record<string, string> = { ...prev };
      let hasNewMetrics = false;
      metrics.forEach((metric) => {
        // Only initialize if not already in inputValues (preserve user input)
        if (!(metric.id in newInputValues)) {
          newInputValues[metric.id] = metric.value.toString();
          hasNewMetrics = true;
        }
      });
      return hasNewMetrics ? newInputValues : prev;
    });
  }, [metricIds, metrics]);

  // Filter metrics by selected dimensions and group by dimension
  const metricsByDimension = selectedDimensions.reduce((acc, dimensionId) => {
    const dimensionMetrics = metrics.filter((m) => m.dimensionId === dimensionId);
    if (dimensionMetrics.length > 0) {
      acc[dimensionId] = dimensionMetrics;
    }
    return acc;
  }, {} as Record<string, typeof metrics>);

  return (
    <>
      <div className="app-header">
        <div className="app-title">ISO 15939 Measurement Process Simulator</div>
        <div className="app-subtitle">
          Learn software quality measurement using ISO 25010 quality model
        </div>
      </div>

      <div className="step-indicator">
        <div className="step completed">
          <div className="step-circle">✓</div>
          <div className="step-label">Define</div>
        </div>
        <div className="step completed">
          <div className="step-circle">✓</div>
          <div className="step-label">Plan</div>
        </div>
        <div className="step active">
          <div className="step-circle">3</div>
          <div className="step-label">Collect</div>
        </div>
        <div className="step">
          <div className="step-circle">4</div>
          <div className="step-label">Analyse</div>
        </div>
      </div>

      <div className="content-area">
        <h2 className="section-title">Step 3: Collect - Enter Metric Values</h2>
        <p className="section-subtitle">
          Enter measurement values for metrics. Sub-characteristics are implicitly addressed through selected measurement metrics, in accordance with ISO/IEC 25010 and ISO/IEC 15939.
        </p>

        <div className="metrics-container">
          {selectedDimensions.map((dimensionId) => {
            const dimensionMetrics = metricsByDimension[dimensionId];
            if (!dimensionMetrics || dimensionMetrics.length === 0) {
              return null;
            }

            return (
              <div key={dimensionId} className="metric-dimension">
                <div className="metric-dimension-title">{dimensionId}</div>
                <div className="metric-items">
                  {dimensionMetrics.map((metric) => (
                    <div key={metric.id} className="metric-item">
                      <div className="metric-row">
                        <div>
                          <div className="metric-name">{metric.name}</div>
                          <div className="metric-desc">{metric.description}</div>
                          <div style={{ fontSize: '0.75em', color: '#718096', marginTop: '4px', fontStyle: 'italic' }}>
                            Measured sub-characteristic: {metric.subCharacteristic} (ISO/IEC 25010)
                          </div>
                        </div>
                        <div className="metric-input-row">
                          <input
                            type="number"
                            className="metric-input"
                            value={inputValues[metric.id] ?? metric.value.toString()}
                            onChange={(e) => {
                              const value = e.target.value;
                              setInputValues((prev) => ({ ...prev, [metric.id]: value }));
                              const numValue = parseFloat(value);
                              if (!isNaN(numValue)) {
                                const clampedValue = Math.max(metric.min, Math.min(metric.max, numValue));
                                setMetricValue(metric.id, clampedValue);
                              }
                            }}
                            onBlur={(e) => {
                              // On blur, if empty or invalid, reset to current metric value
                              const value = e.target.value;
                              const numValue = parseFloat(value);
                              if (value === '' || isNaN(numValue)) {
                                setInputValues((prev) => ({ ...prev, [metric.id]: metric.value.toString() }));
                              }
                            }}
                            min={metric.min}
                            max={metric.max}
                            step="any"
                          />
                          <span className="metric-unit">{metric.unit}</span>
                        </div>
                      </div>
                      <div className="metric-info">
                        <span>Range: {metric.min} - {metric.max}</span>
                        {metric.direction === 'lower' && (
                          <span className="inverse-badge">Lower is better</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
