npx create-expo-app frontend
cd frontend
npm install -D @tsconfig/react-native @types/jest @types/react @types/react-test-renderer typescript
npx expo install @types/react@~18.0.27 typescript@^4.9.4
: create in the root folder a tsconfig.json  and put : 
: {
:     "extends" : "@tsconfig/react-native/tsconfig.json"
: }
: start android studio in the same time run a phone 
: and just press a on the terminal after running the npx expo start
npx expo start

npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/stack @react-navigation/drawer @react-navigation/bottom-tabs


npx expo install react-native-gesture-handler react-native-reanimated

: babel.config.js
: module.exports = function(api) {
:  
:   return {
:     presets: ['babel-preset-expo',],
:     plugins:[
:        ...
:       "nativewind/babel", 
:       'react-native-reanimated/plugin',
:     ]
:   };
: };



npm i nativewind 
npm i tailwindcss @REM for my case use the version 3.3.2
npx tailwindcss init 
: folow this https://www.nativewind.dev/quick-starts/expo


npx expo install expo-font expo-splash-screen 

npm install --save-dev tsc-alias
npm i @react-navigation/native-stack react-native-animatable
npm i zustand @react-native-async-storage/async-storage  @tanstack/react-query 
npm install zod formik  react-hook-form @hookform/resolvers 
npm install @stripe/stripe-react-native 
npm i zod-formik-adapter

npm i react-native-map react-native-maps-directions
npm install expo-location
: "plugins": [
:      ...
:      [
:        "expo-location",
:        {
:          "locationAlwaysPermission": "Allow to always use your location.",
:          "locationAlwaysAndWhenInUsePermission": "Allow to use your location.",
:          "isAndroidBackgroundLocationEnabled": true
:        }
:      ],
: ]

npm install react-native-maps-directions
npm i react-native-config
npm i react-native-popup-menu
npm i @gorhom/bottom-sheet
npm i lodash
npm i --save-dev @types/lodash
npm install moment --save   # npm
npm i @cloudinary/url-gen  @cloudinary/react
npx expo install expo-image-picker
npm install cloudinary
npx expo install expo-notifications expo-device expo-constants
: to get the projectId (not necessary if u're using locally prebuild )
eas build:configure  
: Prebuilding
npx expo prebuild @REM eas build : to get a build on cloud 
: app.json
: "plugins": [
:     ...
:     [
:         "expo-notifications",
:         {
:             "icon": "./assets/images/uber-logo.jpg",
:             "color": "#ffffff"
:         }
:     ]
: ]
npm i socket.io-client


: Setting UP FCM with firebase : 
:   -   create project && add your Application android  
eas build:configure
eas build
eas credentials @REM >> SHA-1 key + application ID 
: - Firebase Dashboard > Add application
: - download google-services.json and place it in same folder as app.json
: - in app.json : 
:       {
:         "android": {
:           "googleServicesFile": "./google-services.json"
:         }
:       }
: - Upload server credentials to Expo to use firebase credentials 
:   -   Firbase console > project settings > Cloud Messaging
:   -   Enable Cloud Messaging API (legacy ) by cliicking three dots then you will be redirected and activte it 
:   -   Copy the token listed next to the Server key.
:   -   go to > https://expo.dev choose the application 
:   -   > Credentials > com.<company>.<app>
:   -   Under Service Credentials > FCM Server Key, click Add a FCM Server Key > Google Cloud Messaging Token and add the Server key from step 3.

npx expo install expo-blur
npm i react-native-phone-input
npm i react-native-dropdown-select-list
npx expo install @react-native-community/datetimepicker