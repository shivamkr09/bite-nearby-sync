import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Legal = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Legal, Compliance, and Safety</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Food Safety and FSSAI Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              We are a marketplace platform connecting customers with independent food businesses. All listed vendors are required to possess a valid FSSAI Registration/License and comply with Food Safety and Standards Act, 2006 and related regulations.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vendors must provide their FSSAI Registration/License number and business details during onboarding.</li>
              <li>We may delist any vendor found operating without a valid FSSAI registration or in violation of hygiene norms.</li>
              <li>Ingredients, allergens, and veg/non-veg indications should be disclosed by vendors wherever applicable.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumer Protection and Grievance Redressal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              In line with the Consumer Protection (E-Commerce) Rules, 2020, we provide a grievance mechanism for users. We acknowledge complaints within 48 hours and aim to resolve them within 30 days.
            </p>
            <div className="space-y-1">
              <p><span className="font-medium text-foreground">Grievance Officer</span>: Designated Officer</p>
              <p><span className="font-medium text-foreground">Email</span>: support@example.com</p>
              <p><span className="font-medium text-foreground">Working hours</span>: 10:00–18:00 IST, Mon–Fri</p>
            </div>
            <Link to="/report-issue">
              <Button size="sm">Report a Food Safety or Order Issue</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              We collect only necessary information to provide our services. User data is handled per applicable laws, including the Digital Personal Data Protection Act, 2023. See our Privacy Policy for details.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refunds, Cancellations, and Pricing Transparency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Prices, taxes, and fees are shown before payment. Final charges are confirmed at checkout.</li>
              <li>Refunds/cancellations follow our platform policy and vendor-specific terms where applicable.</li>
              <li>For packaged foods, Legal Metrology requirements (e.g., MRP) apply to vendor listings.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Legal;
