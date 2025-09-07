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

export const AppointmentDialog = ({
  open,
  onOpenChange,
  appointment,
  status,
  getList,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/appointment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: appointment?.id, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update status");
      } else {
        toast.success(data.message || "Status updated successfully");
        router.refresh(); // Refresh the page to update the list
        onOpenChange(false);
        getList();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{`Update appointment status`}</DialogTitle>
          <DialogDescription>
            {`Are you sure to want to ${
              status === "approved"
                ? "approve"
                : status === "rejected"
                ? "reject"
                : status === "completed"
                ? "mark as complete to"
                : ""
            } this appointment`}
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
            onClick={(e) => handleClick(e)}
            className={` ${loading && "pointer-events-none opacity-50"}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait...
              </>
            ) : (
              <>Update Status</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
