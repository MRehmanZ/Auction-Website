import { Delete, Edit } from "@mui/icons-material";
import { Button } from "./ui/button";
import { TableRow, TableCell } from "./ui/table";

const AuctionRow = ({
  name,
  price,
  category,
  currentHighestBid,
  imageUrl,
  expiryDate,
  isActive,
}) => {
  const calculateRemainingDays = (expiryDate) => {
    let seconds = Math.abs(new Date(expiryDate) - new Date()) / 1000;

    let daysDifference = Math.floor(seconds / (60 * 60 * 24));
    return daysDifference;
  };

  const getStatus = (isActive) => {
    if (!isActive)
      return <div className="text-red-500 font-medium">Inactive</div>;
    if (calculateRemainingDays(expiryDate) > 0)
      return <div className="text-green-500 font-medium">Active</div>;
    return <div className="text-gray-500 font-medium">Ended</div>;
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          {imageUrl ? (
            <img
              alt={name}
              className="rounded-md"
              height={64}
              src={imageUrl}
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
            <div className="font-medium">{name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {category}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">£{currentHighestBid}</div>
      </TableCell>
      <TableCell>
        <div className="text-gray-800 font-medium">
          {calculateRemainingDays(expiryDate)}
        </div>
      </TableCell>
      <TableCell>{getStatus(isActive)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline">
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
