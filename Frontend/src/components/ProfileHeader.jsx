import { useState, useRef, useEffect } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore.js";
import { useChatStore } from "@/store/useChatStore.js";


const mouseClickSound = new Audio("/sounds/mouse-click.mp3");
//Lazily create on client to avoid SSR breakage
let canUseAudio = typeof Audio !== "undefined";

const ProfileHeader = () => {

  const {logout, authUser, updateProfile} = useAuthStore();
  const {isSoundEnabled, toggleSound} = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    if(canUseAudio) {
      //clickSoundRef.current = new Audio("/sounds/mouse-click.mp3");
      clickSoundRef.current = mouseClickSound;
    }
  })

  {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
  {/*Important code to understand*/}
  const handleImageUpload = (e) => {

      const file = e.target.files[0];
      if(!file) return;

      //added in CodeRabbit
      if (!file.type.startsWith("image/")) {
        console.error("Please select an image file.");
        return;
      }

      const reader = new FileReader();
      

      reader.onloadend = async () => {
        try {
          const base64Image = reader.result;
          setSelectedImg(base64Image);
          await updateProfile({ profilePic: base64Image });
        } catch (err) {
          console.error("Failed to update profile:", err);
        }
};
      reader.readAsDataURL(file);
  };
  {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex item-center justify-between">
      <div className="flex items-center gap-3">
        {/*AVATAR */}
        <div className="avatar online">
          <button className="size-14 rounder-full overflow-hidden relative group"
                  onClick={() => fileInputRef.current.click()}>
              
              <img src={selectedImg || authUser.profilePic || "/avatar.png"} 
                   alt="User image" className="size-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 
                              group-hover:opacity-100 flex items-center justify-center
                              transition-opacity">
                    
                  <span className="text-white text-xs">Change</span>
              </div>
          </button>
          <input type="file" accept="image/*" className="hidden" 
                 ref={fileInputRef} onChange={handleImageUpload} />
        </div>

        {/*USERNAME & ONLINE TEXT*/}
        <div>
          <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
            {authUser.fullName}
          </h3>

          <p className="text-slate-400 text-xs">Online</p>
        </div>
      </div>

          {/* BUTTONS*/}
          <div className="flex gap-4 items-center">
            {/* LOGOUT Button */}
            <button className="text-slate-400 hover:text-slate-200 
                              transition-colors" onClick={logout}>
                  
                <LogOutIcon className="size-5" />                

            </button>

            {/* Sound toggle btn */}
            <button className="text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => {
                    //play clock sound before toggling
                    mouseClickSound.currentTime=0 ; //reset to start
                    mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
                    toggleSound();
                    }}
            >
              {isSoundEnabled ? (
                <Volume2Icon className="size-5" />
              ) : (
                <VolumeOffIcon className="size-5"/>
              )}

            </button>
          </div>
      </div>
    </div>
  )
}

export default ProfileHeader
