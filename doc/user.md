# User Api Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
    "username" : "azka",
    "password" : "password",
    "name" : "Azka"
}
```

Response Body (Success) : 

```json
{
    "data" : {
        "username" : "azka",
        "name" : "Azka"
    }
}
```

Response Body (Failed) : 

```json
{
    "error" : "Username must not blank,..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
    "username" : "azka",
    "password" : "password"
}
```

Response Body (Success) : 

```json
{
    "data" : {
        "username" : "azka",
        "name" : "Azka",
        "token" : "token"
    }
}
```

Response Body (Failed) : 

```json
{
    "error" : "Username must not blank,..."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :
- Authorization : token

Response Body (Success) : 

```json
{
    "data" : {
        "username" : "azka",
        "name" : "Azka",
    }
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Body : 

```json
{
    "name" : "Kalo mau update name",
    "password" : "Kalo mau update password"
}
```

Response Body (Success) : 

```json
{
    "data" : {
        "username" : "azka",
        "name" : "Azka",
    }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :
- Authorization : token

Response Body (Success) : 

```json
{
    "data" : true
}
```
