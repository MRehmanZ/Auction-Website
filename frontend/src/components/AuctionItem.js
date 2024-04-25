import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const AuctionItem = ({
  name,
  description,
  price,
  condition,
  category,
  createdDate,
  expiryDate,
  currentHighestBid,
  auctionId,
  imageUrl,
}) => {
  const conditions = [
    { label: "New", value: 0 },
    { label: "Excellent", value: 1 },
    { label: "Good", value: 2 },
    { label: "Used", value: 3 },
    { label: "Refurbished", value: 4 },
    { label: "Poor", value: 5 },
  ];

  const getConditionLabel = (value) => {
    const condition = conditions.find((c) => c.value === value);
    return condition ? condition.label : null;
  };

  const navigate = useNavigate();

  const handlePlaceBidClick = () => {
    // Redirect to the auction details page with the auctionId
    navigate(`/auction/${auctionId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden">
      <div className="aspect-[4/3]  dark:bg-gray-800 flex items-center justify-center">
        {imageUrl ? (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-auto rounded-lg "
            />
          </div>
        ) : (
          <img
            alt="Auction Item"
            className="w-full h-full object-cover "
            height="450"
            src="/placeholder.png"
            style={{
              aspectRatio: "600/450",
              objectFit: "cover",
            }}
            width="600"
          />
        )}
      </div>
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <div className="flex items-center mb-2">
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
            {getConditionLabel(condition)} condition
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
            Category: {category}
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Created:
            </span>
            <span className="ml-1 text-gray-700 dark:text-gray-300 text-sm">
            {createdDate}
            </span>
          </div>

          {expiryDate ? (
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Expires:
              </span>
              <span className="ml-1 text-gray-700 dark:text-gray-300 text-sm">
                {expiryDate}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {currentHighestBid !== 0 ? "Current Bid" : "Price"}
            </span>
            <span className="ml-2 text-gray-700 dark:text-gray-300 text-lg font-bold">
              £
              {currentHighestBid
                ? new Intl.NumberFormat().format(currentHighestBid)
                : new Intl.NumberFormat().format(price)}
            </span>
          </div>
          <Button size="sm" onClick={handlePlaceBidClick}>
            Place Bid
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuctionItem;
