
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const MenuManagement = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const templateHeaders = "name,description,price,category,isAvailable,imageUrl";
    const templateData = "Burger,Delicious beef burger,10.99,Main,true,\nFries,Crispy fries,4.99,Sides,true,";
    const csvContent = `${templateHeaders}\n${templateData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Mock upload process
    setTimeout(() => {
      console.log("File uploaded:", file);
      setIsUploading(false);
      setFile(null);
      // Success notification would be added here
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Menu Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm">
            Download our template CSV file, fill it with your menu items, and upload it back to update your menu.
          </p>
          <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
            Download Template
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Menu CSV</label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full"
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected file: {file.name}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>
          ) : (
            "Upload & Update Menu"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuManagement;
