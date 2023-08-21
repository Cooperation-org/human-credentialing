# Human Credentialing
The purpose of the Human Credentialing project is just that - to credential humans, in a way that coincidentially can be used to apply for jobs on the [HUMAN Protocol](https://www.humanprotocol.org/).  Credentials can currently be imported from github or fiverr.  The importing server then signs a credential that the logged in wallet has earned the imported credential.

This is intended to be run on a trusted, known server in order for the credentials to be meaningful, but for development you may run it locally using docker.

The credentials are then written to the [Ceramic network](https://ceramic.network/) and may be used permissionlessly by any other Ceramic user, even if the credentials were written by a local docker instance.  Note, however, they are not guaranteed to be continuously available unless some Ceramic node is pinning them.

## Credential Input Interface

A very simple interface for inputting and signing credentials is publicly available at https://cred.linkedtrust.us/

## Credential Oracle API

When interacting with a running credential oracle, you may retrieve credentials for a given wallet address as follows

```
curl --location 'https://api.linkedtrust.us/worker-rating/d2138c17c8b987b3290931f40ac92932d62b6b944bb04e5a8ea48088189998c3/0xea3e503Ec7cc25718FB6E7ff7bc161c966489A70' \
--header 'platform: d2138c17c8b987b3290931f40ac92932d62b6b944bb04e5a8ea48088189998c3'
```

The response will be returned in a simple JSON blob as follows:

```
{
  "message": {
    "existingRating": {
      "rating": 1,
      "user_id": "0xea3e503Ec7cc25718FB6E7ff7bc161c966489A70",
      "user_name": "arbetamedsarthak",
      "platform_name": "github",
      "id": "kjzl6kcym7w8y98a0prwzxtywk13punw98nm8rji8d7t5hwkpaq3uc5bgvc0sy2"
    }
  }
}
```

## Local Development

### Prerequisites

Docker: This project requires Docker for local setup. If you haven't already installed Docker, you can refer to the official Docker installation guide at https://docs.docker.com/.

### Launch Docker Environment:

```
docker compose -f docker-compose.dev.yaml up # Bring up docker env
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

Here is the list of currently available API endpoints:

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

## Architecture

The conceptual architecture of the various components 
![image](https://github.com/Cooperation-org/human-credentialing/assets/798887/4ced4a91-1947-4fd6-a26a-66bdbb3bc9b4)


## About

This project demonstrates the capability of a Credential Oracle to associate existing credentials on the web with a wallet address, and to provide an API endpoint for the purposes of integrating with a HUMAN Protocol job matcher.

## Support & Contribution

Experiencing issues or have suggestions for improvements? Please [open an issue](https://github.com/Cooperation-org/human-credentialing/issues) and let us know. Your feedback is invaluable.

For more resources and related projects, visit our [HUMAN GitHub repository](https://github.com/Cooperation-org/human-credentialing).


