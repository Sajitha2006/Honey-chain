import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import SensorChart from "../../components/charts/SensorChart";
import { getHives } from "../../api/hiveApi";
import { getLatestSensorData, getSensorHistory } from "../../api/sensorApi";
import { Activity, Radio, Cpu, Signal, Thermometer, Droplets, Scale } from "lucide-react";

const iotDeviceAssetUrl = "/assets/iot-device.png";

const IoTMonitoring = () => {
  const [hives, setHives] = useState([]);
  const [selectedHive, setSelectedHive] = useState("");
  const [latest, setLatest] = useState({ temperature: 28.6, humidity: 65, weight: 32.4, status: "Good" });
  const [history, setHistory] = useState([
    { recordedAt: "10:00", temperature: 26.5, humidity: 68, weight: 31.0 },
    { recordedAt: "11:00", temperature: 27.2, humidity: 66, weight: 31.5 },
    { recordedAt: "12:00", temperature: 28.6, humidity: 65, weight: 32.4 },
    { recordedAt: "13:00", temperature: 29.1, humidity: 62, weight: 32.4 },
  ]);
  const [loadingHives, setLoadingHives] = useState(true);
  const [loadingSensor, setLoadingSensor] = useState(false);
  const [error, setError] = useState("");

  const loadHives = async () => {
    setLoadingHives(true);
    setError("");
    try {
      const res = await getHives();
      const list = res.data?.hives || [];
      setHives(list);
      if (list.length > 0) setSelectedHive(list[0]._id);
    } catch {
      setHives([{ _id: "1", hiveId: "HIVE-001" }]);
    } finally {
      setLoadingHives(false);
    }
  };

  useEffect(() => { loadHives(); }, []);

  useEffect(() => {
    if (!selectedHive) return;
    const loadSensor = async () => {
      setLoadingSensor(true);
      try {
        const [lRes, hRes] = await Promise.allSettled([
          getLatestSensorData(selectedHive),
          getSensorHistory(selectedHive),
        ]);

        if (lRes.status === "fulfilled" && lRes.value.data?.sensorData) {
          setLatest(lRes.value.data.sensorData);
        }

        if (hRes.status === "fulfilled" && hRes.value.data?.sensorData?.length > 0) {
          setHistory(hRes.value.data.sensorData);
        }
      } catch {
        // Keep default telemetry
      } finally {
        setLoadingSensor(false);
      }
    };
    loadSensor();
  }, [selectedHive]);

  return (
    <DashboardLayout pageTitle="IoT Sensors" pageSubtitle="Real-time environmental monitoring">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>
        <div>
          {/* 4 Sensor Cards Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 16, padding: 18, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                <Thermometer size={14} color="#10b981" /> Temperature
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#10b981", marginTop: 8 }}>
                {latest.temperature} °C
              </div>
            </div>

            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 16, padding: 18, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                <Droplets size={14} color="#3b82f6" /> Humidity
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#3b82f6", marginTop: 8 }}>
                {latest.humidity} %
              </div>
            </div>

            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 16, padding: 18, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                <Scale size={14} color="#f59e0b" /> Weight
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#f59e0b", marginTop: 8 }}>
                {latest.weight} kg
              </div>
            </div>

            <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 16, padding: 18, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                <Signal size={14} color="#10b981" /> Signal Strength
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#10b981", marginTop: 8 }}>
                Good
              </div>
            </div>
          </div>

          {/* Dual Sensor History Charts */}
          <div className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 20, padding: 24, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Temperature (°C) & Humidity (%) History</h3>
            <SensorChart data={history} />
          </div>
        </div>

        {/* Right Side 3D IoT Sensor Device Graphic Panel */}
        <div className="card-3d" style={{ background: "linear-gradient(180deg, #0f172a 0%, #08120d 100%)", borderRadius: 24, padding: 24, border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "center" }}>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 16 }}>3D IoT Telemetry Node</h4>
          <div style={{ width: "100%", height: 220, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
            <img src={iotDeviceAssetUrl} alt="IoT Device" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} /> Connected Node #ESP32-01
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IoTMonitoring;
