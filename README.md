
# Running Locally

To run the example locally, you will require Docker. Please see this guide for Docker installation instructions. Once Docker is installed and running, from the root of the project run:

```
docker compose -f docker-compose.dev.yaml up # Bring up docker env
```

After that, please open http://localhost:3000/ and login with metamask. A button will appear. Click that button to authenticate yourself with your Github account. Once you authenticate, relevant public information will be collected from Github about you and will be stored in composedb. The information that was gathered will appear in the page. Next time you visit http://localhost:3002/ and authenticate with metamask, the page will fetch previously collected information about the user and display on the page.

Click on `Add your fiverr ratings` to go to the fiverr page. Then click `Get a token` button to get a token. Then, copy the token and paste the token in your fiverr description. Your fiverr ratings and related information will be collected from the page.

### Direct update from other platforms

Go to http://localhost:3000/cred/platform. Get an api key after entering a name of the platform. Use the API key to update user reviews. This API key should be used as `x-api-key` header.

# Conclusion

In this example we have demonstrated the steps involved in creating and fulfilling jobs on the HUMAN protocol. This is a very basic example which could easily be extended to other use case's. If you have any problems with the setup or usage of this example, please open an issue and let us know! Feel free to check out the HUMAN github repostory for other useful resources.

# Api Endpoints
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
