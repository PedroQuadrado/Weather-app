# Weather-app
A desktop weather app made using electron. The weather data is from open weather map API.
To run the app you need node instaled then run `node install`, after having finished run `npm start`
## How it works
The first time you init the app you will be redirected to the setting page, the 2 JSON files wil be created in the `%appdata%/weather/storage` folder, then you will be redirected to the weather page where the data is providede by open weather map API according to the setting you defined.
The seconde time tou start the app it will verify it the two files exist in the storage folder and then redirect you.
You can later change settings in the top right button in weather page.
