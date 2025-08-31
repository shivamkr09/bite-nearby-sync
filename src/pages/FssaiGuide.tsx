import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { FileText, CreditCard, Users, Mail } from "lucide-react";

const FssaiGuide = () => {
  const officialPortal = "https://foscos.fssai.gov.in/"; // Official FSSAI portal
  const providedLink = "https://fssairegistration.org/fssai-registration.php?gad_source=1&gad_campaignid=22551417575&gbraid=0AAAAA_kft2k0GumUWl_kofHEjAZT21uAL&gclid=Cj0KCQjw5JXFBhCrARIsAL1ckPumEvwL7HiDV6GcI5oRpGtsmON4_nUpiQMGZS3PiRQnnOgxaZlW3ewaAhY5EALw_wcB";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">FSSAI Registration Guide</h1>
      <p className="text-muted-foreground mb-6">
        To sell food legally in India, every food business operator (including small shops and home kitchens) must have an FSSAI Registration/License. Use the resources below to apply.
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        <a href={officialPortal} target="_blank" rel="noopener noreferrer">
          <Button>Apply on Official FSSAI Portal</Button>
        </a>
        <a href={providedLink} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">Proceed to Application (External Link)</Button>
        </a>
        <Link to="/signup">
          <Button variant="ghost">Create Vendor Account</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What you’ll need</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Applicant full name (as per PAN)</li>
              <li>Valid email ID and 10-digit mobile number (for OTP)</li>
              <li>Business/firm/company name</li>
              <li>Food category and nature of business</li>
              <li>Complete business address with pin code, state, district</li>
              <li>Scanned copy of PAN card</li>
              <li>Agreement to Terms of Service and OTP consent</li>
              <li>Verification code (captcha)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>We’re a marketplace and do not issue licenses. Applications are processed by FSSAI/authorized channels.</li>
              <li>You must have at least FSSAI Basic Registration active before going live on our platform.</li>
              <li>We may verify submissions and suspend listings for non-compliance.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

  <Card className="mt-6">
        <CardHeader>
          <CardTitle>Step-by-step instructions (English / हिन्दी)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="name">
              <AccordionTrigger>NAME OF APPLICANT / आवेदक का नाम</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should enter their full name as per their PAN Card. आवेदक को अपना पूरा नाम आपके पैन कार्ड के अनुसार दर्ज करना चाहिए।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="email">
              <AccordionTrigger>EMAIL ID / ईमेल आईडी</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should provide a valid and active email address. आवेदक को एक वैध और सक्रिय ईमेल पता प्रदान करना चाहिए।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="mobile">
              <AccordionTrigger>MOBILE NUMBER / मोबाइल नंबर</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should enter their 10-digit mobile number. Ensure that the mobile number is active as it will be used for OTP verification. आवेदक को अपना 10 अंकों का मोबाइल नंबर दर्ज करना होगा। सुनिश्चित करें कि मोबाइल नंबर सक्रिय है क्योंकि इसका उपयोग ओटीपी सत्यापन के लिए किया जाएगा।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="business-name">
              <AccordionTrigger>NAME OF BUSINESS / व्यवसाय / फर्म / कंपनी का नाम</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should enter the registered name of their business, firm, or company. आवेदक को अपने व्यवसाय, फर्म या कंपनी का पंजीकृत नाम दर्ज करना चाहिए।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="category">
              <AccordionTrigger>NAME OF THE FOOD CATEGORY / खाद्य श्रेणी का नाम</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should select the appropriate food category their business falls under from the given options. आवेदक को दिए गए विकल्पों में से उस उपयुक्त खाद्य श्रेणी का चयन करना चाहिए जिसके अंतर्गत उनका व्यवसाय आता है।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="kind">
              <AccordionTrigger>KIND OF BUSINESS / व्यवसाय का प्रकार</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicants should select the type of business they are operating from the provided list. आवेदकों को प्रदान की गई सूची से उस व्यवसाय के प्रकार का चयन करना चाहिए जो वे संचालित कर रहे हैं।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="address">
              <AccordionTrigger>COMPLETE BUSINESS ADDRESS / पता</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should provide the full address of their business location. आवेदक को अपने व्यावसायिक स्थान का पूरा पता देना चाहिए।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pincode">
              <AccordionTrigger>PINCODE / पिन कोड</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should enter the pincode for their business address. आवेदक को अपने व्यावसायिक पते का पिनकोड दर्ज करना होगा।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="state">
              <AccordionTrigger>STATE / राज्य</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should select the state where the business is located from the dropdown menu. आवेदक को ड्रॉपडाउन मेनू से उस राज्य का चयन करना चाहिए जहां व्यवसाय स्थित है।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="district">
              <AccordionTrigger>DISTRICT / जिला</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Applicant should select the district within the state where the business is located from the dropdown menu. आवेदक को ड्रॉपडाउन मेनू से राज्य के भीतर उस जिले का चयन करना चाहिए जहां व्यवसाय स्थित है।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pan">
              <AccordionTrigger>UPLOAD PAN CARD</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Click on the "Choose File" button to upload a scanned copy of your PAN card. अपने पैन कार्ड की स्कैन की हुई कॉपी अपलोड करने के लिए "फ़ाइल चुनें" बटन पर क्लिक करें।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tos">
              <AccordionTrigger>TERMS OF SERVICE</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Read the terms of service carefully and check the box to agree. सेवा की शर्तें ध्यानपूर्वक पढ़ें और सहमति के लिए बॉक्स को चेक करें।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="otp">
              <AccordionTrigger>OTP AGREEMENT / ओटीपी सहमति</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Check the box to agree to share the OTP sent to your mobile number for verification purposes. सत्यापन उद्देश्यों के लिए अपने मोबाइल नंबर पर भेजे गए ओटीपी को साझा करने के लिए सहमत होने के लिए बॉक्स को चेक करें।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="verification">
              <AccordionTrigger>VERIFICATION CODE / सत्यापन कोड</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Enter the 5-digit verification code in the given field. दिए गए फ़ील्ड में 5-अंकीय सत्यापन कोड दर्ज करें।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="submit">
              <AccordionTrigger>SUBMIT BUTTON / सबमिट बटन</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                After reviewing all details and entering the verification code, click the "Submit" button. सभी विवरणों की समीक्षा और सत्यापन कोड दर्ज करने के बाद, "सबमिट" पर क्लिक करें।
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Process overview tiles */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Application process overview</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-900 text-white p-6 flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <span className="font-medium">Fill the FSSAI FORM</span>
          </div>
          <div className="rounded-lg bg-slate-900 text-white p-6 flex items-center gap-3">
            <CreditCard className="h-6 w-6" />
            <span className="font-medium">Pay registration fees of application</span>
          </div>
          <div className="rounded-lg bg-slate-900 text-white p-6 flex items-center gap-3">
            <Users className="h-6 w-6" />
            <span className="font-medium">Department will process your form</span>
          </div>
          <div className="rounded-lg bg-slate-900 text-white p-6 flex items-center gap-3">
            <Mail className="h-6 w-6" />
            <span className="font-medium">Certificate will be sent to e-mail id</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FssaiGuide;
