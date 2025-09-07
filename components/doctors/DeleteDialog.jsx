import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const DeleteDialog = ({ open, onOpenChange, doctor }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/doctor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doctor?.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete doctor");
      } else {
        toast.success(data.message || "Doctor deleted successfully");
        router.refresh(); // Refresh the page to update the list
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{"Delete Doctor"}</DialogTitle>
          <DialogDescription>
            {"Are you sure you want to delete?"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className={"mt-10"}>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={(e) => handleDelete(e)}
            className={` ${loading && "pointer-events-none opacity-50"}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait...
              </>
            ) : (
              <>Delete Doctor</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
