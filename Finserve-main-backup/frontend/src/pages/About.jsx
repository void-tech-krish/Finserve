import PageHeader from '../components/PageHeader';
import Plate from '../components/Plate';

function About() {
  return (
    <div className="page-container">
      <PageHeader 
        eyebrow="Academic / DSA — System Overview"
        title="FinServe Architecture"
        subtitle="Intelligent Banking Analytics Platform demonstrating advanced Data Structures and Algorithms through practical financial engineering use cases."
        meta={
          <>
            <span>PLATFORM VERSION: v1.0.0</span>
            <span>•</span>
            <span>JAVA SPRING BOOT & REACT VITE</span>
          </>
        }
      />

      <Plate
        number={1}
        title="Platform Highlights & Academic Integrity"
        description="Comprehensive architectural overview."
        tag="ABOUT"
        tagVariant="brass"
        watermark="01"
      >
        <p className="text-paper-dim text-base mb-6">
          FinServe demonstrates advanced Data Structures and Algorithms through practical financial and banking use cases.
          This dashboard provides a complete architectural audit mapping 30 rigorous algorithm topics against the project's Java source code.
        </p>

        <h4 className="font-serif text-lg text-brass mb-3">Project Architecture Highlights</h4>
        <ul className="space-y-3 font-mono text-xs text-paper-dim">
          <li className="flex items-start gap-2">
            <span className="text-brass font-bold">&bull;</span>
            <span><strong>6 Modules</strong> comprehensively spanning core DSA paradigms.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brass font-bold">&bull;</span>
            <span><strong>30 Required Algorithm Topics</strong> mapped directly to Java implementation files.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brass font-bold">&bull;</span>
            <span><strong>Algorithm Audit</strong> confirming O(N) complexity constraints and functional integrations.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brass font-bold">&bull;</span>
            <span><strong>Banking Use Cases</strong> such as transaction flow routing, fraud string-matching, and NP-hard compliance checks.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brass font-bold">&bull;</span>
            <span><strong>Complexity Analysis</strong> mapped to actual implementation structures.</span>
          </li>
        </ul>
      </Plate>
    </div>
  );
}

export default About;
