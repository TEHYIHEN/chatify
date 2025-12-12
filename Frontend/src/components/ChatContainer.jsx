import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore'; 
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessagesInput from './MessagesInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

const ChatContainer = () => {

  const {selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessage, unsubscribeFromMessage} = useChatStore();
  const {authUser} = useAuthStore();
  const bottomRef = useRef(null); // New code for make sure the newest chat alway at bottom, no need to scroll down

  useEffect(() =>{
    if(!selectedUser?._id) return; // to prevent crash
    getMessagesByUserId(selectedUser._id);
    subscribeToMessage();

    //clean up
    return () => unsubscribeFromMessage();
  }, [selectedUser?._id, getMessagesByUserId, subscribeToMessage, unsubscribeFromMessage]);

  //Make sure the latest chat at btm
   useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
     <div className="h-full flex flex-col">
      <ChatHeader />
      {/*Main Scroll Area */}
      <div className='flex-1 px-3 mx:px-6 overflow-y-auto py-4 md:py-8'>
        {messages?.length > 0 && !isMessagesLoading ? (
          //Content
          <div className='max-w-full md:max-w-3xl mx-auto space-y-4 md:space-y-6'>
            {messages.map(msg => (
              <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                <div className={
                  `chat-bubble relative ${
                   msg.senderId === authUser._id
                   ? "bg-cyan-600 text-white"
                   : "bg-slate-700 text-slate-200"}`
                }>
                  {/* Image (responsive height)*/}
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className='rounded-lg h-40 md:h-48 object-cover'/>
                  )}
                  
                  {/* TEXT */}
                  {msg.text && <p className='mt-1 text-sm md:text-base'>{msg.text}</p>}

                  {/* TIME */}
                  <p className='text-[10px] md:text-xs mt-1 opacity-75 flex items-center gap-1'>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit",
                      //hour12: false 
                    })}
                  </p>
                </div>
              </div>
            ))}
              <div ref={bottomRef} /> {/*latest chat Alway stay at bottom */}
          </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> 
          :(<NoChatHistoryPlaceholder name={selectedUser?.fullName} />)}
      </div>
      <MessagesInput />
    </div>
  );
}

export default ChatContainer
