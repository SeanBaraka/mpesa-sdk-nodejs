# Mpesa sdk for nodejs
A minimalistic wrapper for Mpesa daraja 2.0 apis. Written in a simple easy to understand and follow syntax for any javascript developer.
It's meant to get you started quickly with a clear and consise syntax.

## Installation
> ```npm install mpesa-sdk-nodejs```

## Getting Started
```import { apiClient } from 'mpesa-sdk-client'```;

``` const client = new apiClient()```

### obtaining an access token
``` const token = await client.getAccessToken()```

