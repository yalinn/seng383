'use client';

import { useIso15939 } from '../../contexts/Iso15939Context';

export default function Step4() {
  const { selectedCaseStudy } = useIso15939();

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
            <strong>Case Study:</strong> {selectedCaseStudy || 'IoT System'} - Internet of Things device with resource
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
  );
}

