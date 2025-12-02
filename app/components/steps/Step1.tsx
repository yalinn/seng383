'use client';

import { useIso15939 } from '../../contexts/Iso15939Context';

export default function Step1() {
  const {
    selectedDimensions,
    selectedCaseStudy,
    dimensions,
    caseStudies,
    toggleDimension,
    selectCaseStudyButton,
  } = useIso15939();

  return (
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
                  onClick={() => selectCaseStudyButton(caseStudy.id)}
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
}

