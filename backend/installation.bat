npm init -y 
npm i express dotenv cors socket.io jsonwebtoken express-async-handler email-validator bcrypt
npm i --save-dev @types/bcrypt @types/jsonwebtoken 
npm i -D nodemon
npm i  prisma  ts-node  @types/express @types/node
npm install @prisma/client
npx tsc --init
npx prisma init
npm i stripe 
npm i zod
npm install google-auth-library --save
npx prisma migrate dev --name init
: connect to a new db on PostgreSql 

psql -U postgres @REM then write password
CREATE DATABASE <NAME> WITH ENCODING 'UTF8'
\c <NAME> @Rem TO CONNECT TO DB 


npm i prisma-json-types-generator --force
npm install validator 
npm i --save-dev @types/validator
npm i lodash
npm i --save-dev @types/lodash
npm install @turf/turf
npm i expo-server-sdk
npm install cloudinary
: https://blog.logrocket.com/create-send-push-notifications-react-native/#:~:text=To%20use%20push%20notifications%20in,received%20notifications%20we%27ve%20sent.

docker build -t uber-backend . 
: Running the image
@REM ! ?? docker run --name <NAME_CONTAINER> -p <PORT_NUMBER_EXPOSES_BY_CONTAINER>:<PORT_NUMBER_TO_USE_IN_PC> [-d ] <NAME_IMAGE>
docker run uber-backend
