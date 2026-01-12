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
    'Compatibility': 'Improve Compatibility: Ensure interoperability with other systems, follow standard protocols and interfaces, and test cross-platform compatibility to enhance co-existence.',
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

export default function Step4() {
  const { selectedCaseStudy, selectedDimensions, dimensionWeights, metrics, caseStudies } = useIso15939();
  
  const caseStudy = caseStudies.find((cs) => cs.id === selectedCaseStudy);
  const caseStudyDescription = caseStudy?.description || '';
  
  const { score: overallScore, totalWeight } = useMemo(
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
        <div className="step completed">
          <div className="step-circle">✓</div>
          <div className="step-label">Collect</div>
        </div>
        <div className="step active">
          <div className="step-circle">4</div>
          <div className="step-label">Analyse</div>
        </div>
      </div>

      <div className="content-area">
        <h2 className="section-title">Step 4: Analyse - Results &amp; Recommendations</h2>
        <div
          style={{
            background: "#f3e8ff",
            border: "2px solid #d8b4fe",
            borderRadius: 8,
            padding: 15,
            marginBottom: 25,
          }}
        >
          <p style={{ color: "#6b21a8" }}>
            <strong>Case Study:</strong> {selectedCaseStudy || 'IoT System'} - {caseStudyDescription}
          </p>
        </div>

        {totalWeight !== 100 && (
          <div
            style={{
              background: "#fff3cd",
              border: "2px solid #ffc107",
              borderRadius: 8,
              padding: 15,
              marginBottom: 25,
            }}
          >
            <p style={{ color: "#856404" }}>
              <strong>Warning:</strong> Total weight is {totalWeight}% (expected 100%). Calculations use normalized weights.
            </p>
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
                {/* Outer diamond */}
                <polygon
                  points="200,50 300,150 200,250 100,150"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                {/* Inner diamond */}
                <polygon
                  points="200,80 270,150 200,220 130,150"
                  fill="none"
                  stroke="#cbd5e0"
                  strokeWidth="1"
                />
                {/* Center lines */}
                <line
                  x1="200"
                  y1="150"
                  x2="200"
                  y2="50"
                  stroke="#cbd5e0"
                  strokeWidth="1"
                />
                <line
                  x1="200"
                  y1="150"
                  x2="300"
                  y2="150"
                  stroke="#cbd5e0"
                  strokeWidth="1"
                />
                <line
                  x1="200"
                  y1="150"
                  x2="200"
                  y2="250"
                  stroke="#cbd5e0"
                  strokeWidth="1"
                />
                <line
                  x1="200"
                  y1="150"
                  x2="100"
                  y2="150"
                  stroke="#cbd5e0"
                  strokeWidth="1"
                />
                {/* Data diamond - placeholder for now */}
                <polygon
                  points="200,70 280,150 200,230 120,150"
                  fill="url(#radarGrad)"
                  stroke="#4c51bf"
                  strokeWidth="3"
                />
                {/* Labels - dynamically placed based on selectedDimensions */}
                {selectedDimensions.includes('Performance Efficiency') && (
                  <text
                    x="200"
                    y="40"
                    textAnchor="middle"
                    fill="#2d3748"
                    fontSize="12"
                    fontWeight="600"
                  >
                    Performance ({dimensionScores['Performance Efficiency']?.toFixed(1) || '0'})
                  </text>
                )}
                {selectedDimensions.includes('Compatibility') && (
                  <text
                    x="310"
                    y="155"
                    textAnchor="start"
                    fill="#2d3748"
                    fontSize="12"
                    fontWeight="600"
                  >
                    Compatibility ({dimensionScores['Compatibility']?.toFixed(1) || '0'})
                  </text>
                )}
                {selectedDimensions.includes('Reliability') && (
                  <text
                    x="200"
                    y="270"
                    textAnchor="middle"
                    fill="#2d3748"
                    fontSize="12"
                    fontWeight="600"
                  >
                    Reliability ({dimensionScores['Reliability']?.toFixed(1) || '0'})
                  </text>
                )}
                {selectedDimensions.includes('Security') && (
                  <text
                    x="90"
                    y="155"
                    textAnchor="end"
                    fill="#2d3748"
                    fontSize="12"
                    fontWeight="600"
                  >
                    Security ({dimensionScores['Security']?.toFixed(1) || '0'})
                  </text>
                )}
              </svg>
            </div>
          </div>

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

          <div className="recommendations">
            <div className="chart-title">💡 Recommendations</div>
            {recommendations.length === 0 ? (
              <div style={{ padding: '15px', color: '#28a745' }}>
                No recommendations. All dimensions are performing well.
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
      </div>
    </>
  );
}
