import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-12 max-w-3xl">
      <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none">
        <p className="lead">
          Your privacy is important to us. It is React Project Library's policy
          to respect your privacy regarding any information we may collect from
          you across our website.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We only collect information about you if we have a reason to do so—for
          example, to provide our services, to communicate with you, or to make
          our services better. We collect information in the following ways:
        </p>
        <ul>
          <li>
            <strong>Basic Account Information:</strong> We ask for basic
            information from you in order to set up your account, such as your
            name, email address, and password.
          </li>
          <li>
            <strong>Information You Provide to Us:</strong> We collect
            information that you provide to us when you fill out forms, respond
            to surveys, or communicate with us.
          </li>
          <li>
            <strong>Usage Information:</strong> We collect information about
            your usage of our services, such as the pages you visit, the time
            and date of your visit, and the time spent on each page.
          </li>
          <li>
            <strong>Device Information:</strong> We collect information about
            the device you use to access our services, including the hardware
            model, operating system and version, unique device identifiers, and
            mobile network information.
          </li>
        </ul>

        <h2>2. How We Use Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the website, and for
            marketing and promotional purposes
          </li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2>3. Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to track the activity
          on our service and hold certain information. Cookies are files with a
          small amount of data which may include an anonymous unique identifier.
          Cookies are sent to your browser from a website and stored on your
          device.
        </p>
        <p>
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our service.
        </p>

        <h2>4. Data Security</h2>
        <p>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet, or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your personal data, we cannot guarantee its absolute
          security.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          We may employ third-party companies and individuals due to the
          following reasons:
        </p>
        <ul>
          <li>To facilitate our service</li>
          <li>To provide the service on our behalf</li>
          <li>To perform service-related services</li>
          <li>To assist us in analyzing how our service is used</li>
        </ul>
        <p>
          These third parties have access to your personal information only to
          perform these tasks on our behalf and are obligated not to disclose or
          use it for any other purpose.
        </p>

        <h2>6. Children's Privacy</h2>
        <p>
          Our service does not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from children
          under 13. If you are a parent or guardian and you are aware that your
          child has provided us with personal data, please contact us.
        </p>

        <h2>7. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <ul>
          <li>By email: privacy@reactprojectlibrary.com</li>
          <li>By visiting the contact page on our website</li>
        </ul>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Privacy;
