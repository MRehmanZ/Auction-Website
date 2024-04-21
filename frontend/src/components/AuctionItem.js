import { Button } from "./ui/button";

const AuctionItem = ({
  name,
  description,
  price,
  condition,
  category,
  createdDate,
  expiryData,
  currentHighestBid,
}) => {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800">
        <img
          alt="Auction Item"
          className="w-full h-full object-cover"
          height="450"
          src="/placeholder.svg"
          style={{
            aspectRatio: "600/450",
            objectFit: "cover",
          }}
          width="600"
        />
      </div>
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <div className="flex items-center mb-2">
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
            {condition} condition
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
            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
              {createdDate}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Expires:
            </span>
            <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
              {expiryData}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Current Bid:
            </span>
            <span className="ml-2 text-gray-700 dark:text-gray-300 text-lg font-bold">
              £{currentHighestBid ? currentHighestBid : price}
            </span>
          </div>
          <Button size="sm">Place Bid</Button>
        </div>
      </div>
    </div>
  );
};

export default AuctionItem;
