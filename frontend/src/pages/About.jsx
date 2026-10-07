function About() {
  return (
    <div>
      <div className="page-header">
        <h1>FinServe</h1>
        <p style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 'bold' }}>Intelligent Banking Analytics Platform</p>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          FinServe demonstrates advanced Data Structures and Algorithms through practical financial and banking use cases.
          This dashboard provides a complete architectural audit mapping 30 rigorous algorithm topics against the project's source code.
        </p>

        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Project Highlights</h3>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          <li><strong>6 Modules</strong> comprehensively spanning core DSA paradigms.</li>
          <li><strong>30 Required Algorithm Topics</strong> mapped directly to Java implementation files.</li>
          <li><strong>Algorithm Audit</strong> confirming O(N) complexity constraints and functional integrations.</li>
          <li><strong>Banking Use Cases</strong> such as transaction flow routing, fraud string-matching, and NP-hard compliance checks.</li>
          <li><strong>Complexity Analysis</strong> mapped to actual implementation structures.</li>
          <li><strong>Viva Preparation</strong> flagging partial heuristic limitations (e.g. Suffix Tries vs Trees) to ensure academic integrity.</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
