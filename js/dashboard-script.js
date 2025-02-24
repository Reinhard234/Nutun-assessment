document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const elements = {
        themeToggle: document.getElementById("theme-toggle"),
        body: document.body,
        cityName: document.getElementById("city-name"),
        cityDropdown: document.getElementById("city-dropdown"),
        cityList: document.getElementById("city-list"),
        calendarGrid: document.getElementById("calendar-grid"),
        calendarWeekdays: document.getElementById("calendar-weekdays"),
        monthSelect: document.getElementById("month-select"),
        yearSelect: document.getElementById("year-select"),
        addAnomalyBtn: document.querySelector(".add-anomaly"),
        anomalyMenu: document.getElementById("anomaly-menu"),
        todayButton: document.getElementById("today-button"),
        selectedDateDisplay: document.getElementById("selected-date"),
        anomalyRow: document.querySelector(".anomaly-row"),
        tempMax: document.getElementById("temp-max"),
        tempMin: document.getElementById("temp-min"),
        temp: document.getElementById("temp"),
        weatherType: document.getElementById("weather-type"),
        humidity: document.getElementById("humidity"),
        wind: document.getElementById("wind"),
        weatherIcon: document.getElementById("weather-icon"),
        logoutButton: document.getElementById("logout"),
        usernameDisplay: document.getElementById("username-display")
    };

    const cities = ["Pretoria", "Cape Town", "Johannesburg", "Durban", "Bloemfontein", "Port Elizabeth", "East London"];
    const anomalies = [
        { name: "Heavy Rain", icon: "🌧️" },
        { name: "Hail", icon: "🌨️" },
        { name: "Extreme Heat", icon: "🔥" },
        { name: "Tornado", icon: "🌪️" },
        { name: "Snowstorm", icon: "❄️" },
        { name: "Lightning", icon: "⚡" }
    ];
    let anomalyData = JSON.parse(localStorage.getItem("anomalyData")) || {};

    let storedDate = JSON.parse(localStorage.getItem("selectedDate"));
    let selectedDate = storedDate ? new Date(storedDate.year, storedDate.month, storedDate.day) : new Date();

    const loggedInUser = localStorage.getItem("loggedInUser");
    //redirect to login page if not logged in
    if (!loggedInUser) {
        window.location.href = "index.html";
    } else {
        elements.usernameDisplay.textContent = loggedInUser;
    }

    elements.logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });

    // Functions
    const getSelectedDateKey = () => `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const saveAnomalies = () => localStorage.setItem("anomalyData", JSON.stringify(anomalyData));
    const saveSelectedDate = () => localStorage.setItem("selectedDate", JSON.stringify({ day: selectedDate.getDate(), month: selectedDate.getMonth(), year: selectedDate.getFullYear() }));

    function updateDisplayedAnomalies() {
        const dateKey = getSelectedDateKey();
        elements.anomalyRow.querySelectorAll(".anomaly-display").forEach(el => el.remove());

        if (anomalyData[dateKey]) {
            anomalyData[dateKey].forEach((anomaly, index) => {
                const anomalyDisplay = document.createElement("div");
                anomalyDisplay.classList.add("anomaly-display");
                anomalyDisplay.innerHTML = `${anomaly.icon} ${anomaly.name}`;

                // Create a remove button
                const removeBtn = document.createElement("span");
                removeBtn.classList.add("anomaly-remove");
                removeBtn.innerHTML = "";
                removeBtn.onclick = () => removeAnomaly(dateKey, index);

                // Append remove button to anomaly display
                anomalyDisplay.appendChild(removeBtn);
                elements.anomalyRow.appendChild(anomalyDisplay);
            });
        }

        generateCalendar(selectedDate.getFullYear(), selectedDate.getMonth());
        populateAnomalyMenu();
    }

    function removeAnomaly(dateKey, index) {
        if (anomalyData[dateKey]) {
            anomalyData[dateKey].splice(index, 1); // Remove anomaly from data

            // If no more anomalies left for this date, delete the key
            if (anomalyData[dateKey].length === 0) {
                delete anomalyData[dateKey];
            }

            updateDisplayedAnomalies(); // Refresh UI
        }
    }

    function populateAnomalyMenu() {
        elements.anomalyMenu.innerHTML = "";
        const dateKey = getSelectedDateKey();
        const selectedAnomalies = anomalyData[dateKey] || [];
        const availableAnomalies = anomalies.filter(anomaly => !selectedAnomalies.some(a => a.name === anomaly.name));

        if (availableAnomalies.length === 0) {
            elements.anomalyMenu.innerHTML = "<div class='no-anomalies-message'>All anomalies added, must have been a tough day!</div>";
            return;
        }

        availableAnomalies.forEach(anomaly => {
            const anomalyItem = document.createElement("div");
            anomalyItem.classList.add("anomaly-item");
            anomalyItem.innerHTML = `${anomaly.icon} ${anomaly.name}`;
            anomalyItem.addEventListener("click", () => {
                if (!anomalyData[dateKey]) anomalyData[dateKey] = [];
                anomalyData[dateKey].push(anomaly);
                saveAnomalies();
                updateDisplayedAnomalies();
            });
            elements.anomalyMenu.appendChild(anomalyItem);
        });
    }

    function updateSelectedDateDisplay() {
        elements.selectedDateDisplay.textContent = selectedDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    }

    function generateCalendar(year, month) {
        elements.calendarGrid.innerHTML = "";
        elements.calendarWeekdays.innerHTML = "";

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Populate weekdays row
        daysOfWeek.forEach(day => {
            const weekdayElement = document.createElement("div");
            weekdayElement.classList.add("weekday");
            weekdayElement.textContent = day;
            elements.calendarWeekdays.appendChild(weekdayElement);
        });

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        // Add empty spaces for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyElement = document.createElement("div");
            emptyElement.classList.add("day", "empty");
            elements.calendarGrid.appendChild(emptyElement);
        }

        // Populate calendar grid with actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = day;

            const dateKey = `${year}-${month + 1}-${day}`;
            (anomalyData[dateKey] || []).forEach(anomaly => {
                const anomalyIcon = document.createElement("span");
                anomalyIcon.classList.add("anomaly-icon");
                anomalyIcon.innerHTML = anomaly.icon;
                dayElement.appendChild(anomalyIcon);
            });

            if (year === selectedDate.getFullYear() && month === selectedDate.getMonth() && day === selectedDate.getDate()) {
                dayElement.classList.add("selected");
            }

            dayElement.addEventListener("click", () => {
                document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
                dayElement.classList.add("selected");
                selectedDate = new Date(year, month, day);
                saveSelectedDate();
                updateSelectedDateDisplay();
                updateDisplayedAnomalies();
            });

            elements.calendarGrid.appendChild(dayElement);
        }
    }


    function goToToday() {
        selectedDate = new Date();
        elements.monthSelect.value = selectedDate.getMonth();
        elements.yearSelect.value = selectedDate.getFullYear();
        generateCalendar(selectedDate.getFullYear(), selectedDate.getMonth());
        updateSelectedDateDisplay();
        updateDisplayedAnomalies();
    }

    function populateSelectors() {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        elements.monthSelect.innerHTML = "";
        months.forEach((month, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = month;
            if (index === selectedDate.getMonth()) option.selected = true;
            elements.monthSelect.appendChild(option);
        });

        elements.yearSelect.innerHTML = "";
        for (let year = 1900; year <= 2025; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            if (year === selectedDate.getFullYear()) option.selected = true;
            elements.yearSelect.appendChild(option);
        }
    }

    function populateCityList() {
        elements.cityList.innerHTML = "";
        cities.forEach((city) => {
            const li = document.createElement("li");
            li.textContent = city;
            li.classList.add("city-item");
            li.addEventListener("click", () => {
                const textNode = elements.cityName.childNodes[0];
                textNode.nodeValue = city;
                fetchWeather(city);
                elements.cityDropdown.classList.add("hidden");
            });
            elements.cityList.appendChild(li);
        });
    }

    async function fetchWeather(city) {
        const apiKey = CONFIG.API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            elements.tempMax.textContent = `↗ ${Math.round(data.main.temp_max)} °C`;
            elements.tempMin.textContent = `↘ ${Math.round(data.main.temp_min)} °C`;
            elements.temp.textContent = `${data.main.temp} °C`;
            elements.weatherType.textContent = data.weather[0].description;
            elements.humidity.textContent = `${data.main.humidity} %`;
            elements.wind.textContent = `${data.wind.speed} km/h`;

            const weatherCondition = data.weather[0].main.toLowerCase();
            console.log(weatherCondition)
            updateWeatherIcon(weatherCondition);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    function updateWeatherIcon(condition) {
        const weatherIcons = {
            rain: "rainy.svg",
            clear: "sunny.svg",
            clouds: "cloudy.svg",
            wind: "windy.svg",
            thunderstorm: "thunder.svg"
        };

        const iconSrc = `assets/icons/${weatherIcons[condition] || "cloudy.svg"}`;
        elements.weatherIcon.src = iconSrc;
        elements.weatherIcon.alt = condition;
    }


    // Event Listeners
    elements.themeToggle.addEventListener("change", () => {
        elements.body.classList.toggle("dark-mode", elements.themeToggle.checked);
        localStorage.setItem("theme", elements.themeToggle.checked ? "dark" : "light");
    });

    elements.addAnomalyBtn.addEventListener("click", () => {
        elements.anomalyMenu.classList.toggle("hidden");
        elements.addAnomalyBtn.classList.toggle("selected");
    });
    elements.monthSelect.addEventListener("change", () => generateCalendar(selectedDate.getFullYear(), parseInt(elements.monthSelect.value)));
    elements.yearSelect.addEventListener("change", () => generateCalendar(parseInt(elements.yearSelect.value), selectedDate.getMonth()));
    elements.todayButton?.addEventListener("click", goToToday);
    elements.cityName.addEventListener("click", () => {
        elements.cityDropdown.classList.toggle("hidden");
        populateCityList();
    });

    document.addEventListener("click", (event) => {
        if (!elements.cityDropdown.contains(event.target) && event.target !== elements.cityName) {
            elements.cityDropdown.classList.add("hidden");
        }
    });

    // Initial Setup
    updateSelectedDateDisplay();
    updateDisplayedAnomalies();
    generateCalendar(selectedDate.getFullYear(), selectedDate.getMonth());
    populateSelectors();
    fetchWeather(elements.cityName.textContent);
});
