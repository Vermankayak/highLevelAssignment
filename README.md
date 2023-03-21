# High Level Assignment

The app has two parts - a frontend and a backend. The frontend is deployed at `https://king-prawn-app-euqgc.ondigitalocean.app/` and the backend is deployed at `https://orca-app-k8all.ondigitalocean.app`.

The backend requires a few environment variables to be set in order to run locally:

<pre>
PORT
MYSQL_HOST
MYSQL_PORT
MYSQL_USERNAME
MYSQL_PASSWORD
MYSQL_DATABASE
DECIMAL_POINTS
</pre>


Similarly, the frontend requires the following environment variables to be set:
<pre>
REACT_APP_LIMIT
REACT_APP_HOST ---> should be in the format host:port
REACT_APP_PROTOCOL
</pre>
### Then do npm start for both backend and frontend
## Endpoints
The backend provides the following endpoints:
<pre>
1. `/api/setup`

   Body params: 
   
  {
"name":"nihar673",
"balance":0
}

This endpoint is used to create a new wallet.

2. `/api/transact/:walletId`

Body params: 
{
"amount":18.44,
"description":"Recharge"
}
This endpoint is used to create a new transaction for the given wallet.

3. `/api/transactions`

Query params: walletId, skip and limit
This endpoint is used to get a list of transactions for the given wallet.

4. `/api/wallet/:walletId`

Param: 
This endpoint is used to get the details of a wallet.

</pre>
## Setting up the MySQL tables

In order to run the backend, you will need to create two MySQL tables - `transactions` and `wallets`. Here are the queries to create these tables:

### For transactions table:
<pre>
CREATE TABLE transactions (
id_int int(11) NOT NULL AUTO_INCREMENT,
transactionId_vch varchar(500) NOT NULL,
wallet_id_vch varchar(200) NOT NULL,
amount_vch varchar(200) DEFAULT NULL,
description_vch varchar(500) NOT NULL,
balance_vch varchar(200) DEFAULT NULL,
created_dt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
type_vch varchar(100) DEFAULT NULL,
PRIMARY KEY (id_int),
UNIQUE KEY transactionId_vch (transactionId_vch)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=latin1;
</pre>

### For wallets table:
<pre>
CREATE TABLE wallets (
id_int int(11) NOT NULL AUTO_INCREMENT,
balance_vch varchar(200) DEFAULT NULL,
name_vch varchar(300) NOT NULL,
created_dt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
wallet_id_vch varchar(200) DEFAULT NULL,
updated_dt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id_int)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;
</pre>

## Note about server response time

Please note that the response time on the frontend may be slower as the servers have been deployed on DigitalOcean and the database is on AWS RDS. Additionally, the servers are of dev or staging grade.
