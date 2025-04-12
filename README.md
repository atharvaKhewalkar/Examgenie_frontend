# Examgenie Frontend

Examgenie is a comprehensive web application designed to help teachers generate, manage, and archive exam papers efficiently. The frontend is built with React and provides an intuitive interface for question bank management and paper generation.

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Comprehensive overview of uploaded questions and generated papers
- **Question Bank Management**: Upload and categorize question banks
- **Paper Generation**: Create custom exam papers with various options
- **Archives**: View and manage previously generated papers
- **Settings**: Customize user preferences and defaults

## Tech Stack

- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- CSS for styling
- FontAwesome for icons

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/atharvaKhewalkar/Examgenie_frontend.git

2. Navigate to the project directory:
    ```bash
    cd Examgenie_frontend

3. Install dependencies:
    ```bash
    npm install

4. Start the development server:
    ```bash
    npm start

5. Open your browser and navigate to:
    ```bash
    http://localhost:3000

## Docker Setup

You can also run the application using Docker:

1. Build the Docker image:
    ```bash
    docker build -t examgenie-frontend .

2. Run the Docker container:
    ```bash
    docker run -p 3000:3000 examgenie-frontend

3. Access the application at:
    ```bash
    http://localhost:3000
