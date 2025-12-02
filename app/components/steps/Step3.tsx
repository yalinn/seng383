'use client';

import { useIso15939 } from '../../contexts/Iso15939Context';

export default function Step3() {
  const { selectedDimensions } = useIso15939();
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
          Enter measurement values for each sub-characteristic based on ISO 25023 metrics.
        </p>

        <div className="metrics-container">
          {selectedDimensions.includes('Performance Efficiency') && (
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
          )}

          {selectedDimensions.includes('Reliability') && (
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
          )}

          {selectedDimensions.includes('Compatibility') && (
          <div className="metric-dimension">
            <div className="metric-dimension-title">Compatibility</div>
            <div className="metric-items">
              <div className="metric-item">
                <div className="metric-row">
                  <div>
                    <div className="metric-name">Co-existence</div>
                    <div className="metric-desc">Ability to coexist with other products</div>
                  </div>
                  <div className="metric-input-row">
                    <input type="text" className="metric-input" value="85" readOnly />
                    <span className="metric-unit">%</span>
                  </div>
                </div>
                <div className="metric-info">
                  <span>Range: 0 - 100</span>
                </div>
              </div>
            </div>
          </div>
          )}

          {selectedDimensions.includes('Security') && (
          <div className="metric-dimension">
            <div className="metric-dimension-title">Security</div>
            <div className="metric-items">
              <div className="metric-item">
                <div className="metric-row">
                  <div>
                    <div className="metric-name">Confidentiality</div>
                    <div className="metric-desc">Data protection level</div>
                  </div>
                  <div className="metric-input-row">
                    <input type="text" className="metric-input" value="75" readOnly />
                    <span className="metric-unit">%</span>
                  </div>
                </div>
                <div className="metric-info">
                  <span>Range: 0 - 100</span>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

