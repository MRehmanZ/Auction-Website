import { useEffect, useState } from "react";
import Auction from "./Auction";
import { toast } from "sonner";
import axios from "axios";

const Home = () => {
  const [auctionItems, setAuctionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctionItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction`
        );
        if (response.data) {
          setAuctionItems(response.data);
        }
        console.log(response);
      } catch (error) {
        console.error("Error fetching auction items:", error);
        setError("Error fetching auction items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionItems();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Auction Items</h1>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            auctionItems.map((item) => (
              <Auction
                key={item.auctionId}
                name={item.name}
                description={item.description}
                price={item.price}
                condition={item.condition}
                category={item.category}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
