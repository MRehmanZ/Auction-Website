import { Delete, Edit } from "@mui/icons-material";
import { Button } from "./ui/button";
import { TableRow, TableCell } from "./ui/table";
import { useNavigate } from "react-router-dom";

const AuctionRow = ({ auctionData }) => {
  const calculateRemainingDays = (expiryDate) => {
    let seconds = Math.abs(new Date(expiryDate) - new Date()) / 1000;

    let daysDifference = Math.floor(seconds / (60 * 60 * 24));
    return daysDifference;
  };

  const getStatus = (isActive) => {
    if (!isActive)
      return <div className="text-red-500 font-medium">Inactive</div>;
    if (calculateRemainingDays(auctionData.expiryDate) > 0)
      return <div className="text-green-500 font-medium">Active</div>;
    return <div className="text-gray-500 font-medium">Ended</div>;
  };

  const navigate = useNavigate();

  const handleEdit = () => {
    // Redirect to the auction update page with the auctionId
    navigate(`/manage-auctions/${auctionData.auctionId}`, {
      state: { auctionData },
    });
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
        <div className="text-gray-800 font-medium">
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
          <Button size="icon" variant="outline">
            <Delete />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AuctionRow;
