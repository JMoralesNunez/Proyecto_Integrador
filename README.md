# Restaurant Management System — Reservations and Delivery

## Project Overview

This comprehensive web-based system is designed to streamline restaurant operations by providing an integrated solution for managing table reservations and delivery orders. The system addresses common challenges faced by restaurants that rely on traditional methods such as phone calls and social media for order management.

### Problem Statement

Many restaurants struggle with:
- Confusion and conflicts in reservation scheduling
- Loss of important order information during busy periods
- Delays in customer service response
- Difficulty tracking restaurant occupancy and delivery sales
- Inefficient communication between customers and restaurant staff
- Manual processes that lead to human error and operational inefficiencies

### Solution

Our system provides a digital transformation through three integrated components:

1. **Customer-Facing Chatbot**: Enables users to make reservations, browse menus, place delivery orders, and request information through natural conversation
2. **Administrative Dashboard**: Provides restaurant staff with comprehensive tools to manage all operations from a centralized interface
3. **Backend API with Database**: Ensures data integrity, security, and seamless communication between all system components

## Accessing the Project Repository

For users new to GitHub, follow these step-by-step instructions:

1. Navigate to GitHub's website: [https://github.com](https://github.com)
2. Access our project repository directly at:
   ```
   https://github.com/JMoralesNunez/Proyecto_Integrador
   ```
3. Once on the repository page, you have several options:
   - **Browse the code**: Explore files and folders directly in your browser
   - **Download ZIP**: Click the green "Code" button and select "Download ZIP" for a complete copy
   - **Clone with Git**: If you have Git installed, use:
     ```bash
     git clone https://github.com/JMoralesNunez/Proyecto_Integrador.git
     ```

## User Stories and Acceptance Criteria

### Customer Features (Chatbot)

#### Table Reservation

**User Story**: As a customer, I want to reserve a table for a specific date, time, and number of people to ensure a place at the restaurant.

**Acceptance Criteria**:
- The chatbot must guide me through the conversation, asking for date, time, and number of people
- Must confirm the reservation if there is availability
- If there is no availability, must offer other nearby dates or times
- Must ask for my name and phone number to contact me if necessary
- Upon completion, must send me a confirmation message with reservation details
- I must be able to cancel the reservation if needed

#### Menu Consultation

**User Story**: As a customer, I want to consult the menu to see what the restaurant offers and decide what to order.

**Acceptance Criteria**:
- The chatbot must show me the current menu clearly (dish name, description, price)
- I must be able to navigate through menu categories (e.g., "Appetizers", "Main Courses", "Desserts")

#### Delivery Order Placement

**User Story**: As a customer, I want to place a delivery order from the menu to receive my food at home.

**Acceptance Criteria**:
- The chatbot must allow me to add and remove products from the shopping cart
- Must show me the subtotal
- Must ask for my delivery address, name, and contact number
- Upon completion, must give me an order number and confirmation

#### Hours and Location Inquiry

**User Story**: As a customer, I want to consult the restaurant's hours and address to know when I can visit.

**Acceptance Criteria**:
- The chatbot must respond to questions about operating hours
- Must provide the exact restaurant address and, optionally, a Google Maps link

#### Conversation and Order History

**User Story**: As a regular customer, I want the chatbot to remember my information (name, phone, address) and the context of my last interaction to streamline future reservations or orders.

**Acceptance Criteria**:
- If I am a returning customer, the chatbot must be able to confirm my name and phone number
- Must be able to respond "sure, you already have a reservation for next Friday at 8pm" if I ask

### Administrator Features (Dashboard)

#### Reservation Management

**User Story**: As an administrator, I want a dashboard where I can view, create, and edit reservations to have complete control over restaurant occupancy.

**Acceptance Criteria**:
- I must be able to see a list of all reservations for a specific day
- I must be able to create a manual reservation for customers who call by phone
- I must be able to edit or cancel an existing reservation
- The dashboard must show if a reservation was made by the chatbot or manually

#### Delivery Order Management

**User Story**: As an administrator, I want to see and manage delivery orders to coordinate kitchen and delivery operations.

**Acceptance Criteria**:
- I must see a real-time list of orders
- I must be able to update order status (e.g., "In preparation", "On the way", "Delivered")
- The dashboard must show order details: dishes, delivery address, total cost

#### Receipt Printing

**User Story**: As an administrator, I want to generate and print order receipts to provide proper documentation for completed orders.

**Acceptance Criteria**:
- I must be able to generate a formatted receipt for any completed order
- The receipt must include order details, customer information, itemized list, and total
- The system must attempt to print to a POS printer if available
- If no printer is available, the system must save the receipt as a text file for later printing

#### Report Generation

**User Story**: As an administrator, I want to obtain sales reports and chatbot activity to make business decisions.

**Acceptance Criteria**:
- I must be able to see a daily report of reservations and orders
- The dashboard must show which are the best-selling dishes

#### Menu and Promotion Management

**User Story**: As an administrator, I want to update the menu to keep the chatbot information current.

**Acceptance Criteria**:
- I must be able to add, edit, or delete menu items
- Changes must be reflected in the chatbot immediately

## Objectives

### General Objective
Implement an integrated restaurant management system that optimizes reservation and delivery order processes, enhancing customer experience while improving internal operational efficiency.

### Specific Objectives
- Provide customers with an accessible, user-friendly interface for reservations and orders
- Deploy an intelligent conversational assistant for common inquiries about schedules, menus, and promotions
- Ensure accurate data recording without duplication or information loss
- Equip restaurant staff with comprehensive management tools for reservations and orders
- Establish reliable communication channels between restaurants and customers
- Generate actionable insights through reporting and analytics

## Key Features

### Customer Interface (Chatbot)
- **Reservation Management**: Guided reservation process with real-time availability, confirmation, and cancellation capabilities
- **Menu Integration**: Dynamic menu browsing with category organization
- **Delivery Orders**: Complete order management including cart functionality and subtotal calculations
- **Information Access**: Quick access to restaurant hours, location details, and Google Maps integration
- **Personalization**: Customer recognition system for returning users with stored preferences

### Administrative Interface (Dashboard)
- **Reservation Control**: Complete CRUD operations for reservation management
- **Order Tracking**: Real-time delivery order monitoring with status updates
- **Receipt Printing**: Automated POS receipt generation for completed orders
- **Analytics and Reporting**: Comprehensive sales reports and popular item analysis
- **Menu Management**: Dynamic menu updates with instant synchronization to customer interface

## System Architecture

The system follows a modern three-tier architecture:

**Presentation Layer**
- Frontend Dashboard built with React framework
- Deployed on GitHub Pages for reliable public access

**Application Layer**
- Backend API developed with Node.js and Express
- RESTful architecture for scalable communication
- Deployed on Vercel for optimal performance

**Data Layer**
- Relational database system with normalized structure
- Entities include customers, reservations, orders, menu items, and promotions
- Designed following Entity-Relationship modeling principles

## Technology Stack

### Frontend Technologies
- **React**: Modern JavaScript framework for building responsive user interfaces
- **Deployment**: GitHub Pages for static site hosting

### Backend Technologies
- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web application framework for RESTful API development
- **ESC/POS**: Receipt printing library for POS printer integration
- **Deployment**: Vercel for serverless backend hosting

### Database Technologies
- **Relational Database**: Structured data storage following normalization principles
- **Entity-Relationship Model**: Comprehensive data modeling for restaurant operations

### Development Tools
- **Package Management**: npm for dependency management
- **Version Control**: Git and GitHub for source code management and collaboration

## Local Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm package manager
- Git (optional, for cloning)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=restaurant_db
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Live Deployment

The system is deployed and accessible online:

- **Backend API**: https://proyecto-integrador-backend.vercel.app
- **Frontend Dashboard**: https://jmoralesnunez.github.io/Proyecto_Integrador_Frontend/

These deployments allow immediate access to the system without local installation requirements.

## Database Structure

The project includes a comprehensive Entity-Relationship Diagram (MER.png) illustrating the database structure. Key entities include:

- **Customers**: User information and contact details
- **Reservations**: Table booking data with time and guest information
- **Orders**: Delivery order details with items and payment information
- **Menu Items**: Restaurant menu with categories, descriptions, and pricing
- **Promotions**: Marketing campaigns and special offers

## Project Team

This integrated project was developed by:

- **Jhonatan Morales** - Project Lead
- **Angelica Cuervo** - Developer
- **Miguel Arias** - Developer  
- **Omar Uribe** - Developer
- **Jhon Rojas** - Developer

## License

This project is developed as an academic integrative project and is available for educational and reference purposes.