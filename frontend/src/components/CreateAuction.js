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

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const conditions = [
    { label: "NEW", value: 0 },
    { label: "USED", value: 1 },
    { label: "REFURBISHED", value: 2 },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (categories.length === 0) {
          const token = localStorage.getItem("token");
          if (!token) {
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
          if (response.data.data) {
            const categoryNames = response.data.data.map((c) => c.name);
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

  const handleCreateAuction = async (e) => {
    console.log(name, condition, description, isActive, price, category);
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/auction`,
        {
          //   name: name,
          //   condition: condition,
          //   Description: description,
          //   IsActive: isActive,
          //   price: 25000,
          //   CategoryName: category,
          name: name,
          condition: Number(condition),
          Description: description,
          IsActive: isActive,
          price: Number(price),
          CategoryName: category,
          ImageUrl: imageUrl,
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

  const handleConditionSelect = (e) => {
    console.log(e);
    setCondition(e);
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
              value={condition}
              onValueChange={(e) => handleConditionSelect(e)}
              id="condition"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((c) => (
                  <SelectItem key={c.label} value={c.value}>
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
            <Input id="image" type="file" />
          </div>
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
              <Select id="category">
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

          <Button className="w-full" type="submit">
            Create Auction Item
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;
