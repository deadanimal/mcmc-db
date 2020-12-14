# Deployment Template

You can use this template to deploy your app

### Steps

1. Build the app
    ````
    docker build -t username/clien-appname-apptype:version .
    ````
2. Push the app to docker hub
    ```
    docker push username/clien-appname-apptype:version
    ````
3. First time deployment
    ```
    kubectl create -f folder/
    ```
    Example
     ```
    kubectl create -f angular/
    ```
4. Update deployment
    ```
    kubectl apply -f angular/
    ```
5. For first time django deployment, you need to change the access permission of gunicorn_starter.sh
    ```
    chmod 775 gunicorn_starter.sh
    ```
6. For django deployment, you need to hash the .env using a python script in /util. First you need to copy .env and paste it into env file in /util folder. *don't copy % in the last string
    ```
    -python secret.py —env env
    ```