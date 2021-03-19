# SyrupPOS

Syrup POS is a Point of Sale System designed for small to medium restaurants, it helps the restaurant to
manage their order, payment and customer records, it also generate reports to make the daily settlement process easier.

SyrupPOS is a PWA, which means it can be installed on your PC, phone or tablet.

A demo has been deployed on Heroku, you can try it [here](https://syrup-pos.herokuapp.com/). Use the default access code "0" to login.

![demo](./materials/demo.gif)


-----------------
## Setup
1. Clone this repo.
2. Run ```npm install``` to download dependencies..
3. Install mysql, then create a database.
4. Create a .env file in the repo. 
5. Enter ```DB_URL=mysql://localhost:3306/?user=YOUR_USERNAME&password=YOUR_PASSWORD&database=DATABASE_NAME``` into .env and save, replace the values with your mysql credential.
6. Run ```npm run seed```
7. Done


-----------------
## Usage
Make sure your database is up and running, then run ```npm start``` to start both the client and server.

-----------------
## Contribute
Feel free to ask me anything via the issue page, or send me a PR if you want to add some code yourself.

-----------------
## License
MIT License

-----------------
## Contact:
* Email: Fanghan.Hu@gmail.com
* LinkedIn: https://www.linkedin.com/in/fanghan-hu/