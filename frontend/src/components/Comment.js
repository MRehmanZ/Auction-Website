import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";

const Comment = ({ userId, description }) => {
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
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage alt="@commenter1" />
        <AvatarFallback>C1</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{username}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Comment;
