import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const extract = async () => {
    await API.post("/extract", { text });
    fetchTasks();
  };

  const complete = async (id) => {
    await API.put(`/tasks/${id}/complete`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>TaskScribe Dashboard</h2>

      <textarea
        rows="5"
        placeholder="Paste meeting text here..."
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={extract}>Extract Tasks</button>

      <h3>Your Tasks</h3>
      {tasks.map((t) => (
        <div key={t.id}>
          <p>{t.description} | {t.priority} | {t.deadline}</p>
          {!t.completed && (
            <button onClick={() => complete(t.id)}>Complete</button>
          )}
        </div>
      ))}
    </div>
  );
}
