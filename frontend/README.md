# Apparel Recycling Platform

A comprehensive platform for managing and promoting apparel recycling, allowing users to submit information about their unused or worn-out clothing for proper disposal, donation, or recycling.

## Features

- User registration and authentication
- Responsive design for mobile and desktop
- Dark/light mode toggle
- Submission form for apparel information with image upload
- Geolocation for nearest recycling centers
- QR code generation for item tracking
- Social sharing functionality
- Gamification elements (points, badges)
- Admin dashboard for managing submissions
- Email notifications
- Search and filter functionality for submissions

## Tech Stack

- Frontend: Next.js with TypeScript, Tailwind CSS
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- File Storage: AWS S3
- Email: SendGrid
- Maps: Google Maps API

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (v4 or later)
- AWS account (for S3)
- SendGrid account
- Google Maps API key

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/your-username/apparel-recycling-platform.git
   cd apparel-recycling-platform
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/apparel_recycling
   JWT_SECRET=your_jwt_secret_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   SENDGRID_API_KEY=your_sendgrid_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

5. Open a new terminal window and set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

6. Create a `.env.local` file in the `frontend` directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

7. Start the frontend development server:
   ```
   npm run dev
   ```

8. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. Register a new user account or log in with existing credentials.
2. Use the submission form to enter information about unused or worn-out apparel, including images.
3. View the list of submitted items on the dashboard.
4. Use the map to find nearby recycling centers.
5. Share your recycling efforts on social media.
6. Earn points and badges for your contributions.
7. Admin users can access the admin panel to manage submissions.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)