# Trivia Quest

Welcome to Trivia Quest, an engaging full-stack application that brings the thrill of trivia games to your fingertips. Whether you're a seasoned trivia enthusiast or a casual player, Trivia Quest offers a captivating experience, allowing users to test their knowledge, earn points, and compete with friends.

## Technologies & Frameworks

- **Backend:** Go (Gin framework)
- **Frontend:** Nuxt.js (Vuetify for UI)
- **Database:** MySQL
- **State Management:** Pinia
- **Styling:** Sass
- **Security:** JWT for token creation, Bcrypt for encryption/decryption
- **Environment Variables:** godotenv

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sajjadth/trivia-quest
   ```

2. **Backend Setup:**

   - Navigate to the backend folder.
   - Install dependencies:
     ```bash
     go mod download
     ```
   - Set up your .env file with necessary configurations.

     ```bash
     # Database Configuration
     DATABASE_USERNAME=
     DATABASE_PASSWORD=
     DATABASE_HOST=
     DATABASE_PORT=
     DATABASE_NAME=

     # Application Configuration
     APP_PORT=

     # JWT Configuration
     JWT_SECRET=

     # Encryption/Decryption Configuration (e.g., for bcrypt)
     ENCRYPTION_SECRET=

     # Email Configuration (Using Elastic Email)
     EMAIL_API_KEY=
     EMAIL_SENDER=

     # Frontend Configuration
     FRONTEND_ADDRESS=
     ```

3. Frontend Setup:
   - Navigate to the frontend folder.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Set up your .env file with necessary configurations:
     ```bash
     # Backend API Base URL
     APP_API_BASE_URL=
     ```
4. Run the Application:
   - Start the backend server:
     ```bash
     cd backend
     go run cmd/main.go
     ```
   - Start the frontend application:
     ```bash
     cd frontend
     npm run dev
     ```
5. Open your browser and go to http://localhost:3000 to access the application.

## External API

Trivia Quest uses the [Open Trivia Database](https://opentdb.com/) to fetch trivia questions.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
