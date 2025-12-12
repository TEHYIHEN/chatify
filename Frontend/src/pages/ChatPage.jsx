import React from 'react'
import { useChatStore } from '@/store/useChatStore.js';

import BorderAnimatedContainer from '@/components/BorderAnimatedContainer.jsx';
import ProfileHeader from '@/components/ProfileHeader';
import ActiveTabSwitch from '@/components/ActiveTabSwitch';
import ChatsList from '@/components/ChatsList';
import ContactList from '@/components/ContactList';
import NoConversationPlaceholder from '@/components/NoConversationPlaceholder';
import ChatContainer from '@/components/ChatContainer';


const ChatPage = () => {

    const { activeTab, selectedUser, setSelectedUser } = useChatStore();

    return (
        <div className="relative w-full max-w-6xl h-screen lg:h-[800px]">

            <BorderAnimatedContainer>

                {/* LEFT SIDEBAR — MOBILE: show only when NO chat selected */}
                <div className={`
                    bg-slate-800/50 backdrop-blur-sm flex flex-col
                    w-full lg:w-80
                    ${selectedUser ? "hidden lg:flex" : "flex"}
                `}>
                    <ProfileHeader />
                    <ActiveTabSwitch />

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {activeTab === "chats" ? <ChatsList /> : <ContactList />}
                    </div>
                </div>

                {/* RIGHT CHAT AREA — MOBILE: full screen when chat selected */}
                <div className={`
                    flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm
                    ${selectedUser ? "flex" : "hidden lg:flex"}
                `}>
                    
                    {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
                </div>

            </BorderAnimatedContainer>

        </div>
    );
};

export default ChatPage;
