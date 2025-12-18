# Flex Living Assessment

This is a Next.js project designed for the Flex Living Assessment. It integrates with various external services including Supabase, Hostaway, Mockaroo, and Google Places.

## Getting Started

To get started with the project, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd flex-living-assessment
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:

    | Variable                | Description                             |
    | :---------------------- | :-------------------------------------- |
    | `HOSTAWAY_ACCOUNT_ID`   | Your Hostaway Account ID                |
    | `HOSTAWAY_API_KEY`      | Your Hostaway API Key                   |
    | `ACCESS_SECRET`         | Secret key for verifying manager access |
    | `SUPABASE_URL`          | Your Supabase project URL               |
    | `SUPABASE_ANON_KEY`     | Your Supabase anonymous key             |
    | `MOCKAROO_ENDPOINT`     | Endpoint for Mockaroo API               |
    | `MOCKAROO_KEY`          | API Key for Mockaroo                    |
    | `GOOGLE_PLACES_API_KEY` | API Key for Google Places               |

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
