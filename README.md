# Weather R' US

Weather R' US is a **vanilla JavaScript** application that provides real-time weather updates for your location and other South African provinces. The project was built entirely from scratch without any CSS frameworks like Bootstrap, and it does not use any CSS preprocessors like SCSS or LESS. The CSS nesting you see in the project is part of the **native CSS core** (enabled in modern browsers).

## Features

- 🌦️ **Add and remove weather anomalies**
- 🌡️ **View your current weather**
- 🌍 **Check the weather in different South African provinces**
- 🔐 **Simple authentication system using Local Storage**

## Folder Structure

```
/weather-r-us
│── assets/               # Contains logo and other static assets
│── css/                  # Pure CSS styles (no preprocessor used)
│── js/                   # JavaScript functionality
│── index.html            # Main application file
│── config.example.js     # Example config file for API keys
```

## Setup Instructions

To access the full functionality of the app, you need an **API key** from OpenWeatherMap.

### Step 1: Get an API Key

1. Sign up at OpenWeatherMap: [https://home.openweathermap.org/users/sign\_up](https://home.openweathermap.org/users/sign_up)
2. Go to the **API Keys** section and generate a new key

### Step 2: Configure Your API Key

1. Inside the project folder, locate the `config.example.js` file
2. Rename `config.example.js` to `config.js`
3. Open the file and replace `YOUR_API_KEY_HERE` with your actual OpenWeatherMap API key

### Step 3: Run the App

Simply open the `index.html` file in your browser, and you’re good to go!

## Technologies Used

- **HTML5**
- **CSS3** (Native CSS Nesting, No Preprocessors)
- **JavaScript (ES6+)**
- **Local Storage for authentication**

## Notes

- No CSS frameworks like Bootstrap, Tailwind, or Material UI were used. Every component is written from scratch.
- No preprocessors like SCSS or LESS are used—just native CSS nesting, which is now supported in modern browsers.

## License

This project is open-source under the **MIT License**. Feel free to use and modify it as needed.

---

Made with ❤️ by Reinhard Stoop

