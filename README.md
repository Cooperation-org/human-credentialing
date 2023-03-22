
# Running Locally

To run the example locally, you will require Docker. Please see this guide for Docker installation instructions. Once Docker is installed and running, from the root of the project run:

If running on Arm uncomment the platform in docker-compose
```
credential-oracle:
    build:
      context: ./credential-oracle
    #platform: linux/amd64
    ports:
      - 3007:8080
```

```
docker-compose up // Bring up docker env
```

To deploy the contracts to the our Local Testnet, in a new window execute:


At this point we have a Local Testnet running with our contracts deployed to this testnet. The next step is to configure Metamask to work with our Local Testnet.


# Credentialing API

Before using the credentialling API, deploy the composite in composedb node by running this command from the [credential-oracle](/credential-oracle/) directory. This will make the composedb node to start indexing this composite.

```
yarn && yarn run deploy:composite
```

After that, please open http://localhost:3002/ and login with metamask. A button will appear. Click that button to authenticate yourself with your Github account. Once you authenticate, relevant public information will be collected from Github about you and will be stored in composedb. The information that was gathered will appear in the page. Next time you visit http://localhost:3002/ and authenticate with metamask, the page will fetch previously collected information about the user and display on the page.

Click on `Add your fiverr ratings` to go to the fiverr page. Then click `Get a token` button to get a token. Then, copy the token and paste the token in your fiverr description. Your fiverr ratings and related information will be collected from the page.

### Direct update from other platforms

Go to http://localhost:3002/cred/platform. Get an api key after entering a name of the platform. Use the API key to update user reviews. This API key should be used as `x-api-key` header.

# Additional info about [credential-oracle](/credential-oracle/) example and its scripts

It is important to have the composedb cli installed in the local machine to play with or change the schema. To install ceramic cli globally, run:

```
npm install --location=global @composedb/cli@^0.3.0
```

If the schema is changed, then the composedb model needs to be created again and new json for the composite needs to be created. Please be advised, when you create a new model, previously collected data under the previously generated model will not be associated with the new model. So, the previous records cannot be queried, unless of course, we are writing specific code for doing that. To create a new model run below command:

```
composedb composite:create data/github_user.schema -k 59e83c249b8947d1524a3f5f66326c78759c86d75573027e7bef571c3fddfb90 -c http://localhost:7007 -o github_user_composite.json
```

The value after the `-k` flag is a private key, that can be generated with the composedb cli but not important for development setup. Check this [link](https://composedb.js.org/docs/0.3.x/configuration#generating-a-did-private-key) to generate a new private key. Also, change the `DID_PRIVATE_KEY` environment variable in [docker-compose.yml](/docker-compose.yml) file under `credential-oracle`. It is possible to also generate a new did as admin dids for composedb. To generate a new `did` check this [link](https://composedb.js.org/docs/0.3.x/configuration#getting-the-did-value). Then change the environment variable called `ADMIN_DIDS` in [docker-compose.yml](/docker-compose.yml). It is possible to add multiple admin dids. Just add them as comma separated values like `ADMIN_DIDS=did:key:abd1231....vy,did:key:casldkfj12...asd`.

Then deploy the composite as mentioned in [previous section](#credentialling-api).

Then create the runtime definition by running below command in [credential-oracle](/credential-oracle/) direcotry.

```
npm run runtime:composite
```

It is also possible to run a graphiql server for development purposes, run below command in [credential-oracle](/credential-oracle/) directory.

```
npm run graphiql
```

# Troubleshooting

Error: The tx doesn't have the correct nonce or the transaction freezes.

Fix: If you experience errors such as this when submitting transactions, try resetting Metamask by clicking on the account icon (top right) then Settings > Advanced > Reset Account.

We also recommend that Windows WSL users try the Deployed Playground example as the Local example requires 'Host Mode' to be activated in the docker-compose.yml, which unfortunately is not available on Docker for Windows.

If you encounter any other issues when using the front end, please use the developer console 'Ctrl+Shift+I (Command+Option+I on Mac)' in Chrome/Firefox to diagnose errors when submitting transactions from the front-end.

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