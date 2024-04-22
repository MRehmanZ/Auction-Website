import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (email && password) {
        const response = await axios.post(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/account/login`,
          {
            email,
            password,
          }
        );
        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("token", token); // Store token in localStorage
          onLogin();
          toast.success("Signed in successfully");

          navigate("/");
        } else {
          toast.warning("There is something wrong. Please try again.");
        }
      }
    } catch (err) {
      if (err) {
        toast.error(err.response.data);
      } else {
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "text-muted-foreground",
              })}
              to="/register"
            >
              Don&apos;t have an account? <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleLogin}>
              {error && <p className="text-sm text-red-500 ">{error}</p>}
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button>Sign In</Button>
              </div>
            </form>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <span className="w-full border-t" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
