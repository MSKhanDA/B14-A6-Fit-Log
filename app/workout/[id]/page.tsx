"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getWorkout } from "../../../lib/api";
import { PLAN_CAP, usePlan } from "../../../context/PlanContext";
import NotFoundView from "../../components/NotFoundView";
import { BookmarkIcon, PlusIcon } from "../../components/Icons";

interface Workout {
  id: string;
  name: string;
  description: string;
  equipment: string;
  difficulty: string;
  sets: string;
  reps: string;
  duration: number;
  caloriesBurned: number;
  rating: number;
  muscleGroups: string[];
  instructions: string[];
  image: string;
}

export default function WorkoutDetail() {
  const { id } = useParams();
  const [w, setW] = useState<Workout | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
  const { plan, saved, addToPlan, saveForLater } = usePlan();

  useEffect(() => {
    setStatus("loading");
    getWorkout(id as string)
      .then((data) => {
        setW(data);
        setStatus("ok");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  if (status === "loading") {
    return <div className="shell" style={{ padding: "48px 28px" }}><div className="loader" role="status">Loading workout…</div></div>;
  }
  if (status === "missing") return <NotFoundView message="We couldn't find that workout." />;

  const inPlan = plan.includes(w!.id);
  const full = plan.length >= PLAN_CAP && !inPlan;
  const specs = [
    ["EQUIPMENT", w?.equipment],
    ["DIFFICULTY", w?.difficulty],
    ["SETS", w?.sets],
    ["REPS", w?.reps],
    ["DURATION", `${w?.duration} min`],
    ["CALORIES", `${w?.caloriesBurned} kcal`],
    ["RATING", w?.rating],
  ];

  return (
    <div className="shell">
      <div className="detail">
        <div className="detail-visual">
          <img src={w?.image || ""} alt={w?.name || ""} />
        </div>
        <div>
          <Link href="/" className="back">← BACK TO LIBRARY</Link>
          <h1 className="display">{w?.name.toUpperCase()}</h1>
          <p className="detail-desc">{w?.description}</p>
          <div className="tags" style={{ marginTop: 16 }}>
            {w?.muscleGroups.map((m) => <span key={m} className="tag">{m}</span>)}
          </div>

          <div className="specs">
            {specs.map(([label, value]) => (
              <div key={label} className="spec">
                <label>{label}</label>
                <b>{value as string}</b>
              </div>
            ))}
          </div>

          <div className="instructions">
            <h2>INSTRUCTIONS</h2>
            <ol>
              {w?.instructions.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>

          <div className="detail-actions" style={{ marginTop: 28 }}>
            <button
              className="button"
              style={{ marginTop: 0, opacity: full ? 0.5 : 1, cursor: full ? "not-allowed" : "pointer" }}
              disabled={full}
              onClick={() => w && addToPlan(w)}
            >
              <PlusIcon /> {full ? "PLAN IS FULL" : "ADD TO TODAY'S PLAN"}
            </button>
            <button className="button secondary" style={{ marginTop: 0 }} onClick={() => w && saveForLater(w)}>
              <BookmarkIcon /> {saved.includes(w!.id) ? "SAVED" : "SAVE FOR LATER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}