import { useEffect, useState } from "react";
import "./App.css";

function InfoCard({ icon, label, value, mono = false }) {
  return (
    <div className="info-card">
      <div className="card-icon-wrapper">
        <span>{icon}</span>
      </div>
      <div className="card-body">
        <span className="card-label">{label}</span>
        <span className={`card-value${mono ? " mono" : ""}`}>{value}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchTime = async () => {
    try {
      const res = await fetch("/api/time/");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTime();
    const id = setInterval(fetchTime, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-badge">
          <span className="pulse-dot" />
          <span>Live API Monitor</span>
        </div>
        <h1>Server Time Dashboard</h1>
        <p className="subtitle">Real-time diagnostics and timezone tracking</p>
      </header>

      <main className="main">
        {loading && (
          <div className="status-box loading">
            <span className="spinner" />
            <span>Connecting to backend service…</span>
          </div>
        )}

        {error && !loading && (
          <div className="status-box error">
            <span>
              ⚠️ Could not reach the server: <strong>{error}</strong>
            </span>
            <button className="retry-btn" onClick={fetchTime}>
              Retry
            </button>
          </div>
        )}

        {data && (
          <>
            <div className="time-hero">
              <span className="time-tag">
                Current Server Time ({data.timezone})
              </span>
              <div className="time-display">{data.time}</div>
              <div className="date-display">
                <span>{data.day_of_week}</span>
                <span>•</span>
                <span>{data.date}</span>
              </div>
            </div>

            <div className="cards-grid">
              <InfoCard
                icon="📅"
                label="ISO Datetime"
                value={data.datetime}
                mono
              />
              <InfoCard
                icon="🌍"
                label="Server Timezone"
                value={data.timezone}
              />
              <InfoCard
                icon="⏱️"
                label="Unix Timestamp"
                value={data.unix_timestamp}
                mono
              />
              <InfoCard
                icon="📆"
                label="Calendar Week"
                value={`Week ${data.week_number}`}
              />
              <InfoCard
                icon="🐍"
                label="Python Runtime"
                value={data.server.python_version}
                mono
              />
              <InfoCard
                icon="🖥️"
                label="Host Platform"
                value={data.server.platform}
              />
            </div>

            {lastFetched && (
              <div className="refresh-bar">
                <span className="refresh-dot" />
                <span>
                  Updated: {lastFetched.toLocaleTimeString()} (auto-refreshes
                  every second)
                </span>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
