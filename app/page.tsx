'use client';

import { useState } from 'react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['Performance Efficiency', 'Compatibility', 'Reliability', 'Security']);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string>('IoT System');

  const dimensions = [
    { id: 'Performance Efficiency', name: 'Performance Efficiency', subChars: '3 sub-characteristics' },
    { id: 'Compatibility', name: 'Compatibility', subChars: '2 sub-characteristics' },
    { id: 'Reliability', name: 'Reliability', subChars: '4 sub-characteristics' },
    { id: 'Security', name: 'Security', subChars: '5 sub-characteristics' },
  ];

  const caseStudies = [
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

  const handleCaseStudyClick = (caseStudyId: string) => {
    const caseStudy = caseStudies.find((cs) => cs.id === caseStudyId);
    if (caseStudy) {
      setSelectedCaseStudy(caseStudyId);
      // Case study'nin dimension'larını seç (mevcut dimension'lar arasından)
      const availableDimensions = caseStudy.dimensions.filter((dim) =>
        dimensions.some((d) => d.id === dim)
      );
      setSelectedDimensions(availableDimensions.length > 0 ? availableDimensions : caseStudy.dimensions);
    }
  };

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dimensionId)
        ? prev.filter((id) => id !== dimensionId)
        : [...prev, dimensionId]
    );
    // Manuel seçim yapıldığında case study seçimini kaldır
    setSelectedCaseStudy('');
  };

  const getStep1Content = () => (
    <>
      <div className="app-header">
        <div className="app-title">ISO 15939 Measurement Process Simulator</div>
        <div className="app-subtitle">
          Learn software quality measurement using ISO 25010 quality model
        </div>
      </div>

      <div className="step-indicator">
        <div className="step active">
          <div className="step-circle">✓</div>
          <div className="step-label">Define</div>
        </div>
        <div className="step">
          <div className="step-circle">2</div>
          <div className="step-label">Plan</div>
        </div>
        <div className="step">
          <div className="step-circle">3</div>
          <div className="step-label">Collect</div>
        </div>
        <div className="step">
          <div className="step-circle">4</div>
          <div className="step-label">Analyse</div>
        </div>
      </div>

      <div className="content-area">
        <h2 className="section-title">Step 1: Define Quality Dimensions</h2>
        <p className="section-subtitle">
          Select the ISO 25010 quality characteristics you want to measure, or choose a predefined
          case study.
        </p>

        <div className="case-study-container">
          <div className="case-study-title">📋 Load Predefined Case Study</div>
          <div className="case-cards">
            {caseStudies.map((caseStudy) => {
              const isSelected = selectedCaseStudy === caseStudy.id;
              return (
                <div
                  key={caseStudy.id}
                  className={`case-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCaseStudyClick(caseStudy.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="case-card-title">{caseStudy.title}</div>
                  <div className="case-card-desc">{caseStudy.description}</div>
                  <div className="case-card-info">{caseStudy.dimensions.length} dimensions included</div>
                </div>
              );
            })}
          </div>
        </div>

        <h3
          style={{
            marginTop: 30,
            marginBottom: 15,
            color: "#2d3748",
            fontSize: "1.2em",
          }}
        >
          Or Select Dimensions Manually
        </h3>

        <div className="dimension-grid">
          {dimensions.map((dimension) => {
            const isSelected = selectedDimensions.includes(dimension.id);
  return (
              <div
                key={dimension.id}
                className={`dimension-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleDimension(dimension.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="dimension-info">
                  <h3>{dimension.name}</h3>
                  <p>{dimension.subChars}</p>
                </div>
                <div className="check-icon">{isSelected ? '✓' : ''}</div>
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: 20, color: "#718096" }}>
          Selected: {selectedDimensions.length} dimension(s)
          {selectedCaseStudy && (
            <span style={{ color: "#4c51bf", fontWeight: 600 }}> ({selectedCaseStudy})</span>
          )}
        </p>
      </div>
    </>
  );

  const steps = [
    {
      id: 1,
      title: 'Define Quality Dimensions',
      description: 'Users can either load predefined case studies (IoT, Healthcare, Mobile App) or manually select quality dimensions from ISO 25010.',
      content: getStep1Content(),
    },
    {
      id: 2,
      title: 'Plan - Assign Weights',
      description: 'Users assign percentage weights to each selected dimension. The system validates that weights sum to exactly 100%.',
      content: (
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
            <div className="step active">
              <div className="step-circle">2</div>
              <div className="step-label">Plan</div>
            </div>
            <div className="step">
              <div className="step-circle">3</div>
              <div className="step-label">Collect</div>
            </div>
            <div className="step">
              <div className="step-circle">4</div>
              <div className="step-label">Analyse</div>
            </div>
          </div>

          <div className="content-area">
            <h2 className="section-title">Step 2: Plan - Assign Weights</h2>
            <p className="section-subtitle">
              Assign percentage weights to each selected dimension. Total must equal 100%.
            </p>

            <div
              style={{
                background: "#dbeafe",
                border: "2px solid #93c5fd",
                borderRadius: 8,
                padding: 15,
                marginBottom: 25,
              }}
            >
              <p style={{ color: "#1e40af", fontSize: "0.95em" }}>
                <strong>Case Study Mode:</strong> Weights are pre-configured for IoT System
              </p>
            </div>

            <div className="weight-list">
              <div className="weight-item">
                <div className="weight-label">Performance Efficiency</div>
                <div className="weight-input-group">
                  <input
                    type="text"
                    className="weight-input"
                    value="30"
                    readOnly
                    style={{ background: "#f0f0f0" }}
                  />
                  <span className="weight-percent">%</span>
                </div>
              </div>
              <div className="weight-item">
                <div className="weight-label">Compatibility</div>
                <div className="weight-input-group">
                  <input
                    type="text"
                    className="weight-input"
                    value="25"
                    readOnly
                    style={{ background: "#f0f0f0" }}
                  />
                  <span className="weight-percent">%</span>
                </div>
              </div>
              <div className="weight-item">
                <div className="weight-label">Reliability</div>
                <div className="weight-input-group">
                  <input
                    type="text"
                    className="weight-input"
                    value="25"
                    readOnly
                    style={{ background: "#f0f0f0" }}
                  />
                  <span className="weight-percent">%</span>
                </div>
              </div>
              <div className="weight-item">
                <div className="weight-label">Security</div>
                <div className="weight-input-group">
                  <input
                    type="text"
                    className="weight-input"
                    value="20"
                    readOnly
                    style={{ background: "#f0f0f0" }}
                  />
                  <span className="weight-percent">%</span>
                </div>
              </div>
            </div>

            <div className="total-weight">
              <span className="total-weight-text">Total Weight: </span>
              <span className="total-weight-value">100%</span>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 3,
      title: 'Collect - Enter Metric Values',
      description: 'Users enter measurement values for each sub-characteristic. Different metric types (%, ms, score, count) are supported with appropriate units and ranges.',
      content: (
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
              Enter measurement values for each sub-characteristic based on ISO 25023 metrics.
            </p>

            <div className="metrics-container">
              <div className="metric-dimension">
                <div className="metric-dimension-title">Performance Efficiency</div>
                <div className="metric-items">
                  <div className="metric-item">
                    <div className="metric-row">
                      <div>
                        <div className="metric-name">Time Behaviour</div>
                        <div className="metric-desc">Response time</div>
                      </div>
                      <div className="metric-input-row">
                        <input type="text" className="metric-input" value="180" readOnly />
                        <span className="metric-unit">ms</span>
                      </div>
                    </div>
                    <div className="metric-info">
                      <span>Range: 0 - 5000</span>
                      <span className="inverse-badge">Lower is better</span>
                    </div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-row">
                      <div>
                        <div className="metric-name">Resource Utilization</div>
                        <div className="metric-desc">CPU/Memory usage</div>
                      </div>
                      <div className="metric-input-row">
                        <input type="text" className="metric-input" value="45" readOnly />
                        <span className="metric-unit">%</span>
                      </div>
                    </div>
                    <div className="metric-info">
                      <span>Range: 0 - 100</span>
                      <span className="inverse-badge">Lower is better</span>
                    </div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-row">
                      <div>
                        <div className="metric-name">Capacity</div>
                        <div className="metric-desc">Concurrent users</div>
                      </div>
                      <div className="metric-input-row">
                        <input type="text" className="metric-input" value="500" readOnly />
                        <span className="metric-unit">users</span>
                      </div>
                    </div>
                    <div className="metric-info">
                      <span>Range: 0 - 10000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="metric-dimension">
                <div className="metric-dimension-title">Reliability</div>
                <div className="metric-items">
                  <div className="metric-item">
                    <div className="metric-row">
                      <div>
                        <div className="metric-name">Availability</div>
                        <div className="metric-desc">Uptime percentage</div>
                      </div>
                      <div className="metric-input-row">
                        <input type="text" className="metric-input" value="98" readOnly />
                        <span className="metric-unit">%</span>
                      </div>
                    </div>
                    <div className="metric-info">
                      <span>Range: 0 - 100</span>
                    </div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-row">
                      <div>
                        <div className="metric-name">Recoverability</div>
                        <div className="metric-desc">Recovery time</div>
                      </div>
                      <div className="metric-input-row">
                        <input type="text" className="metric-input" value="30" readOnly />
                        <span className="metric-unit">seconds</span>
                      </div>
                    </div>
                    <div className="metric-info">
                      <span>Range: 0 - 300</span>
                      <span className="inverse-badge">Lower is better</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 4,
      title: 'Analyse - Results & Recommendations',
      description: 'The analysis dashboard shows overall weighted score, radar chart visualization, gap analysis with severity levels, and context-aware recommendations.',
      content: (
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
                <strong>Case Study:</strong> IoT System - Internet of Things device with resource
                constraints and connectivity requirements
          </p>
        </div>

            <div className="results-grid">
              <div className="result-card">
                <h3>Overall Weighted Quality Score</h3>
                <div className="result-score">
                  87.3<span style={{ fontSize: "0.5em" }}>/100</span>
                </div>
                <div className="result-rating">Very Good Quality</div>
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
                    <polygon
                      points="200,50 320,120 280,230 120,230 80,120"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                    />
                    <polygon
                      points="200,80 290,130 260,210 140,210 110,130"
                      fill="none"
                      stroke="#cbd5e0"
                      strokeWidth="1"
                    />
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
                      x2="320"
                      y2="120"
                      stroke="#cbd5e0"
                      strokeWidth="1"
                    />
                    <line
                      x1="200"
                      y1="150"
                      x2="280"
                      y2="230"
                      stroke="#cbd5e0"
                      strokeWidth="1"
                    />
                    <line
                      x1="200"
                      y1="150"
                      x2="120"
                      y2="230"
                      stroke="#cbd5e0"
                      strokeWidth="1"
                    />
                    <line
                      x1="200"
                      y1="150"
                      x2="80"
                      y2="120"
                      stroke="#cbd5e0"
                      strokeWidth="1"
                    />
                    <polygon
                      points="200,70 300,125 265,215 135,215 95,125"
                      fill="url(#radarGrad)"
                      stroke="#4c51bf"
                      strokeWidth="3"
                    />
                    <text
                      x="200"
                      y="40"
                      textAnchor="middle"
                      fill="#2d3748"
                      fontSize="12"
                      fontWeight="600"
                    >
                      Performance
                    </text>
                    <text
                      x="330"
                      y="125"
                      textAnchor="start"
                      fill="#2d3748"
                      fontSize="12"
                      fontWeight="600"
                    >
                      Compatibility
                    </text>
                    <text
                      x="290"
                      y="250"
                      textAnchor="middle"
                      fill="#2d3748"
                      fontSize="12"
                      fontWeight="600"
                    >
                      Reliability
                    </text>
                    <text
                      x="110"
                      y="250"
                      textAnchor="middle"
                      fill="#2d3748"
                      fontSize="12"
                      fontWeight="600"
                    >
                      Security
                    </text>
                  </svg>
                </div>
              </div>

              <div className="gap-analysis">
                <div className="chart-title">⚠️ Gap Analysis</div>
                <div className="gap-item moderate">
                  <div>
                    <span className="gap-name">Security</span>
                    <span className="gap-badge moderate">Moderate</span>
                  </div>
                  <div className="gap-score">
                    <div className="gap-score-value">65.2</div>
                    <div className="gap-score-diff">Gap: 34.8</div>
                  </div>
                </div>
              </div>

              <div className="recommendations">
                <div className="chart-title">💡 Recommendations</div>
                <div className="recommendation-item">
                  <div className="rec-number">1.</div>
                  <div className="rec-text">
                    Enhance Security for IoT: Use secure boot, implement device authentication, encrypt
                    data in transit and at rest, and regular firmware updates.
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="rec-number">2.</div>
                  <div className="rec-text">
                    Optimize Performance Efficiency for IoT: Implement efficient data compression, reduce
                    polling frequency, and use edge computing to minimize resource usage.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  const currentStepData = steps.find((step) => step.id === currentStep) || steps[0];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartNew = () => {
    setCurrentStep(1);
  };

  return (
    <div className="iso-body">
      <div className="iso-container">
        <div className="screenshot-content">
          {currentStepData.content}

          <div className="navigation">
            <button
              className="nav-btn"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <div className="nav-info">
              {currentStep} / {steps.length}
            </div>
            {currentStep === steps.length ? (
              <button className="nav-btn" onClick={handleStartNew} style={{ background: "#48bb78" }}>
                Start New Measurement
              </button>
            ) : (
              <button className="nav-btn" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
