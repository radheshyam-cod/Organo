import React, { useState, useEffect } from "react";
import { wellnessService } from "../../services/wellnessService";
import type { HealthHistory } from "../../services/wellnessService";
import { Activity, Moon, Battery, ThumbsUp } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

export function HealthCheckIn() {
  const [history, setHistory] = useState<HealthHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  // Form state
  const [sleep, setSleep] = useState(3);
  const [digestion, setDigestion] = useState(3);
  const [energy, setEnergy] = useState(3);

  const loadHistory = async () => {
    if (!token) return;
    try {
      const data = await wellnessService.getHistory(token);
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.error("Expected array from /wellness/history, got:", data);
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to load history", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await wellnessService.checkIn({ sleep, digestion, energy }, token);
      setSuccess(true);
      await loadHistory();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Check-in failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const hasCheckedInToday =
    history.length > 0 &&
    new Date(history[0].createdAt).toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-organo-green/10">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Form Section */}
        <div className="flex-1">
          <h2 className="font-serif text-3xl text-organo-green mb-2 flex items-center gap-2">
            <Activity className="text-organo-pistachio" size={28} />
            Daily Health Check-In
          </h2>
          <p className="text-organo-gray mb-8">
            Track your wellness to get adaptive AI recommendations for your upcoming boxes.
          </p>

          {hasCheckedInToday ? (
            <div className="bg-green-50 text-organo-green p-6 rounded-xl flex flex-col items-center justify-center text-center">
              <ThumbsUp size={32} className="text-organo-pistachio mb-3" />
              <h3 className="font-bold text-lg mb-1">You're all set for today!</h3>
              <p className="text-sm">We've tuned your recommendations based on your stats.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-organo-green font-bold mb-3">
                  <Moon size={18} /> Sleep Quality
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSleep(val)}
                      className={`flex-1 py-2 rounded-lg border font-bold transition-colors ${
                        sleep === val
                          ? "bg-organo-green text-white border-organo-green"
                          : "bg-white text-organo-gray border-gray-200 hover:border-organo-green"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-organo-green font-bold mb-3">
                  <Activity size={18} /> Digestion
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDigestion(val)}
                      className={`flex-1 py-2 rounded-lg border font-bold transition-colors ${
                        digestion === val
                          ? "bg-organo-green text-white border-organo-green"
                          : "bg-white text-organo-gray border-gray-200 hover:border-organo-green"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-organo-green font-bold mb-3">
                  <Battery size={18} /> Energy Levels
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEnergy(val)}
                      className={`flex-1 py-2 rounded-lg border font-bold transition-colors ${
                        energy === val
                          ? "bg-organo-green text-white border-organo-green"
                          : "bg-white text-organo-gray border-gray-200 hover:border-organo-green"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-organo-green text-white py-3 rounded-full font-bold uppercase tracking-wider hover:bg-organo-pistachio hover:text-organo-green transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Check-In"}
              </button>

              {success && (
                <p className="text-center text-organo-green font-bold text-sm mt-2">
                  Check-in saved successfully!
                </p>
              )}
            </form>
          )}
        </div>

        {/* History Widget */}
        <div className="md:w-64 bg-organo-cream/30 p-6 rounded-xl border border-gray-100">
          <h3 className="font-bold text-organo-green mb-4">Recent Days</h3>
          {loading ? (
            <p className="text-sm text-organo-gray">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-organo-gray">No check-ins yet.</p>
          ) : (
            <div className="space-y-4">
              {history.slice(0, 5).map((h) => (
                <div key={h.id} className="text-sm">
                  <div className="font-bold text-organo-gray mb-1">
                    {new Date(h.createdAt).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex gap-2 text-xs text-organo-gray font-medium">
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                      <Moon size={10} /> {h.sleep}
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                      <Activity size={10} /> {h.digestion}
                    </span>
                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                      <Battery size={10} /> {h.energy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
