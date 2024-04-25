import { useState, useEffect } from "react";
import { CardTitle, CardHeader, CardContent, Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Comment from "./Comment";
import Bid from "./Bid";
import LoadingSpinner from "./LoadingSpinner";
import { format } from "date-fns";

export default function Auction() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [user, setUser] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [currentHighestBid, setCurrentHighestBid] = useState();
  const [comments, setComments] = useState([]);
  const [bids, setBids] = useState([]);

  const [username, setUsername] = useState("");

  const [placeBidPrice, setPlaceBidPrice] = useState();

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);

  const { auction_id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login.");
          navigate("/login");
          return;
        }

        // includes Bids and Comments
        const response = await axios.get(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction/${auction_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data) {
          const item = response.data.data;

          setName(item.name);
          setBids(item.bids.$values);
          setComments(item.comments.$values);
          setCategory(item.categoryName);
          setCreatedDate(item.createdDate);
          setCondition(item.condition);
          setExpiryDate(item.expiryDate);
          setCurrentHighestBid(item.currentHighestBid);
          setImageUrl(item.imageUrl);
          setUser(item.userId);
          setPrice(item.price);
          setDescription(item.description);

          // Fetch the username using the userId
          const userResponse = await axios.get(
            `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/user/${item.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (userResponse.data.data) {
            setUsername(userResponse.data.data.userName);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching auction:", error);
        setLoading(false);
      }
    };
    fetchAuction();
  }, []);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction/${auction_id}/place-bid`,
        {
          price: placeBidPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Bid placed successfully");
        navigate(0); // refresh page
      } else {
        toast.warning("There is something wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error placing bid:", err);
      toast.error("Please enter correct amount");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/comment`,
        {
          description: comment,
          auctionId: auction_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Comment submitted successfully");
        navigate(0); // refresh page
      } else {
        toast.warning("There is something wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error placing bid:", err);
      toast.error("Please enter correct amount");
    }
  };

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

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="grid gap-6">
              <div className="rounded-lg overflow-hidden">
                {imageUrl ? (
                  <div className="mb-4">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                ) : (
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
                )}
              </div>
              <div className="grid gap-4">
                <h1 className="text-2xl font-bold">{name}</h1>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Condition
                    </p>
                    <p>{getConditionLabel(condition)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Category
                    </p>
                    <p>{category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created
                    </p>
                    <p>{format(createdDate, "dd/MM/yyyy, h:mm a")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Expires
                    </p>
                    <p>{format(expiryDate, "dd/MM/yyyy, h:mm a")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Seller
                    </p>
                    <p>{username}</p>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p>{description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">
                    £
                    {currentHighestBid !== 0
                      ? new Intl.NumberFormat().format(currentHighestBid)
                      : new Intl.NumberFormat().format(price)}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {currentHighestBid !== 0 ? "Current Highest Bid" : "Price"}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Place a Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4" onSubmit={handlePlaceBid}>
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="bid-amount">
                        Bid Amount
                      </Label>
                      <Input
                        id="bid-amount"
                        min={currentHighestBid}
                        placeholder="Enter your bid amount"
                        step={5}
                        type="number"
                        onChange={(e) => setPlaceBidPrice(e.target.value)}
                      />
                    </div>
                    <Button size="lg">Place Bid</Button>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>All Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {bids.toReversed().map((b) => (
                      <Bid
                        key={b.bidId}
                        userId={b.userId}
                        price={b.price}
                        createdDate={b.dateCreated}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={handleSubmitComment}>
                  <Textarea
                    className="p-4 min-h-[100px]"
                    placeholder="Write your comment..."
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button size="sm">Submit</Button>
                </form>
              </CardContent>
            </Card>
            <div className="mt-6 grid gap-4">
              {comments.toReversed().map((c) => (
                <Comment
                  key={c.commendId}
                  description={c.description}
                  userId={c.userId}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
