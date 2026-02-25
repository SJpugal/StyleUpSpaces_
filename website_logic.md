# StyleUpSpaces Website Logic Analysis

### 1. Core Framework & Routing
- **React & Vite**: The project is a single-page application (SPA) built with React and bundled using Vite.
- **Routing (`App.jsx`)**: Navigation is handled by `react-router-dom`. It defines all the paths for the website, such as `/` for Home, `/login`, `/admin`, and specific service pages (e.g., `/electrician-services`, `/plumbing-services`). 
- **Global Components**: Components like the `Chatbot` are placed outside the individual routes in `App.jsx` so they persist across every page.

### 2. Global State Management (`ServicesContext.jsx`)
Instead of passing props down manually, the app uses React's **Context API** (`ServicesContext`) to manage global state. It handles:
- **Service Data**: Pricing and details for various categories (cleaning, electrician, interior, painting, packers).
- **Gallery Data**: Images for the Interior Gallery.
- **Authentication State**: Tracks the `currentUser` and whether the authentication modal (`isAuthModalOpen`) is visible.

### 3. Data Persistence (Local Storage)
The app doesn't currently rely on an external backend database for its core display logic. Instead, it uses the browser's **localStorage**:
- When the app loads, `ServicesContext` checks `localStorage` for existing service data, gallery images, and user sessions.
- If no data is found, it "seeds" the storage with default fallback data.
- Any updates made (like an admin changing a price) are saved back to `localStorage` so they persist even if you refresh the page.

### 4. Admin Functionality
The website includes an Admin Portal (`/admin-login` and `/admin`). 
- Authorized users can use functions like `updateServiceCategory` and `updateInteriorGallery` provided by the Context to modify prices, services, or gallery images.
- These changes instantly reflect across the website for all users on that browser instance.

### 5. Styling and UI
- **CSS**: The project uses Vanilla CSS (e.g., `index.css`, `HomeService.css`) rather than a utility framework like Tailwind.
- **Icons**: Uses `lucide-react` for all the SVG icons (like Home, Paintbrush, Truck, etc.) across the service listings.

In summary, it's a fully functional React frontend where the "backend" logic (data storage and price updates) is currently mocked and stored inside the browser's Local Storage for immediate, responsive performance.
