FROM node:18.14.2-alpine3.16 
RUN npm install -g nodemon 

COPY . /backend 
WORKDIR /backend 
COPY . . 

COPY package.json . 
RUN npm install --force  

EXPOSE 5000
CMD ["npm","run","server"]
