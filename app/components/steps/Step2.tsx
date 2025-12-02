'use client';

import { useIso15939 } from '../../contexts/Iso15939Context';

export default function Step2() {
  const { selectedCaseStudy, selectedDimensions, dimensionWeights, setDimensionWeight } = useIso15939();
  
  // Toplam weight hesapla
  const totalWeight = selectedDimensions.reduce((sum, dimId) => sum + (dimensionWeights[dimId] || 0), 0);

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
            <strong>Case Study Mode:</strong> Weights are pre-configured for {selectedCaseStudy || 'IoT System'}
          </p>
        </div>

        <div className="weight-list">
          {selectedDimensions.map((dimensionId) => {
            const weight = dimensionWeights[dimensionId] || Math.round(100 / selectedDimensions.length);
            return (
              <div key={dimensionId} className="weight-item">
                <div className="weight-label">{dimensionId}</div>
                <div className="weight-input-group">
                  <input
                    type="number"
                    className="weight-input"
                    value={weight}
                    onChange={(e) => {
                      const newWeight = parseInt(e.target.value) || 0;
                      setDimensionWeight(dimensionId, newWeight);
                    }}
                    min="0"
                    max="100"
                    style={{ background: "#ffffff", color: "#2d3748" }}
                  />
                  <span className="weight-percent">%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`total-weight ${totalWeight !== 100 ? 'total-weight-error' : ''}`} style={{
          background: totalWeight === 100 ? "#d4edda" : "#f8d7da",
          border: totalWeight === 100 ? "2px solid #c3e6cb" : "2px solid #f5c6cb",
        }}>
          <span className="total-weight-text">Total Weight: </span>
          <span className="total-weight-value" style={{ color: totalWeight === 100 ? "#28a745" : "#dc3545" }}>
            {totalWeight}%
          </span>
          {totalWeight !== 100 && (
            <p style={{ marginTop: 10, fontSize: "0.9em", color: "#721c24" }}>
              Total must equal 100%. Current: {totalWeight}%
            </p>
          )}
        </div>
      </div>
    </>
  );
}

