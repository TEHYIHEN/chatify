import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js"
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : window.location.origin; //"/" change to window.location.origin

export const useAuthStore = create((set, get) => ({

    /*----------------------------------------------------
    //For testing zustand
    authUser:{name:"john", _id:123, age:25},
    isLoggedIn:false,
    isLoading:false,

    login: () => {

        console.log("We just logged in");
        set({isLoggedIn:true, isLoading:true});

    },
    ---------------------------------------------------------*/

    authUser: null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    socket:null,
    onlineUsers:[],

    checkAuth: async () => {

        try {

            const res = await axiosInstance.get("/auth/check", {withCredentials: true,}); //no need the http:/localhost/xxxxxxx , because the axios.js have it
            set({authUser:res.data});
            get().connectSocket();
            
        } catch (error) {
            
             if (error.response?.status !== 401) {
            console.error("Error in authCheck:", error);
        }
            set({authUser:null});

        } finally {

            set({isCheckingAuth: false});

        }
        
    },

    //a example axios vs fetch
    /*try {
         const res = await fetch("/auth/signup", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data)
     });

        // Check if the response is OK (status 200–299)
        if (!res.ok) {
        // Convert response to JSON to get error message
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
    }

        const result = await res.json();
        console.log("Signup successful:", result);
  
        // You can do further actions, e.g., update state, show toast
    } catch (error) {
        console.error("Signup failed:", error.message);
        // Show toast or handle error in UI
    }*/
    signup: async (data) => {

        set({isSigningUp:true});

        try {
            
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});

            toast.success("Account created successfully");
            get().connectSocket();

        } catch (error) {

            toast.error(error.response.data.message);
            
        } finally{

            set({isSigningUp:false});
        }
        
    },

    login: async (data) => {

        set({isLoggingIn:true});

        try {
            
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});

            toast.success("Logged in successfully");

            get().connectSocket();

        } catch (error) {

            toast.error(error.response.data.message);
            
        } finally{

            set({isLoggingIn:false});
        }
        
    },

    logout: async () => {
        
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out");
            console.error("Logout error: ", error);
        }

    },

    updateProfile: async (data) => {
        
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error in update profile", error);
            toast.error(error.response.data.message);
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {

                withCredentials:true, //this ensure cookies are sent with the connection

            });

        socket.connect();

        set({socket});

        //listen for online users event
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers:userIds});
        })

        

    },

    disconnectSocket: () => {
            if(get().socket?.connected){
            get().socket.disconnect();
        }
    },

}));

