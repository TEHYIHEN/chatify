# Project Name: [Chatify]
- ### Chatify is a full-stack, real-time messaging application designed for high-performance communication. Beyond basic messaging, it integrates advanced **Security Shielding** and **Cloud Media Management**, making it a robust template for **enterprise internal communication tools**.

## 🛠 Tech Stack
  **Frontend:**
- Core: React 19 (Latest) + Vite (Next-generation bundling)
- State Management: Zustand (Lightweight and faster than Redux)
- Real-time: Socket.io-client
- Styling: Tailwind CSS + DaisyUI + Lucide Icons
- Notifications: React Hot Toast
  
  **Backend:**
- Server: Express 5.1 (Latest)
- Database: MongoDB via Mongoose
- Security: - Arcjet: Shielding the app against bots and common attacks.
- Bcryptjs: Secure password hashing.
- JWT: Token-based authentication.
- Media: Cloudinary SDK (Image/File uploads)
- Communication: Socket.io (WebSockets) + Resend/Nodemailer (Email notifications)
  
 **Tools:**  
 -Git  
 -Postman

## ✨ Key Features
- **Real-time Messaging:** Low-latency communication via WebSockets.
- **User Auth:** Secure login/signup using JWT.
- **Responsive Design:** Optimized for all screen sizes (Mobile, Tablet, Desktop).
- **Advanced Security (Arcjet Integration):** Implemented rate limiting and bot protection to ensure API stability.
- **Media Cloud Integration:** Seamlessly integrated with Cloudinary for profile picture and media attachment management.

## 🧠 Challenges & Learnings
- **Challenge:** Handling state synchronization when multiple users are typing simultaneously.
- **Solution:** Implemented a robust state management flow and utilized Socket.io's broadcasting features to minimize server load.
- **Learning:** Deepened understanding of asynchronous JavaScript and event-driven architecture.

## 🔧 Installation & Setup
1.Clone the Repo  
-put the command line below:  
git clone https://github.com/TEHYIHEN/chatify.git  
cd chatify

2.Backend Configuration  
-Create .env in the Backend folder:  

PORT=5001  
MONGODB_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
CLOUDINARY_CLOUD_NAME=...  
ARCJET_KEY=...  
RESEND_API_KEY=...  
RESEND_SMTP_USERNAME=...  
RESEND_SMTP_PASSWORD=...  

3.Install & Run (Root Folder)  
-put the command line below:  
npm run build  # Installs both Backend & Frontend dependencies  
npm start      # Starts the production server
