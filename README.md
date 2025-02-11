# IP Challenge

This repository contains a RESTful API built in TypeScript that allows tracing IP addresses and gathering statistics from tracked data. The API is designed to handle high concurrency and can process **1,000+ requests per minute**.

## Features

- **/traces** (POST): Given an IP address, returns:
  - Country of origin and its ISO code.
  - Geographic coordinates (latitude & longitude).
  - List of currencies used in that country, including their symbols and conversion rates to USD.
  - Distance between the country of origin and the United States.

- **/statistics** (GET): Provides insights on:
  - The longest distance recorded from requested traces.
  - The most frequently traced country.

The API leverages **ip-api.com** for IP geolocation and **fixer.io** for currency conversion data.

## Getting Started

To deploy and use the API, follow the setup instructions below.

## Instalation
```
1. Install node v18.7.0
2. git clone git@github.com:stefanFramework/ip-challenge.git
3. cd ip-challenge/app
4. npm install 
5. docker-compose up -d or docker-compose up ... it's up to you :)
```

## Usage
The aplication will run on http://localhost:3033 and has essentially 3 endpoints:

- /traces (POST):

It can be executed via POSTMAN or cURL

Execution example
```
curl --location --request POST 'http://localhost:3033/traces' \
--header 'Content-Type: application/json' \
--data-raw '{"ip": "insert.your.ip.address"}'
```

Expected Response
``` 
{
    "ip": "176.56.37.251",
    "name": "Ecuador",
    "code": "EC",
    "lat": -0.2309,
    "lon": -78.5211,
    "currencies": [
        {
            "iso": "USD",
            "symbol": "$",
            "conversion_rate": 1
        }
    ],
    "distance_to_usa": 4578.23852030068
}
```
 
- /statistics (GET)

It can be accessed via http://localhost:3033/statistics and the expected response would look like this
```
{
    "longest_distance": {
        "country": "Russia",
        "value": 10336.262885319322
    },
    "most_traced": {
        "country": "Sweden",
        "value": 24
    }
}
```

- /health (GET)
  This is your usual healthcheck
``` 
Still Alive... and Well?
```

## Considerations
```
1. .env file is commited to facilitate api execution. On normal conditions it would be ignored, and replaced for a .env.example file
2. For high currency environment, one possible improvement would be to add a redis database to act as a caching mechanism. Since redis is an "in memory" database, it doesn't require a trip to disk, reducing engine latency to microseconds. That makes it great for this kinds of situations
```

## Other Possible Improvements
``` 
1. Adding Redis as memcache 
2. Adding logger 
3. Implementing a Pipeline pattern for the logic inside de TraceService
```
