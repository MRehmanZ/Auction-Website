import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/account/register`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        if (response.data) {
          toast.success(response.data);
        } else {
          toast.success(
            "Registration is successful. Verification link is send to your email."
          );
        }
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      if (error) {
        toast.error(error.response.data.$values[0].description);
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
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "text-muted-foreground",
              })}
              to="/login"
            >
              Already have an account?
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button>Register</Button>
              </div>
            </form>
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
