import { useState, useEffect } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Bid = ({ bidId }) => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBid = async () => {
      try {
        console.log("Auction Id: " + bidId);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login.");
          navigate("/login"); // TODO: redirect to current auction item page
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/bid/${bidId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.data) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching bid:", error);
        setLoading(false);
      }
    };
    fetchBid();
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8 border">
          <AvatarImage alt="@username" src="/placeholder-user.jpg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">John Doe</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            2023-04-15
          </div>
        </div>
      </div>
      <div className="text-lg font-bold">$130</div>
    </div>
  );
};

export default Bid;
