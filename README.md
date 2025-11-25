# Simple-Travel-Agency---JMeter-Performance-Testing

<img src="https://www.intelexsystems.com/App_Themes/Default/Images/intlex_staffing_3.gif" width="600"/>



---

## 📌 Project Overview

This project evaluates the **performance, stability, and scalability** of the BlazeDemo travel booking website under different traffic patterns.  
It includes all essential performance test types:

- **Load Testing** – typical expected traffic  
- **Stress Testing** – maximum capacity & breaking point  
- **Spike Testing** – sudden, sharp increases in requests  
- **Endurance (Soak) Testing** – long-duration stability validation  

The project was created as part of the **ITI 5-Month Software Testing Track**.
Description:
Performance Testing Project using Apache JMeter for the Simple Travel Agency (BlazeDemo).
Includes Load, Stress, Spike, and Endurance test scenarios + CLI execution + HTML reports.
Created as part of the ITI Software Testing Track (The Second project).
Performance Test Suite for BlazeDemo (Simple Travel Agency) using **Apache JMeter 5.6.3**

---

## 🖼 System Under Test (SUT)

**Website:** https://blazedemo.com  
<img src="https://raw.githubusercontent.com/mdn/webgl-examples/master/tutorial/sample6/canvas-texture.png" width="500"/>

⚠️ *The application is suitable for educational performance testing due to its simplicity and predictable behavior.*

---

## 🏗 Project Structure

Simple-Travel-Agency-Performance/
├── Simple Travel Agency _DemoPLaze.jmx # Main test plan
├── tests/
│ ├── load/
│ ├── stress/
│ ├── spike/
│ └── endurance/
│
├── reports/
│ ├── load/
│ ├── stress/
│ ├── spike/
│ └── endurance/
│
└── README.md

---

## 📊 Included Test Scenarios

### **1️⃣ Load Test**
Ensures the application performs well under expected, steady user traffic.

### **2️⃣ Stress Test**
Gradually increases load to identify the application’s maximum capacity and breaking point.

### **3️⃣ Spike Test**
Simulates sudden, unexpected traffic surges to evaluate system behavior under extreme conditions.

### **4️⃣ Endurance (Soak) Test**
Runs the system under load for extended periods to detect memory leaks or long-term degradation.

---
## 🧩 Key Performance Indicators (KPIs)

These metrics were monitored throughout the performance testing:

| KPI | Description |
|-----|-------------|
| **Avg Response Time** | Average server response under load |
| **Throughput (Requests/sec)** | Number of requests the server can handle per second |
| **Error Rate** | Percentage of failed or invalid requests |
| **90th / 95th Percentile** | Performance experienced by 90–95% of users |
| **Latency** | Total network + processing delay |
| **Concurrent Users** | Maximum stable number of virtual users |

---

### **Explanation**
- **Thread Groups** simulate different traffic models  
- **HTTP Samplers** mimic real user workflows  
- **Assertions** ensure responses match expectations  
- **Timers** add realistic delays  
- **Listeners** generate performance metrics and dashboards  

---
## ▶️ How to Run the Tests (Non-GUI Mode)

### Run Main Test Plan
```bash
jmeter -n -t "Simple Travel Agency _DemoPLaze.jmx" -l results.jtl -e -o report
```

## 🛡 Highlights of the Performance Suite

- CLI execution fully supported  
- Organized structure for each test type  
- Clean and scalable JMeter Test Plan  
- Auto-generated HTML dashboard reports  
- Designed for educational and ITI project requirements  

---

## 🧭 Future Improvements

This project can be enhanced by adding:

- Distributed Performance Testing (Master–Slave mode)  
- Live monitoring using **Grafana + InfluxDB**  
- CI pipeline integration using **GitHub Actions**  
- Throughput Controller scenarios  
- Dynamic test data via **CSV Data Set Config**

---

## 🏅 Tech & Tools Badges

<p align="center">
<img src="https://img.shields.io/badge/JMeter-5.6.3-red?style=for-the-badge&logo=apache" />
<img src="https://img.shields.io/badge/Java-8+-blue?style=for-the-badge&logo=openjdk" />
<img src="https://img.shields.io/badge/Performance%20Testing-JMeter-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/BlazeDemo-Testing-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/CLI%20Execution-Enabled-green?style=for-the-badge" />
</p>

---
---

## 👩‍💻 Author

**Habiba Ragab Abdelmoneam**  
Software Tester – Performance Testing, API Testing, Automation  
- GitHub: https://github.com/HabibaRagabmetwaly  
- LinkedIn: https://www.linkedin.com/in/habiba-ragab-abdelmoneam  

⭐ *If you find this project helpful, feel free to give it a star.*

---

## ©️ License
This project is intended for educational and testing purposes only
