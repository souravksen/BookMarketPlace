# 📚 BookMarketplace

A premium, full-stack peer-to-peer (P2P) and B2C Book Marketplace platform. The application allows users to discover, buy, and sell new or used books, featuring a location-based book lookup system, direct seller-buyer chat, a comprehensive seller dashboard, and robust JWT-based secure authentication.

---

## 🌟 Key Features

*   **📍 Geolocalized Book Search ("Nearby Books"):**
    *   Find books sold by users near you to save on shipping costs.
    *   Integrates **Leaflet Map** (`react-leaflet`) with custom markers showing user and book locations.
    *   Filter books by distance radius (2 km, 5 km, 10 km, 20 km).
    *   Manual location search fallback for major Indian cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata).
*   **💬 Buyer-Seller Real-time Chat:**
    *   Instant mock messaging modal integrated into book listings for price negotiations, pickup coordination, or general queries.
*   **📊 Comprehensive Seller Dashboard:**
    *   Sellers can easily list books with price, category, condition, description, and images.
    *   Manage active book listings, inventory, and track sales metrics.
*   **🛒 Interactive Cart & Order Checkout System:**
    *   Add books to the shopping cart, track orders, and view order histories.
*   **🔐 Secure Authentication:**
    *   Role-based client access (Buyer/Seller) with Spring Security and JWT validation.
*   **🎨 Premium UI/UX Aesthetic:**
    *   Stunning modern dark-themed interface built using Tailwind CSS with glassmorphic cards, custom animations, and skeleton loading screens.

---

## 🛠️ Tech Stack

### Frontend
*   **Core:** React.js (with Vite + TypeScript/JavaScript)
*   **Styling:** Tailwind CSS (Custom dark theme configuration, glassmorphism, responsive grid)
*   **Mapping:** Leaflet & React Leaflet (OpenStreetMap integration)
*   **State & Routing:** React Router DOM, React Context API (Auth, Location, Cart)
*   **Validation & Forms:** React Hook Form + Zod
*   **Icons & Notifications:** Lucide React, React Hot Toast
*   **HTTP Client:** Axios

### Backend
*   **Framework:** Spring Boot 3.2.5 (Java 17)
*   **Security:** Spring Security + JSON Web Token (JWT)
*   **ORM & Database:** Spring Data JPA + MySQL Connector
*   **Utilities:** Lombok, Java Validation API

---

## 📁 Repository Structure

```text
BookMarketplace/
├── backend/                  # Spring Boot Backend Code
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bookmarketplace/
│   │   │   │   ├── config/      # CORS & Security Config
│   │   │   │   ├── controller/  # Auth, Book, Cart, Order, Seller API Endpoints
│   │   │   │   ├── dto/         # Request & Response Data Transfer Objects
│   │   │   │   ├── entity/      # JPA Entity Models (User, Book, CartItem, Order, etc.)
│   │   │   │   ├── exception/   # Custom Global Exception Handling
│   │   │   │   ├── repository/  # Spring Data JPA Interfaces
│   │   │   │   ├── security/    # JWT Utils and Filters
│   │   │   │   └── service/     # Business Logic Implementations
│   │   │   └── resources/
│   │   │       └── application.properties # Server, DB & JWT Configurations
│   │   └── test/
│   ├── pom.xml               # Maven Dependency Configuration
│   └── start.cmd             # Quick Launch script for backend
│
├── src/                      # React Frontend Source Code
│   ├── assets/               # Stylesheets and media assets
│   ├── components/           # Reusable components (ui, layout, books, chat)
│   ├── context/              # Context Providers (Auth, Cart, Location)
│   ├── pages/                # Page components (Home, BookDetails, NearbyBooks, SellerDashboard, etc.)
│   ├── services/             # Axios API client services
│   ├── utils/                # Mock data, constants, helpers, and geo-calculation utilities
│   ├── App.jsx               # App routing configuration
│   ├── main.jsx              # React mounting entrypoint
│   └── index.css             # Main Tailwind directives & global classes
│
├── package.json              # Frontend Node dependencies & scripts
├── tailwind.config.js        # Tailwind CSS customizations (colors, fonts, animations)
├── tsconfig.json             # TypeScript configuration
└── start-frontend.cmd        # Quick Launch script for frontend
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (v16.0 or higher)
*   [Java Development Kit (JDK 17)](https://www.oracle.com/java/technologies/downloads/)
*   [Apache Maven](https://maven.apache.org/) (or use the included wrapper `./mvnw`)
*   [MySQL Database Server](https://dev.mysql.com/downloads/installer/)

---

### 1. Database Setup
1.  Start your local MySQL server.
2.  The application will automatically create the database `bookmarketplace` on start if it doesn't exist, but you can also create it manually:
    ```sql
    CREATE DATABASE bookmarketplace;
    ```
3.  Configure your MySQL credentials in `backend/src/main/resources/application.properties`:
    ```properties
    spring.datasource.username=YOUR_MYSQL_USERNAME
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    ```

---

### 2. Run the Backend
You can start the Spring Boot server using the provided `start.cmd` script, or run:
```bash
cd backend
mvn spring-boot:run
```
The backend API server will start at **`http://localhost:8084`**.

---

### 3. Run the Frontend
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    Alternatively, use the `start-frontend.cmd` batch file.
3.  Open your browser and navigate to **`http://localhost:5173`** (or the port shown in your terminal).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/book-marketplace/issues).

---

## 📝 License
This project is licensed under the [MIT License](LICENSE).
