import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";
import Moment from "moment";

const AmendAuction = () => {
  const location = useLocation();
  const auctionData = location.state?.auctionData;

  const conditions = [
    { label: "NEW", value: 0 },
    { label: "EXCELLENT", value: 1 },
    { label: "GOOD", value: 2 },
    { label: "USED", value: 3 },
    { label: "REFURBISHED", value: 4 },
    { label: "POOR", value: 5 },
  ];

  const getConditionValue = (label) => {
    const condition = conditions.find((c) => c.label === label);
    return condition ? condition.value : null;
  };

  const getConditionLabel = (value) => {
    const j = conditions.find((c) => c.value === value);
    return j ? j.label : null;
  };

  const [name, setName] = useState(auctionData.name || "");
  const [condition, setCondition] = useState(
    getConditionLabel(auctionData.condition) || null
  );
  const [description, setDescription] = useState(auctionData.description || "");
  const [isActive, setIsActive] = useState(auctionData.isActive || false);
  const [price, setPrice] = useState(auctionData.price || "");
  const [category, setCategory] = useState(auctionData.categoryName || "");
  const [imageUrl, setImageUrl] = useState(auctionData.imageUrl || "");
  const [expiryDate, setExpiryDate] = useState(auctionData.expiryDate || "");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [isImageUpdated, setIsImageUpdated] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (categories.length === 0) {
          if (!token) {
            setError("Not logged in");
            navigate("/login?redirectTo=update-auction");
            toast.error("Please login.");
            return;
          }
          const response = await axios.get(
            `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/category`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.data.$values) {
            const categoryNames = response.data.data.$values.map((c) => c.name);
            setCategories(categoryNames);
            setCategory(categoryNames[0]);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Error fetching categories. Please refresh.");
        setLoading(false);
      }
    };
    fetchCategories();
  }, [categories, error]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Display image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setIsImageUpdated(true);
  };

  const handleUpdateAuction = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login.");
      navigate("/login?redirectTo=update-auction");
      setError("Not logged in");
      return;
    }

    if (isImageUpdated) {
      if (!imageFile) {
        toast.error("Please select an image file.");
        return;
      }

      // Create a new FormData object
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        // Send a POST request to upload the image
        const response = await axios.post(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction/upload-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image. Please try again.");
      }
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction/${auctionData.auctionId}`,
        {
          ...auctionData,
          name: name,
          condition: getConditionValue(condition),
          Description: description,
          isActive: isActive,
          price: Number(price),
          categoryName: category,
          ImageUrl: imageUrl,
          ExpiryDate: expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        toast.success("Auction updated successfully");

        navigate("/manage-auctions");
      } else {
        toast.warning("There is something wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error updating auction:", err);
      setError("Error creating auction");
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleActiveToggle = () => {
    setIsActive(!isActive);
  };

  const handleConditionSelect = (e) => {
    setCondition(getConditionValue(e));
  };

  const handleCategorySelect = (e) => {
    setCategory(e);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Amend Auction Item
        </h2>
        <form className="space-y-4" onSubmit={handleUpdateAuction}>
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              id="name"
              placeholder="Enter item name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              htmlFor="condition"
            >
              Condition
            </label>
            <Select
              onValueChange={(e) => handleConditionSelect(e)}
              id="condition"
              defaultValue={condition}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((c) => (
                  <SelectItem key={c.value} value={c.label}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <Textarea
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              id="description"
              placeholder="Enter item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              onChange={(e) => handleImageChange(e)}
            />
          </div>
          {imageUrl && (
            <div className="mt-4">
              <label className="block mb-2">Image Preview:</label>
              <img src={imageUrl} alt="Preview" className="w-full" />
            </div>
          )}
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              htmlFor="isActive"
            >
              Is Active
            </label>
            <Switch
              aria-label="Is Active"
              id="isActive"
              defaultChecked={isActive}
              onCheckedChange={handleActiveToggle}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              id="price"
              placeholder="Enter item price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <Select
                id="category"
                defaultValue={category}
                onValueChange={(e) => handleCategorySelect(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              type="date"
              value={Moment(expiryDate).format("yyyy-MM-DD")}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <Button className="w-full bg-blue-600" type="submit">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AmendAuction;
