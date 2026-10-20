
/* =========================================
   1. SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL =
    "https://qdztxkozmzohpozwoekl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_4sispotYsGow_dUFEbX1Iw_T8iXK7jB";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================
   2. HTML ELEMENTS
========================================= */

const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const dashboard = document.getElementById("dashboard");
const logoutButton = document.getElementById("logout-button");

const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const pressureElement = document.getElementById("pressure");

const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const lastUpdated = document.getElementById("last-updated");

const timeRange = document.getElementById("time-range");

let temperatureChart = null;
let refreshTimer = null;


/* =========================================
   3. LOGIN / LOGOUT
========================================= */

function showDashboard(isLoggedIn) {
    loginScreen.hidden = isLoggedIn;
    dashboard.hidden = !isLoggedIn;

    if (isLoggedIn) {
        loadSensorData();

        if (!refreshTimer) {
            refreshTimer = setInterval(loadSensorData, 60000);
        }
    } else {
        clearInterval(refreshTimer);
        refreshTimer = null;

        statusDot.className = "disconnected";
        statusText.textContent = "Disconnected";
    }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginError.textContent = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await db.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        loginError.textContent = error.message;
    }
});

logoutButton.addEventListener("click", async () => {
    const { error } = await db.auth.signOut();

    if (error) {
        alert(error.message);
    }
});

db.auth.onAuthStateChange((_event, session) => {
    showDashboard(Boolean(session));
});


/* =========================================
   4. LOAD SENSOR READINGS
========================================= */

async function loadSensorData() {
    const { data: sessionData } = await db.auth.getSession();

    if (!sessionData.session) {
        return;
    }

    statusText.textContent = "Updating...";

    const hours = Number(timeRange.value);

    const startDate = new Date(
        Date.now() - hours * 60 * 60 * 1000
    ).toISOString();

    // Most recent measurement
    const latestResult = await db
        .from("sensor_readings")
        .select("temperature, humidity, pressure, recorded_at")
        .order("recorded_at", { ascending: false })
        .limit(1);

    // Historical measurements
    const historyResult = await db
        .from("sensor_readings")
        .select("temperature, recorded_at")
        .gte("recorded_at", startDate)
        .order("recorded_at", { ascending: false })
        .limit(1000);

    if (latestResult.error || historyResult.error) {
        console.error(
            "Supabase error:",
            latestResult.error || historyResult.error
        );

        statusDot.className = "disconnected";
        statusText.textContent = "Connection error";
        return;
    }

    const latest = latestResult.data[0];

    if (!latest) {
        statusDot.className = "disconnected";
        statusText.textContent = "No readings yet";
        return;
    }

    // Update sensor cards
    temperatureElement.textContent =
        Number(latest.temperature).toFixed(1);

    humidityElement.textContent =
        Number(latest.humidity).toFixed(1);

    pressureElement.textContent =
        Number(latest.pressure).toFixed(1);

    // Update timestamp
    const readingTime = new Date(latest.recorded_at);

    lastUpdated.textContent =
        readingTime.toLocaleString();

    // Display connection status
    const ageMinutes =
        (Date.now() - readingTime.getTime()) / 60000;

    const isRecent = ageMinutes < 3;

    statusDot.className =
        isRecent ? "connected" : "disconnected";

    statusText.textContent =
        isRecent ? "Sensor Online" : "Sensor Offline";

    // Oldest to newest for graph
    const history = [...historyResult.data].reverse();

    updateTemperatureChart(history);
}


/* =========================================
   5. TEMPERATURE GRAPH
========================================= */

function updateTemperatureChart(readings) {
    const labels = readings.map((reading) => {
        return new Date(reading.recorded_at)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
    });

    const temperatures = readings.map((reading) => {
        return Number(reading.temperature);
    });

    if (temperatureChart) {
        temperatureChart.destroy();
    }

    const canvas = document.getElementById(
        "temperature-chart"
    );

    temperatureChart = new Chart(canvas, {
        type: "line",

        data: {
            labels,

            datasets: [{
                label: "Temperature (°F)",
                data: temperatures,
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56, 189, 248, 0.1)",
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                tension: 0.3,
                fill: true
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        color: "#94a3b8"
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#94a3b8",
                        maxTicksLimit: 8
                    },
                    grid: {
                        color: "#263248"
                    }
                },

                y: {
                    ticks: {
                        color: "#94a3b8"
                    },
                    grid: {
                        color: "#263248"
                    }
                }
            }
        }
    });
}


/* =========================================
   6. TIME RANGE SELECTION
========================================= */

timeRange.addEventListener("change", () => {
    loadSensorData();
});


/* =========================================
   7. INITIALIZE DASHBOARD
========================================= */

async function initializeDashboard() {
    const { data, error } = await db.auth.getSession();

    if (error) {
        console.error("Authentication error:", error);
        showDashboard(false);
        return;
    }

    showDashboard(Boolean(data.session));
}

initializeDashboard();
