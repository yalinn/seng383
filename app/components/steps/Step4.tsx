'use client';

import { useIso15939, Metric } from '../../contexts/Iso15939Context';
import { useMemo } from 'react';

interface GapAnalysis {
  dimensionId: string;
  score: number;
  gap: number;
  severity: 'critical' | 'moderate' | 'ok';
}

interface Recommendation {
  dimensionId: string;
  text: string;
  priority: number;
}

type Interpretation = 'Strong' | 'Moderate' | 'Weak';

const TARGET_SCORE = 80;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeMetricScore(metric: Metric): number {
  const clampedValue = clamp(metric.value, metric.min, metric.max);
  const range = metric.max - metric.min;
  
  if (range === 0) {
    return 100;
  }
  
  if (metric.direction === 'higher') {
    // Higher is better: (value - min) / (max - min) * 100
    return ((clampedValue - metric.min) / range) * 100;
  } else {
    // Lower is better: (max - value) / (max - min) * 100
    return ((metric.max - clampedValue) / range) * 100;
  }
}

// Analysis is based on metric → dimension → overall score.
function computeDimensionScore(dimensionId: string, metrics: Metric[]): number {
  const dimensionMetrics = metrics.filter((m) => m.dimensionId === dimensionId);
  if (dimensionMetrics.length === 0) {
    return 0;
  }
  
  const normalizedScores = dimensionMetrics.map(normalizeMetricScore);
  const sum = normalizedScores.reduce((acc, score) => acc + score, 0);
  return sum / normalizedScores.length;
}

function computeOverallWeightedScore(
  selectedDimensions: string[],
  dimensionWeights: Record<string, number>,
  metrics: Metric[]
): { score: number; totalWeight: number; normalizedWeights: Record<string, number> } {
  const totalWeight = selectedDimensions.reduce((sum, dimId) => sum + (dimensionWeights[dimId] || 0), 0);
  
  // Normalize weights if total != 100
  const normalizedWeights: Record<string, number> = {};
  if (totalWeight > 0) {
    selectedDimensions.forEach((dimId) => {
      normalizedWeights[dimId] = totalWeight === 100 
        ? (dimensionWeights[dimId] || 0) 
        : ((dimensionWeights[dimId] || 0) / totalWeight) * 100;
    });
  }
  
  let weightedSum = 0;
  selectedDimensions.forEach((dimId) => {
    const dimensionScore = computeDimensionScore(dimId, metrics);
    weightedSum += dimensionScore * (normalizedWeights[dimId] || 0);
  });
  
  const score = totalWeight > 0 ? weightedSum / 100 : 0;
  
  return { score, totalWeight, normalizedWeights };
}

function computeGapAndSeverity(
  selectedDimensions: string[],
  metrics: Metric[]
): GapAnalysis[] {
  const gaps: GapAnalysis[] = [];
  
  selectedDimensions.forEach((dimensionId) => {
    const score = computeDimensionScore(dimensionId, metrics);
    const gap = Math.max(0, TARGET_SCORE - score);
    
    let severity: 'critical' | 'moderate' | 'ok';
    if (gap >= 30) {
      severity = 'critical';
    } else if (gap >= 15) {
      severity = 'moderate';
    } else {
      severity = 'ok';
    }
    
    gaps.push({ dimensionId, score, gap, severity });
  });
  
  // Sort by severity (critical first) and then by lowest score
  gaps.sort((a, b) => {
    const severityOrder = { critical: 0, moderate: 1, ok: 2 };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return a.score - b.score;
  });
  
  return gaps;
}

function generateRecommendations(
  gaps: GapAnalysis[],
  selectedCaseStudy: string
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  const recommendationMap: Record<string, string> = {
    'Functional Suitability': 'Improve Functional Suitability: Conduct requirements analysis to identify missing functions, implement user-requested features, and ensure the software meets all specified functional requirements.',
    'Performance Efficiency': 'Optimize Performance Efficiency: Implement efficient algorithms, reduce resource consumption, optimize data structures, and use caching strategies to improve response times and capacity.',
    'Usability': 'Enhance Usability: Simplify user interfaces, provide clear feedback and error messages, conduct user testing, and implement user error protection mechanisms.',
    'Reliability': 'Enhance Reliability: Implement robust error handling, add redundancy, improve monitoring and logging, and establish disaster recovery procedures to increase availability and reduce recovery time.',
    'Security': 'Strengthen Security: Implement secure authentication and authorization, encrypt data in transit and at rest, conduct regular security audits, and keep software dependencies up to date.',
    'Maintainability': 'Improve Maintainability: Increase test coverage, refactor code for better structure, improve documentation, and implement automated testing and CI/CD pipelines.',
    'Portability': 'Enhance Portability: Ensure cross-platform compatibility, simplify installation procedures, use standard libraries and frameworks, and test on multiple environments.',
  };
  
  gaps.forEach((gap, index) => {
    if (gap.severity !== 'ok' && recommendationMap[gap.dimensionId]) {
      recommendations.push({
        dimensionId: gap.dimensionId,
        text: recommendationMap[gap.dimensionId],
        priority: index + 1,
      });
    }
  });
  
  // Limit to max 5 items
  return recommendations.slice(0, 5);
}

function getRatingLabel(score: number): string {
  if (score >= 90) return 'Excellent Quality';
  if (score >= 80) return 'Very Good Quality';
  if (score >= 70) return 'Good Quality';
  if (score >= 60) return 'Fair Quality';
  if (score >= 50) return 'Poor Quality';
  return 'Very Poor Quality';
}

function getInterpretation(score: number): Interpretation {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Moderate';
  return 'Weak';
}

function getInterpretationDetails(dimensionId: string, interpretation: Interpretation): { comment: string, action: string } {
  const isStrong = interpretation === 'Strong';
  const isModerate = interpretation === 'Moderate';
  
  // Base map for text content (Compatibility removed)
  const map: Record<string, { strong: string, mod: string, weak: string, actStrong: string, actImprove: string }> = {
    'Functional Suitability': {
      strong: 'Functional completeness meets high standards.',
      mod: 'Minor functional gaps identified.',
      weak: 'Significant missing functionality found.',
      actStrong: 'Maintain rigorous regression testing.',
      actImprove: 'Prioritize feature implementation based on user needs.',
    },
    'Performance Efficiency': {
      strong: 'Resource usage and timing are optimal.',
      mod: 'Response times are acceptable but variable.',
      weak: 'System performance is below expectations.',
      actStrong: 'Monitor metrics for regression.',
      actImprove: 'Profile code to identify bottlenecks.',
    },
    'Usability': {
      strong: 'Interface is intuitive and user-friendly.',
      mod: 'Some user workflows cause friction.',
      weak: 'High error rates and confusion observed.',
      actStrong: 'Continue user-centric design validation.',
      actImprove: 'Simplify complex workflows and improve help text.',
    },
    'Reliability': {
      strong: 'System is highly available and fault-tolerant.',
      mod: 'Basic reliability met, but recovery is slow.',
      weak: 'Frequent failures or instability detected.',
      actStrong: 'Ensure failover mechanisms remain tested.',
      actImprove: 'Implement better error handling and recovery logic.',
    },
    'Security': {
      strong: 'Security posture is robust.',
      mod: 'Basic security features present.',
      weak: 'Critical vulnerabilities may exist.',
      actStrong: 'Conduct regular security audits.',
      actImprove: 'Address identified security weaknesses immediately.',
    },
    'Maintainability': {
      strong: 'Code is modular and easy to modify.',
      mod: 'Some technical debt hampers changes.',
      weak: 'Coupling is high and testing is difficult.',
      actStrong: 'Enforce coding standards consistently.',
      actImprove: 'Refactor complex components and increase tests.',
    },
    'Portability': {
      strong: 'Software adapts well to environments.',
      mod: 'Adaptation requires some manual effort.',
      weak: 'Environment specific dependencies exist.',
      actStrong: 'Verify on new platform versions.',
      actImprove: 'Isolate environment-specific code.',
    },
  };

  const content = map[dimensionId] || {
    strong: 'Performance is strong.',
    mod: 'Performance is moderate.',
    weak: 'Performance needs improvement.',
    actStrong: 'Maintain current practices.',
    actImprove: 'Investigate root causes.',
  };

  return {
    comment: isStrong ? content.strong : (isModerate ? content.mod : content.weak),
    action: isStrong ? content.actStrong : content.actImprove
  };
}


export default function Step4() {
  const { selectedCaseStudy, selectedDimensions, dimensionWeights, metrics, caseStudies, dimensions: allDimensions } = useIso15939();
  
  const caseStudy = caseStudies.find((cs) => cs.id === selectedCaseStudy);
  const caseStudyDescription = caseStudy?.description || '';
  
  const { score: overallScore, totalWeight, normalizedWeights } = useMemo(
    () => computeOverallWeightedScore(selectedDimensions, dimensionWeights, metrics),
    [selectedDimensions, dimensionWeights, metrics]
  );
  
  const gaps = useMemo(
    () => computeGapAndSeverity(selectedDimensions, metrics),
    [selectedDimensions, metrics]
  );
  
  const recommendations = useMemo(
    () => generateRecommendations(gaps, selectedCaseStudy),
    [gaps, selectedCaseStudy]
  );
  
  const dimensionScores = useMemo(() => {
    const scores: Record<string, number> = {};
    selectedDimensions.forEach((dimId) => {
      scores[dimId] = computeDimensionScore(dimId, metrics);
    });
    return scores;
  }, [selectedDimensions, metrics]);

  // Chart Geometry (Restored Logic)
  const chartGeometry = useMemo(() => {
    const numDimensions = selectedDimensions.length;
    const centerX = 200;
    const centerY = 150;
    const radius = 100;
    
    if (numDimensions === 0) {
      return { outerPoints: '', innerPoints: '', dataPoints: '', axes: [], labelPositions: [], singleScore: 0 };
    }
    
    if (numDimensions === 1) {
      const score = dimensionScores[selectedDimensions[0]] || 0;
      return {
        outerPoints: '',
        innerPoints: '',
        dataPoints: '',
        axes: [],
        labelPositions: [{
          dimensionId: selectedDimensions[0],
          x: centerX,
          y: centerY - radius - 20,
          anchor: 'middle',
        }],
        singleScore: score,
      };
    }
    
    const angles = selectedDimensions.map((_, index) => {
      return (-90 + (index * 360 / numDimensions)) * (Math.PI / 180);
    });
    
    const outerPoints = angles.map((angle) => {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    
    const innerRadius = radius * 0.5;
    const innerPoints = angles.map((angle) => {
      const x = centerX + innerRadius * Math.cos(angle);
      const y = centerY + innerRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    
    const dataPoints = angles.map((angle, index) => {
      const score = dimensionScores[selectedDimensions[index]] || 0;
      const dataRadius = radius * (score / 100);
      const x = centerX + dataRadius * Math.cos(angle);
      const y = centerY + dataRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    
    const axes = angles.map((angle) => {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x1: centerX, y1: centerY, x2: x, y2: y };
    });
    
    const labelRadius = radius + 30;
    const labelPositions = angles.map((angle, index) => {
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      let anchor: 'start' | 'middle' | 'end' = 'middle';
      if (Math.abs(Math.cos(angle)) > 0.7) {
        anchor = Math.cos(angle) > 0 ? 'start' : 'end';
      }
      return {
        dimensionId: selectedDimensions[index],
        x,
        y,
        anchor,
      };
    });
    
    return { outerPoints, innerPoints, dataPoints, axes, labelPositions };
  }, [selectedDimensions, dimensionScores]);

  return (
    <>
      <div className="app-header">
        <div className="app-title">ISO 15939 Measurement Process Simulator</div>
        <div className="app-subtitle">
          Learn software quality measurement using ISO 25010 quality model
        </div>
      </div>

      <div className="step-indicator">
        <div className="step completed"><div className="step-circle">✓</div><div className="step-label">Define</div></div>
        <div className="step completed"><div className="step-circle">✓</div><div className="step-label">Plan</div></div>
        <div className="step completed"><div className="step-circle">✓</div><div className="step-label">Collect</div></div>
        <div className="step active"><div className="step-circle">4</div><div className="step-label">Analyse</div></div>
      </div>

      <div className="content-area">
        <h2 className="section-title">Step 4: Analyse - Results &amp; Recommendations</h2>
        
        <div style={{ background: "#f3e8ff", border: "2px solid #d8b4fe", borderRadius: 8, padding: 15, marginBottom: 25 }}>
          <p style={{ color: "#6b21a8" }}><strong>Case Study:</strong> {selectedCaseStudy || 'IoT System'} - {caseStudyDescription}</p>
        </div>

        {totalWeight !== 100 && (
          <div style={{ background: "#fff3cd", border: "2px solid #ffc107", borderRadius: 8, padding: 15, marginBottom: 25 }}>
            <p style={{ color: "#856404" }}><strong>Warning:</strong> Total weight is {totalWeight}% (expected 100%). Calculations use normalized weights.</p>
          </div>
        )}

        <div className="results-grid">
          <div className="result-card">
            <h3>Overall Weighted Quality Score</h3>
            <div className="result-score">
              {overallScore.toFixed(1)}<span style={{ fontSize: "0.5em" }}>/100</span>
            </div>
            <div className="result-rating">{getRatingLabel(overallScore)}</div>
          </div>

          <div className="radar-chart">
            <div className="chart-title">Quality Dimensions Radar Chart</div>
            <div className="chart-placeholder">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                <defs>
                  <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#4c51bf", stopOpacity: 0.6 }} />
                    <stop offset="100%" style={{ stopColor: "#667eea", stopOpacity: 0.4 }} />
                  </linearGradient>
                </defs>
                {selectedDimensions.length === 1 ? (
                  <>
                    <circle cx="200" cy="150" r="80" fill="url(#radarGrad)" stroke="#4c51bf" strokeWidth="3" />
                    <text x="200" y="145" textAnchor="middle" fill="#2d3748" fontSize="32" fontWeight="700">
                      {chartGeometry.singleScore?.toFixed(1) || '0'}
                    </text>
                    <text x="200" y="165" textAnchor="middle" fill="#718096" fontSize="14">/100</text>
                    {chartGeometry.labelPositions.map((pos) => (
                      <text key={pos.dimensionId} x={pos.x} y={pos.y} textAnchor={pos.anchor as "start" | "middle" | "end"} fill="#2d3748" fontSize="14" fontWeight="600">
                        {selectedDimensions[0]}
                      </text>
                    ))}
                  </>
                ) : selectedDimensions.length === 2 ? (
                  <>
                    <line x1={chartGeometry.axes[0]?.x2 || 200} y1={chartGeometry.axes[0]?.y2 || 150} x2={chartGeometry.axes[1]?.x2 || 200} y2={chartGeometry.axes[1]?.y2 || 150} stroke="#e2e8f0" strokeWidth="2" />
                    <line x1={chartGeometry.dataPoints.split(' ')[0]?.split(',')[0]} y1={chartGeometry.dataPoints.split(' ')[0]?.split(',')[1]} x2={chartGeometry.dataPoints.split(' ')[1]?.split(',')[0]} y2={chartGeometry.dataPoints.split(' ')[1]?.split(',')[1]} stroke="#4c51bf" strokeWidth="4" />
                    {chartGeometry.labelPositions.map((pos) => (
                      <text key={pos.dimensionId} x={pos.x} y={pos.y} textAnchor={pos.anchor as "start" | "middle" | "end"} fill="#2d3748" fontSize="12" fontWeight="600">
                        {pos.dimensionId.split(' ')[0]} ({dimensionScores[pos.dimensionId]?.toFixed(1) || '0'})
                      </text>
                    ))}
                  </>
                ) : (
                  <>
                    {chartGeometry.outerPoints && <polygon points={chartGeometry.outerPoints} fill="none" stroke="#e2e8f0" strokeWidth="2" />}
                    {(chartGeometry as any).innerPoints && <polygon points={(chartGeometry as any).innerPoints} fill="none" stroke="#cbd5e0" strokeWidth="1" />}
                    {chartGeometry.axes.map((axis, index) => (
                      <line key={index} x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2} stroke="#cbd5e0" strokeWidth="1" />
                    ))}
                    {chartGeometry.dataPoints && <polygon points={chartGeometry.dataPoints} fill="url(#radarGrad)" stroke="#4c51bf" strokeWidth="3" />}
                    {chartGeometry.labelPositions.map((pos) => {
                      const shortName = pos.dimensionId.split(' ')[0];
                      return (
                        <text key={pos.dimensionId} x={pos.x} y={pos.y} textAnchor={pos.anchor as "start" | "middle" | "end"} fill="#2d3748" fontSize="12" fontWeight="600">
                          {shortName} ({dimensionScores[pos.dimensionId]?.toFixed(1) || '0'})
                        </text>
                      );
                    })}
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* --- SUMMARY TABLE (PDF Compliance) --- */}
        <div style={{ marginTop: '2rem', marginBottom: '2rem', overflowX: 'auto' }}>
          <h3 style={{ color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Summary Table</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc', textAlign: 'left', color: '#2d3748' }}>
                <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Quality Characteristic</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Score (0-100)</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Weighted Contribution</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #e2e8f0' }}>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {selectedDimensions.map((dimId) => {
                const score = dimensionScores[dimId] || 0;
                const weight = normalizedWeights[dimId] || 0;
                const weightedVal = score * (weight / 100);
                const interpretation = getInterpretation(score);
                const color = interpretation === 'Strong' ? '#2f855a' : interpretation === 'Moderate' ? '#b7791f' : '#c53030';
                const bg = interpretation === 'Strong' ? '#f0fff4' : interpretation === 'Moderate' ? '#fffff0' : '#fff5f5';

                return (
                  <tr key={dimId} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '10px', fontWeight: 500, color: '#2d3748' }}>{dimId}</td>
                    <td style={{ padding: '10px', color: '#2d3748' }}>{score.toFixed(1)}</td>
                    <td style={{ padding: '10px', color: '#2d3748' }}>{weightedVal.toFixed(1)}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        backgroundColor: bg,
                        color: color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.85em'
                      }}>
                        {interpretation}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- GAP ANALYSIS (Existing Layout) --- */}
        <div className="gap-analysis">
          <div className="chart-title">⚠️ Gap Analysis</div>
          {gaps.filter((gap) => gap.severity !== 'ok').length === 0 ? (
            <div style={{ padding: '15px', color: '#28a745' }}>
              All dimensions meet the target score (≥{TARGET_SCORE}).
            </div>
          ) : (
            gaps
              .filter((gap) => gap.severity !== 'ok')
              .map((gap) => (
                <div key={gap.dimensionId} className={`gap-item ${gap.severity}`}>
                  <div>
                    <span className="gap-name">{gap.dimensionId}</span>
                    <span className={`gap-badge ${gap.severity}`}>
                      {gap.severity === 'critical' ? 'Critical' : 'Moderate'}
                    </span>
                  </div>
                  <div className="gap-score">
                    <div className="gap-score-value">{gap.score.toFixed(1)}</div>
                    <div className="gap-score-diff">Gap: {gap.gap.toFixed(1)}</div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* --- INTERPRET RESULTS (PDF Compliance) --- */}
        <div className="interpretation-section" style={{ marginTop: '2rem' }}>
          <h2 className="section-title">Interpret Results</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Strong Areas */}
            <div className="interp-group">
               <h3 style={{ color: '#276749', borderBottom: '2px solid #48bb78', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                 Strong Areas (Score ≥ 80)
               </h3>
               {selectedDimensions.filter(d => getInterpretation(dimensionScores[d]) === 'Strong').length === 0 ? (
                 <p style={{ fontStyle: 'italic', color: '#232427ff' }}>No strong areas identified.</p>
               ) : (
                 <div style={{ display: 'grid', gap: '1rem' }}>
                   {selectedDimensions.filter(d => getInterpretation(dimensionScores[d]) === 'Strong').map(d => {
                     const details = getInterpretationDetails(d, 'Strong');
                     return (
                       <div key={d} style={{ background: '#f0fff4', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #48bb78', color: '#1d232cff'  }}>
                         <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{d}</div>
                         <div style={{ marginBottom: '0.5rem' }}>{details.comment}</div>
                         <div style={{ fontSize: '0.9em', color: '#2f855a' }}>💡 {details.action}</div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>

            {/* Moderate Areas */}
            <div className="interp-group">
               <h3 style={{ color: '#975a16', borderBottom: '2px solid #ecc94b', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                 Moderate Areas (60 ≤ Score &lt; 80)
               </h3>
               {selectedDimensions.filter(d => getInterpretation(dimensionScores[d]) === 'Moderate').length === 0 ? (
                 <p style={{ fontStyle: 'italic', color: '#232427ff' }}>No moderate areas identified.</p>
               ) : (
                 <div style={{ display: 'grid', gap: '1rem' }}>
                   {selectedDimensions.filter(d => getInterpretation(dimensionScores[d]) === 'Moderate').map(d => {
                     const details = getInterpretationDetails(d, 'Moderate');
                     return (
                       <div key={d} style={{ background: '#fffff0', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #ecc94b', color: '#1d232cff' }}>
                         <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{d}</div>
                         <div style={{ marginBottom: '0.5rem' }}>{details.comment}</div>
                         <div style={{ fontSize: '0.9em', color: '#744210' }}>💡 {details.action}</div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>

            {/* Weak Areas */}
            <div className="interp-group">
               <h3 style={{ color: '#9b2c2c', borderBottom: '2px solid #f56565', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                 Weak Areas (Score &lt; 60)
               </h3>
               {selectedDimensions.filter(d => getInterpretation(dimensionScores[d]) === 'Weak').length === 0 ? (
                 <p style={{ fontStyle: 'italic', color: '#232427ff' }}>No weak areas identified.</p>
               ) : (
                 <div style={{ display: 'grid', gap: '1rem' }}>
                   {selectedDimensions.filter(d => getInterpretation(dimensionScores[d]) === 'Weak').map(d => {
                     const details = getInterpretationDetails(d, 'Weak');
                     return (
                       <div key={d} style={{ background: '#fff5f5', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #f56565', color: '#1d232cff' }}>
                         <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{d}</div>
                         <div style={{ marginBottom: '0.5rem' }}>{details.comment}</div>
                         <div style={{ fontSize: '0.9em', color: '#c53030' }}>💡 {details.action}</div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* --- RECOMMENDATIONS (Existing Layout) --- */}
        <div className="recommendations" style={{ marginTop: '2rem' }}>
          <div className="chart-title">💡 Detailed Recommendations</div>
          {recommendations.length === 0 ? (
            <div style={{ padding: '15px', color: '#28a745' }}>
              No critical or moderate recommendations. All dimensions are performing well.
            </div>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.dimensionId} className="recommendation-item">
                <div className="rec-number">{rec.priority}.</div>
                <div className="rec-text">{rec.text}</div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}
