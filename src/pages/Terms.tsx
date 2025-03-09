import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-12 max-w-3xl">
      <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-slate max-w-none">
        <p className="lead">
          Welcome to React Project Library. By accessing our website, you agree
          to be bound by these Terms of Service.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the React Project Library website, you agree to
          be bound by these Terms of Service and all applicable laws and
          regulations. If you do not agree with any of these terms, you are
          prohibited from using or accessing this site.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the
          materials on React Project Library's website for personal,
          non-commercial transitory viewing only. This is the grant of a
          license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>
            Attempt to decompile or reverse engineer any software contained on
            the website
          </li>
          <li>
            Remove any copyright or other proprietary notations from the
            materials
          </li>
          <li>
            Transfer the materials to another person or "mirror" the materials
            on any other server
          </li>
        </ul>

        <h2>3. Disclaimer</h2>
        <p>
          The materials on React Project Library's website are provided on an
          'as is' basis. React Project Library makes no warranties, expressed or
          implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of
          merchantability, fitness for a particular purpose, or non-infringement
          of intellectual property or other violation of rights.
        </p>

        <h2>4. Limitations</h2>
        <p>
          In no event shall React Project Library or its suppliers be liable for
          any damages (including, without limitation, damages for loss of data
          or profit, or due to business interruption) arising out of the use or
          inability to use the materials on React Project Library's website,
          even if React Project Library or a React Project Library authorized
          representative has been notified orally or in writing of the
          possibility of such damage.
        </p>

        <h2>5. Accuracy of Materials</h2>
        <p>
          The materials appearing on React Project Library's website could
          include technical, typographical, or photographic errors. React
          Project Library does not warrant that any of the materials on its
          website are accurate, complete or current. React Project Library may
          make changes to the materials contained on its website at any time
          without notice.
        </p>

        <h2>6. Links</h2>
        <p>
          React Project Library has not reviewed all of the sites linked to its
          website and is not responsible for the contents of any such linked
          site. The inclusion of any link does not imply endorsement by React
          Project Library of the site. Use of any such linked website is at the
          user's own risk.
        </p>

        <h2>7. Modifications</h2>
        <p>
          React Project Library may revise these terms of service for its
          website at any time without notice. By using this website you are
          agreeing to be bound by the then current version of these terms of
          service.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with the laws and you irrevocably submit to the exclusive jurisdiction
          of the courts in that location.
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Terms;
