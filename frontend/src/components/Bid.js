import { useState, useEffect } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";

const Bid = ({ price, userId, createdDate }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login.");
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.data) {
          setUsername(response.data.data.userName);
          console.log(username);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8 border">
          <AvatarImage alt="@username" src="/placeholder-user.jpg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{username}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {createdDate}
          </div>
        </div>
      </div>
      <div className="text-lg font-bold">£{price}</div>
    </div>
  );
};

export default Bid;
