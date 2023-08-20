# Human Credentialing
Welcome to our open-source project! This guide will help you set up the project locally and understand its functionalities.

## Prerequisites

Docker: This project requires Docker for local setup. If you haven't already installed Docker, you can refer to the official Docker installation guide.

## Local Setup

### Launch Docker Environment:

```
docker compose -f docker-compose.dev.yaml up // Bring up docker env
```
### Access the Web Interface:

   - Navigate to http://localhost:3000/.
   - Log in using Metamask.
   - Click the provided button to authenticate with your GitHub account.
   - Your public GitHub information will be fetched and stored in composedb. This data will be displayed on the page.
   - For subsequent visits to http://localhost:3002/, the page will automatically retrieve and display the stored information after Metamask       authentication.

### Integrate Fiverr Ratings:

   - Click on **Add your Fiverr ratings** to navigate to the Fiverr page.
   - Use the **Get a token** button to generate a token.
   - Copy the generated token and paste it in your Fiverr description to collect your Fiverr ratings and related information.

### Direct Updates from Other Platforms:

   - Visit [http://localhost:3000/cred/platform](http://localhost:3000/cred/platform).
   - Obtain an API key by specifying the platform's name.
   - This API key should be used as an `x-api-key` header when you want to update user reviews.

## API Endpoints
Here's a list of available API endpoints for the project:

```Json
{
   "Apis"{
   "git profile" : "http://localhost:3007/get-github-profile/{user_id (wallet adress)}",
   "fiverr profile" : "http://localhost:3007/fiverr-profile/{user_id (wallet adress)}",

   "all credentials" : "http://localhost:3007/workers/{user_id (wallet adress)}",
   "workers rating" :" http://localhost:3007/worker-rating/{platform key}/{user_id (wallet adress)}",
   "ratings above limit" : "http://localhost:3007/all-ratings-above/{platform key}/{rating}"
   }
}
```

## About

This project showcases the steps involved in creating and fulfilling jobs on the HUMAN protocol. While this is a fundamental demonstration, its applications can be extended to numerous use cases.

## Support & Contribution

Experiencing issues or have suggestions for improvements? Please [open an issue](https://github.com/Cooperation-org/human-credentialing/issues) and let us know. Your feedback is invaluable.

For more resources and related projects, visit our [HUMAN GitHub repository](https://github.com/Cooperation-org/human-credentialing).


