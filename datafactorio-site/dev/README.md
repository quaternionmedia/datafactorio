# Graphbase - Local Development

Used, during developemnt, for a simple and light database and api service. 

Can either run the script for both database and api service, or run the commands for just the api service. 

## Run Script for Database and API

In a bash terminal, navigate to the 'datafactorio/datafactorio-site/dev' directory

Make script executable

`chmod +x graphbase.sh`

Run the script in a bash shell. 

`./graphbase.sh`
 
Go to the Swagger docs to see the available API

`http://localhost:8000/docs`

## Run Commands for API

By default the api service is setup to listen to mongodb://mongodb:27017/

You'll need to adjust this line in the src/main.py file to use the correct url

`client = MongoClient("mongodb://mongodb:27017/")`

In a bash terminal, navigate to the 'datafactorio/datafactorio-site/dev' directory

### Build the api image 

`docker build -t graphbase_api_image -f Dockerfile .`

### Identify the network the database you're using is on

`docker network ls`

`docker network inspect [database_network_name]`
 
### Construct the docker run command

```
docker run -d --name graphbase_api \
 -p 8000:8000 \
 -e MONGODB_URL="mongodb://[username]:[password]@mongodb:27017/" \
 --network [database_network_name] \
 graphbase_api_image
```

- Replace [username] and [password] with the credentials for your MongoDB instance, if authentication is required.

- Replace [network_name] with the name of the Docker network your MongoDB database is running on.

- The MongoDB host within the URI (mongodb://mongodb:27017/) assumes the name of the MongoDB service/container is mongodb. Adjust if your setup uses a different service name.
