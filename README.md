# ESP32 IoT Environmental Monitoring System

An IoT-based environmental monitoring system built using an ESP32 microcontroller, BME280 sensor, and dual OLED displays. 
The system collects real-time environmental measurements, uploads them securely to a cloud database, and displays the data through a remotely accessible web dashboard.

<img width="3608" height="1999" alt="IMG_4780" src="https://github.com/user-attachments/assets/5acd7ed1-ed57-45eb-bc04-f6372929eb8f" />

**[View Live Dashboard](https://qcallan.github.io/esp32-climate-dashboard/)**

*Dashboard login required.*

## Project Overview

This project was developed to explore embedded systems, sensor interfacing, wireless communication, cloud integration, and full-stack IoT development.

The system measures three environmental parameters:

- **Temperature** — Degrees Fahrenheit (°F)
- **Relative Humidity** — Percentage (%)
- **Atmospheric Pressure** — Hectopascals (hPa)

Measurements are displayed locally using two OLED screens and uploaded to Supabase every 60 seconds. 
A custom web dashboard allows authorized users to remotely view current conditions and historical temperature trends.

## Hardware Components

| Component | Purpose |
|---|---|
| ESP32 Development Board | Main microcontroller and Wi-Fi connectivity |
| BME280 Sensor | Measures temperature, humidity, and pressure |
| SSD1306 OLED Display #1 | Displays current sensor readings |
| SSD1306 OLED Display #2 | Displays a temperature history graph |
| Breadboard and Jumper Wires | Connects hardware components |

## Software and Technologies

| Technology | Application |
|---|---|
| C++ / Arduino Framework | ESP32 firmware |
| PlatformIO / VS Code | Firmware development |
| I2C Communication | Sensor and OLED interfaces |
| Wi-Fi / HTTPS | Wireless cloud communication |
| Supabase | PostgreSQL database, authentication, and Edge Functions |
| HTML / CSS / JavaScript | Web dashboard |
| Chart.js | Historical temperature visualization |
| GitHub Pages | Website hosting |


## System Architecture

The ESP32 communicates with the BME280 sensor over I2C to retrieve environmental measurements.

Two OLED displays provide local visualization, while the ESP32 sends measurements to a Supabase Edge Function using HTTPS.

The Edge Function validates the device request and stores the readings in a PostgreSQL database.

The web dashboard retrieves sensor measurements from Supabase using authenticated requests, with Row Level Security restricting database access.


**Data flow:**

ESP32 + BME280 → OLED Displays

ESP32 → HTTPS → Supabase Edge Function → PostgreSQL Database

PostgreSQL Database → Authenticated Web Dashboard → Remote User

## Key Features

- Real-time environmental monitoring
- Dual OLED displays using separate I2C buses
- Local temperature history visualization
- Local Wi-Fi web dashboard hosted by the ESP32
- Automated cloud uploads every 60 seconds
- Secure device authentication for cloud uploads
- Cloud-based historical data storage
- User authentication and database Row Level Security
- Responsive web dashboard with interactive temperature graphs
- Remote monitoring through GitHub Pages

## Hardware Connections

The project uses two I2C buses to communicate with the sensor and displays.

|      Device     |   SDA   |   SCL   | I2C Address |
|-----------------|---------|---------|-------------|
| BME280          | GPIO 21 | GPIO 22 |    0x76     |
| OLED Display #1 | GPIO 21 | GPIO 22 |    0x3C     |
| OLED Display #2 | GPIO 16 | GPIO 17 |    0x3C     |

Both I2C buses operate independently, allowing the two OLED displays to use the same I2C address.

## Cloud Integration and Security

Sensor measurements are uploaded to Supabase through a dedicated Edge Function.

The system implements several security measures:

- HTTPS for encrypted communication
- A device authentication token for validating ESP32 uploads
- Server-side database insertion through an Edge Function
- Supabase Authentication for dashboard users
- Row Level Security to restrict access to authorized accounts
- Separation of credentials from publicly shared source code

Sensitive information, including Wi-Fi passwords and device authentication tokens, is excluded from the public repository.

## Web Dashboard

The dashboard provides:

- Current temperature, humidity, and atmospheric pressure
- Sensor online/offline status
- Historical temperature visualization
- Selectable time ranges
- Automatic data refresh every 60 seconds
- Secure login and logout functionality
- Responsive layouts for desktop and mobile devices

  <img width="1794" height="967" alt="Screenshot 2026-10-19 at 11 51 16 PM" src="https://github.com/user-attachments/assets/2fa1e9d6-ae94-449c-9e44-e4554707d4d2" />

**Live Website:** https://qcallan.github.io/esp32-climate-dashboard/

## Future Improvements

- Humidity and atmospheric pressure history graphs
- Configurable temperature alerts
- Improved data visualization and analytics
- Offline data buffering during Wi-Fi outages
- Additional environmental sensors
- More detailed device health monitoring

## Author

**Quinn Callan**

Electronic Systems Engineering Technology  
Mathematics Minor  
Texas A&M University

*Developed as a personal embedded systems and IoT engineering project.*
