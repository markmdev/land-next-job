import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SaveChanges({
  isEditing,
  setIsEditing,
  handleSaveChanges,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSaveChanges: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        onClick={() => {
          setIsEditing(false);
          handleSaveChanges();
        }}
        disabled={!isEditing}
        className="flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        size="lg"
      >
        <Save className="h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
}
