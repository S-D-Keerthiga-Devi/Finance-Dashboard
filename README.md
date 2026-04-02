# Zorvyn Finance Dashboard

🚀 **Live Demo:** [View Zorvyn Dashboard](https://zorvyn-assignment-finance-dashboard.vercel.app/)

![Zorvyn Dashboard Screenshot](https://api.microlink.io/?url=https://zorvyn-assignment-finance-dashboard.vercel.app/&screenshot=true&embed=screenshot.url)

A stunning, production-ready Finance Dashboard built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Fully mobile-responsive layout with a custom sidebar/navbar.
- **Dark Mode**: Integrated dark mode toggle that persists state.
- **Role-Based Access Control (RBAC)**: Simulated roles ('Viewer' and 'Admin'). Admins can Add, Edit, and Delete transactions, while Viewers have read-only access.
- **Data Visualizations**: Beautiful, animated Recharts (AreaChart and DonutChart) mapping real-time derived state.
- **Global State Management**: Powered by Zustand with local storage persistence. Refreshing the page keeps your transactions, theme, and role intact!
- **Dynamic Insights**: AI-style calculated insights including Month-over-Month (MoM) comparisons and Lifetime Income/Expense ratios.

## Technology Stack & Architectural Decisions

- **Vite & React 18**: Chosen for lightning-fast HMR and optimized production builds.
- **TypeScript**: Ensures type safety across the application, especially for predictable state management in our Store.
- **Tailwind CSS (v3)**: Used for rapid UI development utilizing modern utility classes, arbitrary values, and a clean customized color palette.
- **Zustand**: Selected over Context or Redux for its exceptionally lightweight, boilerplate-free global state management with out-of-the-box local storage `persist` middleware.
- **Recharts**: Provides declarative, responsive, and animated SVG charts that integrate flawlessly into React.
- **Lucide React**: Crisp, modern, and highly customizable SVG icons.
- **Date-Fns**: Used for lightweight, reliable date parsing and relative comparisons (e.g. `isThisMonth`, `isLastMonth`).

## How to Run the Project

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

---
*Created as part of the frontend assignment. Enjoy the premium aesthetics and dynamic functionality!*
