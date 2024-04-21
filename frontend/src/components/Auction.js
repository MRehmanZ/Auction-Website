import { useState, useEffect } from "react";
import { CardTitle, CardHeader, CardContent, Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Comment from "./Comment";
import Bid from "./Bid";
import { AirVent } from "lucide-react";

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

  const [placeBidPrice, setPlaceBidPrice] = useState();

  const [loading, setLoading] = useState(false);

  const { auction_id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        console.log("Auction Id: " + auction_id);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login.");
          navigate("/login"); // TODO: redirect to current auction item page
          return;
        }
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
          setCategory(item.category); // TODO
          setComments(item.comments);
          setCreatedDate(item.createdDate);
          setCondition(item.condition);
          setExpiryDate(item.expiryDate);
          setCurrentHighestBid(item.currentHighestBid);
          setImageUrl(item.imageUrl);
          setUser(item.user); // TODO
          setPrice(item.price);
          setDescription(item.description);

          setLoading(false);

          //   console.log(item);
          console.log(bids);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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

      console.log("PLACE BID, auction id: " + auction_id);
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
      console.log(response.status);
      if (response.status === 200) {
        toast.success("Bid placed successfully");

        navigate(0);
      } else {
        toast.warning("There is something wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error placing bid:", err);
      toast.error("Please enter correct amount");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="grid gap-6">
          <div className="rounded-lg overflow-hidden">
            <img
              alt="Auction Item"
              className="w-full h-auto object-cover"
              height={600}
              src="/placeholder.svg"
              style={{
                aspectRatio: "800/600",
                objectFit: "cover",
              }}
              width={800}
            />
          </div>
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Condition
                </p>
                <p>{condition}</p>
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
                <p>{createdDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Expires
                </p>
                <p>{expiryDate}</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <p>{description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{currentHighestBid}</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Highest Bid
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
            <form className="grid gap-4">
              <Textarea
                className="p-4 min-h-[100px]"
                placeholder="Write your comment..."
              />
              <Button size="sm">Submit</Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-6 grid gap-4">
          <Comment />
        </div>
      </div>
    </div>
  );
}
