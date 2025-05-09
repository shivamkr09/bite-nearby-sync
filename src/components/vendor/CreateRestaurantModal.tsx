
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateRestaurantForm from "./CreateRestaurantForm";
import { useState } from "react";

interface CreateRestaurantModalProps {
  trigger?: React.ReactNode;
}

const CreateRestaurantModal = ({ trigger }: CreateRestaurantModalProps) => {
  const [open, setOpen] = useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add New Restaurant</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Restaurant</DialogTitle>
          <DialogDescription>
            Fill in the details below to create your restaurant.
          </DialogDescription>
        </DialogHeader>
        <CreateRestaurantForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateRestaurantModal;
