import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "./ui/table";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import AuctionRow from "./AuctionRow";
import LoadingSpinner from "./LoadingSpinner";

const ManageAuctions = () => {
  const [myAuctionItems, setMyAuctionItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyAuctions = async () => {
      if (!token) {
        toast.error("Please login to view your auctions");
        navigate("/login?redirectTo=manage-auctions");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction/my-auctions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setMyAuctionItems(response.data.$values);
        }
      } catch (error) {
        console.error("Error fetching my auction items:", error);
        toast.error("There is something wrong. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, [token]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Auctions</h1>
        <Button size="sm">
          <Link to="/create-auction">Create New Auction</Link>
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>Ends In</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingSpinner />
            ) : (
              myAuctionItems.map((item) => <AuctionRow auctionData={item} />)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageAuctions;
