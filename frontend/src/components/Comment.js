import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Comment = ({ userId, description }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login.");
          navigate("/login"); // TODO: redirect to current auction item page
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

  return (
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
