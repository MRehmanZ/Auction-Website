import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "sonner";


const Admin = () => {
    const [users, setUsers] = useState([]);
    
    const token = localStorage.getItem("token");
    
useEffect(() => {
    const fetchUsers = async () => {

      if (token == null) {
        return
      }


          
      try {
        
        const response = await axios.get(
          `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (response.data.data.$values) {
          setUsers(response.data.data.$values);
          }
          console.log(users)
        
      } catch (error) {
        console.error("No users found:", error);
        toast.error("There is something wrong. Please refresh the page.");
      } 
    };

    fetchUsers();
  }, []);

}

// retrieve all users
// view, amend and delete users
// one email assigned to admin


export default Admin;