import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js"
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({

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

    checkAuth: async () => {

        try {

            const res = await axiosInstance.get("/auth/check", {withCredentials: true,}); //no need the http:/localhost/xxxxxxx , because the axios.js have it
            set({authUser:res.data});
            
        } catch (error) {
            
            console.error("Error in authCheck:", error);
            set({authUser:null});

        } finally {

            set({isCheckingAuth: false});

        }
        
    },

    signup: async (data) => {

        set({isSigningUp:true});

        try {
            
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});

            toast.success("Account created successfully");

        } catch (error) {

            toast.error(error.response.data.message);
            
        } finally{

            set({isSigningUp:false});
        }
        
    }

}));

