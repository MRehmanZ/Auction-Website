import { useEffect, useState } from "react";
import AuctionItem from "./AuctionItem";
import { toast } from "sonner";
import axios from "axios";
import { format } from "date-fns";
import Paginate from "./Paginate";
import LoadingSpinner from "./LoadingSpinner";

const Home = () => {
  const [auctionItems, setAuctionItems] = useState([]);
  const [activeAuctionItems, setActiveAuctionItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchAuctionItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction`
        );
        if (response.data) {
          setAuctionItems(response.data.$values);
          setActiveAuctionItems(auctionItems.filter((item) => item.isActive));
          setTotalPages(calculateTotalPages(auctionItems.length));
        }
      } catch (error) {
        console.error("Error fetching auction items:", error);
        toast.error("There is something wrong. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionItems();
  }, [totalPages]);

  const calculateTotalPages = (totalItems) => {
    const pages = totalItems / itemsPerPage;
    if (pages < 1) return 1;
    return Math.ceil(pages);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const onPageChange = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Auction Items</h1>
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeAuctionItems
              .toReversed()
              .slice(startIndex, endIndex)
              .map((item) => (
                <AuctionItem
                  key={item.auctionId}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  condition={item.condition}
                  category={item.categoryName}
                  createdDate={format(item.createdDate, "dd/MM/yyyy, h:mm a")}
                  expiryDate={format(item.expiryDate, "dd/MM/yyyy, h:mm a")}
                  currentHighestBid={item.currentHighestBid}
                  auctionId={item.auctionId}
                  imageUrl={item.imageUrl}
                />
              ))}
          </div>
        )}

        {auctionItems.length !== 0 && (
          <div>
            <Paginate
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
