# Hotel Booking App

The Hotel Booking System is a web application designed to facilitate hotel reservations and user reviews. It provides a platform for both hotel owners and customers.

## Main features

- Hotel Search and View: Easily find and look at all available hotels.
- Hotel Details Page: Get detailed information about each hotel, including descriptions, services, and images.
- Owner Login and Registration: Hotel owners can create accounts, login, and manage their hotels. They can add, update, and delete hotel information and images.
- User Login and Registration: Users can create accounts, login, view hotel options, and make reservations. They can also edit or cancel their reservations.
- Reservation Confirmation: Users receive an email with reservation details and a unique PIN after making a reservation.
- Verified User Comments: Users can leave comments on hotels they have reserved by entering their reservation number and PIN for verification. Comments can be created, edited, and deleted.
- Reservation Management by Owners: Hotel owners can view all reservations for their hotels and have the ability to decline reservations if needed.
- User Reservation View: Users can view all their reservations in one place.
- Profile Management: Both users and owners can update their personal information and change their passwords.

## Technologies

- Backend: Express
- Database: MySQL
- Frontend: React
- DevOps: Docker
- Other: NodeJS, JWT, Resend for email services, bcrypt for password and PIN encryption, zod for input validations, and cloudinary for images management

## Prerequisites

- Node.js
- MySQL
- Docker
- Cloudinary

## Installation

```
git clone https://github.com/Gonza0922/NodeJS-React-Hotel-Booking
cd NodeJS-React-Hotel-Booking
npm install
npm run start
```

## Installation with docker-compose

```
git clone https://github.com/Gonza0922/NodeJS-React-Hotel-Booking
cd NodeJS-React-Hotel-Booking
docker compose up
```

## Environment Variables

### Backend

- Open BackEnd folder

  ```
  cd BackEnd
  ```

- Copy the ".env.example" file to ".env"

  ```
  cp .env.example .env
  ```

- Finally open the ".env" file and set the required variables.

### Frontend

- Open FrontEnd folder

  ```
  cd FrontEnd
  ```

- Copy the ".env.example" file to ".env"

  ```
  cp .env.example .env
  ```

- Finally open the ".env" file and set the required variables. (variables should start with "VITE")
