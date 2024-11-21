# Address Api Spec

## Create Address

Endpoint : POST /api/contacts/{idContact}/addresses

Request Header :
- Authoriztion : token

Request Body :

```json
{
    "street" : "jalan",
    "city" : "kota",
    "province" : "provinsi",
    "country" : "negara",
    "postal_code" : "12345"
}
```

Response Body :

```json
{
    "data" : {
        "id" : 1,
        "street" : "jalan",
        "city" : "kota",
        "province" : "provinsi",
        "country" : "negara",
        "postal_code" : "12345"
    }
}
```

## Get Address

Endpoint : GET /api/contacts/{idContact}/addresses/{idAddress}

Request Header :
- Authoriztion : token

Response Body :

```json
{
    "data" : {
        "id" : 1,
        "street" : "jalan",
        "city" : "kota",
        "province" : "provinsi",
        "country" : "negara",
        "postal_code" : "12345"
    }
}
```

## Update Address

Endpoint : PUT /api/contacts/{idContact}/addresses/{idAddress}

Request Header :
- Authoriztion : token

Request Body :

```json
{
    "street" : "jalan",
    "city" : "kota",
    "province" : "provinsi",
    "country" : "negara",
    "postal_code" : "12345"
}
```


Response Body :

```json
{
    "data" : {
        "id" : 1,
        "street" : "jalan",
        "city" : "kota",
        "province" : "provinsi",
        "country" : "negara",
        "postal_code" : "12345"
    }
}
```

## Remove Address

Endpoint : DELETE /api/contacts/{idContact}/addresses/{idAddress}

Request Header :
- Authoriztion : token

Response Body :

```json
{
    "data" : true
}
```

## List Address

Endpoint : POST /api/contacts/{idContact}/addresses

Request Header :
- Authoriztion : token

Response Body :
```json
{
    "data" : [
        {
            "id" : 1,
            "street" : "jalan",
            "city" : "kota",
            "province" : "provinsi",
            "country" : "negara",
            "postal_code" : "12345"
        },
        {
            "id" : 2,
            "street" : "jalan",
            "city" : "kota",
            "province" : "provinsi",
            "country" : "negara",
            "postal_code" : "12345"
        },
        ...
    ]
}
```