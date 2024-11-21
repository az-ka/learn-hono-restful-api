# Contact Api Spec

## Create Contact

Endpoint : POST /api/contacts

Request Header :
- Authorization : token

Request Body :

```json
{
    "first_name": "Nama Depan",
    "last_name" : "Nama Belakang",
    "email": "azka@gmail.com",
    "phone": "089xxxxx"
}
```

Response Body :

```json
{
    "data": {
        {
            "id": 1,
            "first_name": "Nama Depan",
            "last_name" : "Nama Belakang",
            "email": "azka@gmail.com",
            "phone": "089xxxxx"
        }
    }
}
```

## Get Contact

Endpoint : GET /api/contacts/{idContact}

Request Header :
- Authorization : token

Response Body :

```json
{
    "data": {
        {
            "id": 1,
            "first_name": "Nama Depan",
            "last_name" : "Nama Belakang",
            "email": "azka@gmail.com",
            "phone": "089xxxxx"
        }
    }
}
```

## Update Contact

Endpoint : PUT /api/contacts/{idContact}

Request Header :
- Authorization : token

Response Body :

```json
{
    "data": {
        {
            "first_name": "Nama Depan",
            "last_name" : "Nama Belakang",
            "email": "azka@gmail.com",
            "phone": "089xxxxx"
        }
    }
}
```

Response Body :

```json
{
    "data": {
        {
            "id": 1,
            "first_name": "Nama Depan",
            "last_name" : "Nama Belakang",
            "email": "azka@gmail.com",
            "phone": "089xxxxx"
        }
    }
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/{idContact}

Request Header :
- Authorization : token

Response Body :

```json
{
    "data": true
}
```

## Search Contact

Endpoint : GET /api/contacts

Request Header :
- Authorization : token

Query Parameter :
- name : string, search ke first_name atau last_name
- email : string, search ke email
- phone : string, search ke phone
- page : number, default 1
- size : number, default 10

Request Body :

```json
{
    "data": [
        {
            "id": 1,
            "first_name": "Nama Depan",
            "last_name" : "Nama Belakang",
            "email": "azka@gmail.com",
            "phone": "089xxxxx"
        },
        {
            "id": 2,
            "first_name": "Nama Depan",
            "last_name" : "Nama Belakang",
            "email": "azka@gmail.com",
            "phone": "089xxxxx"
        },
        ...
    ],
    "paging" : {
        "current_page": 1,
        "total_page" : 10,
        "size" : 10
    }
}
```