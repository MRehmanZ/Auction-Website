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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateAuction = () => {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [price, setPrice] = useState();
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [expiryDate, setExpiryDate] = useState();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const conditions = [
    { label: "NEW", value: 0 },
    { label: "EXCELLENT", value: 1 },
    { label: "GOOD", value: 2 },
    { label: "USED", value: 3 },
    { label: "REFURBISHED", value: 4 },
    { label: "POOR", value: 5 },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (categories.length === 0) {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Please login.");
            navigate("/login?redirectTo=create-auction");
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
  }, [categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Display image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login.");
      return;
    }

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

      // Assuming the response contains the URL of the uploaded image
      setImageUrl(response.data.imageUrl);

      // Use the imageUrl in your create auction request
      // Other parts of the request...
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction`,
        {
          name: name,
          condition: Number(condition),
          Description: description,
          IsActive: isActive,
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
      if (response.status === 201) {
        toast.success("Auction created successfully");

        navigate("/");
      } else {
        toast.warning("There is something wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error creating auction:", err);
      setError("Error creating auction");
      toast.error("Please fill out all fields");
    }
  };

  const handleActiveToggle = () => {
    setIsActive(!isActive);
  };

  const getConditionValue = (label) => {
    const condition = conditions.find((c) => c.label === label);
    return condition ? condition.value : null;
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
          Create Auction Item
        </h2>
        <form className="space-y-4" onSubmit={handleCreateAuction}>
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
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {loading ? (
            <div>Loading...</div>
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
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <Button className="w-full" type="submit">
            Create Auction Item
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
