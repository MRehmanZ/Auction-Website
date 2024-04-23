import { Delete, Edit } from "@mui/icons-material";
import { Button } from "./ui/button";
import { TableRow, TableCell } from "./ui/table";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";

const AuctionRow = ({ auctionData }) => {
  const calculateRemainingDays = (expiryDate) => {
    let seconds = (new Date(expiryDate) - new Date()) / 1000;

    if (seconds <= 0) return 0;
    let daysDifference = Math.floor(seconds / (60 * 60 * 24));
    return daysDifference;
  };

  const getStatus = (isActive) => {
    if (!isActive)
      return <div className="text-red-500 font-medium">Inactive</div>;
    if (calculateRemainingDays(auctionData.expiryDate) > 0)
      return <div className="text-green-500 font-medium">Active</div>;
    return <div className="text-red-500 font-medium">Ended</div>;
  };

  const navigate = useNavigate();

  const handleEdit = () => {
    // Redirect to the auction update page with the auctionId
    navigate(`/manage-auctions/${auctionData.auctionId}`, {
      state: { auctionData },
    });
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login?redirectTo=update-auction");
        toast.error("Please login.");
        return;
      }
      setLoading(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction/${auctionData.auctionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        navigate(0); //refresh to show updated list of auction items
        toast.success("Auction deleted successfully");
      } else {
        toast.warning("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting auction:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          {auctionData.imageUrl ? (
            <img
              alt={auctionData.name}
              className="rounded-md"
              height={64}
              src={auctionData.imageUrl}
              style={{
                aspectRatio: "64/64",
                objectFit: "cover",
              }}
              width={64}
            />
          ) : (
            <img
              alt="Auction Item"
              className="rounded-md"
              height={64}
              src="/placeholder.png"
              style={{
                aspectRatio: "64/64",
                objectFit: "cover",
              }}
              width={64}
            />
          )}
          <div>
            <div className="font-medium">{auctionData.name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {auctionData.category}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {auctionData.currentHighestBid !== 0 ? (
          <div className="font-medium">£{auctionData.currentHighestBid} </div>
        ) : (
          <div className="font-medium text-gray-400 ">No bids</div>
        )}
      </TableCell>
      <TableCell>
        <div className="text-blue-600 font-medium">
          {calculateRemainingDays(auctionData.expiryDate)}
        </div>
      </TableCell>
      <TableCell>{getStatus(auctionData.isActive)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Delete />
                <span className="sr-only">Delete</span>
              </Button>
              <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
              >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete this auction?
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteConfirm} color="error">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AuctionRow;
