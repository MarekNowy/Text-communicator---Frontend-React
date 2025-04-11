

# 📬 Communicator – Frontend

The frontend of the **text communicator** built with **React** and **TypeScript**, utilizing **WebSockets** for real-time communication and storing **JWT tokens** in **localStorage**. The app dynamically renders messages and the user list, displays notifications for new messages, and manages state using **React hooks**.

## 🚀 Features

- ✅ **JWT Authentication** – JWT tokens stored in **localStorage** for authentication
- 📡 **Real-time communication** – Communication with the backend via WebSockets
- 📝 **Message rendering** – Dynamically rendering messages
- 👥 **User list** – Displaying the list of users
- 🔔 **Real-time notifications** – Notifications for new messages
- 🖋️ **Fontello** – Using icons from Fontello for the interface
- ⚛️ **React hooks** – Utilizing `useState`, `useEffect`, `useRef` for state management
- 📦 **TypeScript** – Full support for static typing
- 🏃 Project runs with `npm run dev`

---

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/MarekNowy/Text-Comunicator---Frontend.git
cd Text-Comunicator---Frontend

# 2. Install dependencies
npm install

# 3. Run the project
npm run dev
```

The application will be available in your browser on the default port.

---

## 🛠️ LocalStorage and JWT Tokens

JWT tokens are stored in **localStorage** to maintain the user session:

- **Login/Registration**: After a successful login, the JWT token is saved in **localStorage**.
- **Token retrieval**: For every request to the backend, the token is retrieved from **localStorage** and attached to the HTTP headers for authentication.
  
The token can be removed from **localStorage** when the user logs out.

---

## ⚛️ React Hooks

The project fully utilizes **React hooks** for managing state and effects in the app:

- `useState`: To manage the state of messages, users, and notifications.
- `useEffect`: To listen for events (e.g., new messages) and perform actions when state changes.
- `useRef`: To store references to DOM elements, e.g., for scrolling the message list.

---

## 🧩 WebSocket Communication

The application uses **Socket.IO** for real-time communication with the backend. This allows messages and notifications to be displayed in real-time, without the need to refresh the page.

---

## 🖋️ Fontello Icons

The application interface uses icons from **Fontello**. Icons are utilized in various parts of the app, such as buttons, notifications, and other UI elements.

---

## 📚 Future Enhancements

- 🎥 **Video chat support**
- 💬 **Group chat support**
- 🖼️ **Image and media sharing**
- 🗑️ **Message deletion functionality**

---

## 🏃 Running the Application

To start the application in development mode:

```bash
npm run dev
```

The app will be available on the default port
