"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./todo.module.css";

type Task = { id: string; title: string; completed: boolean; createdAt: number };
type Filter = "all" | "active" | "completed";
const STORAGE_KEY = "taskflow-todos-v1";

function Icon({ name }: { name: "plus" | "check" | "trash" | "sun" | "spark" | "list" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "plus") return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
  if (name === "trash") return <svg {...common}><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v7m4-7v7"/></svg>;
  if (name === "sun") return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>;
  if (name === "spark") return <svg {...common}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>;
  return <svg {...common}><path d="M4 5h16M4 12h16M4 19h16"/></svg>;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [hydrated, setHydrated] = useState(false);

  // Load browser storage after mount to avoid server/client hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved) as Task[]);
    } catch { /* Ignore malformed saved data and start fresh. */ }
    setHydrated(true);
  }, []);

  // Persist task changes after browser hydration.
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - activeCount;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const filteredTasks = useMemo(() => tasks.filter((task) => filter === "all" || (filter === "active" ? !task.completed : task.completed)), [tasks, filter]);

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    setTasks((current) => [{ id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() }, ...current]);
    setInput("");
  }
  function toggleTask(id: string) { setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)); }
  function deleteTask(id: string) { setTasks((current) => current.filter((task) => task.id !== id)); }
  function clearCompleted() { setTasks((current) => current.filter((task) => !task.completed)); }

  return <main className={styles.page}>
    <div className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="/todos"><span className={styles.brandIcon}><Icon name="check" /></span><span>taskflow<span className={styles.brandDot}>.</span></span></a>
        <div className={styles.headerTag}><span className={styles.liveDot} /> Your personal workspace</div>
      </header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}><div className={styles.eyebrow}><Icon name="spark" /> A little clarity goes a long way</div><h1>Make space for<br/><span>what matters.</span></h1><p>Keep your day simple. One task at a time, one small win at a time.</p></div>
        <div className={styles.summaryCard}><div className={styles.summaryTop}><span>Today's progress</span><span className={styles.progressValue}>{progress}%</span></div><div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: progress + "%" }} /></div><div className={styles.summaryStats}><div><strong>{activeCount}</strong><span>left to do</span></div><div className={styles.statDivider}/><div><strong>{completedCount}</strong><span>completed</span></div></div></div>
      </section>
      <section className={styles.taskPanel}>
        <div className={styles.panelHeading}><div><div className={styles.sectionEyebrow}>YOUR LIST</div><h2>My tasks <span className={styles.countBadge}>{tasks.length}</span></h2></div><div className={styles.headingIcon}><Icon name="list"/></div></div>
        <form className={styles.addForm} onSubmit={addTask}><div className={styles.inputWrap}><span className={styles.inputSpark}><Icon name="spark"/></span><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="What needs to get done?" aria-label="New task" maxLength={160}/></div><button className={styles.addButton} type="submit" disabled={!input.trim()}><Icon name="plus"/><span>Add task</span></button></form>
        <div className={styles.filters}><div className={styles.filterTabs}>{(["all","active","completed"] as Filter[]).map((value) => <button key={value} className={filter === value ? styles.filterActive : styles.filterButton} onClick={() => setFilter(value)}>{value[0].toUpperCase()+value.slice(1)}{value === "all" && <span>{tasks.length}</span>}{value === "active" && <span>{activeCount}</span>}{value === "completed" && <span>{completedCount}</span>}</button>)}</div>{completedCount > 0 && <button className={styles.clearButton} onClick={clearCompleted}>Clear completed</button>}</div>
        <div className={styles.taskList}>
          {!hydrated ? <div className={styles.emptyState}><div className={styles.emptyIcon}><Icon name="sun"/></div><h3>Loading your tasks…</h3></div> : filteredTasks.length === 0 ? <div className={styles.emptyState}><div className={styles.emptyIcon}><Icon name="sun"/></div><h3>{filter === "completed" ? "Nothing completed yet" : filter === "active" ? "You're all caught up!" : "Your list is clear"}</h3><p>{filter === "all" ? "Add a task above to get started. You've got this." : "Tasks will show up here when they match this filter."}</p></div> : filteredTasks.map((task) => <div className={task.completed ? styles.taskRow + " " + styles.taskCompleted : styles.taskRow} key={task.id}><button className={task.completed ? styles.checkButton + " " + styles.checked : styles.checkButton} aria-label={task.completed ? "Mark as active" : "Mark complete"} onClick={() => toggleTask(task.id)}>{task.completed && <Icon name="check"/>}</button><span className={styles.taskTitle}>{task.title}</span><button className={styles.deleteButton} aria-label={"Delete " + task.title} onClick={() => deleteTask(task.id)}><Icon name="trash"/></button></div>)}
        </div>
        <footer className={styles.panelFooter}><span><span className={styles.footerDot}/>{activeCount === 0 && tasks.length > 0 ? "All done — nice work!" : activeCount + " " + (activeCount === 1 ? "task" : "tasks") + " remaining"}</span><span>Saved automatically</span></footer>
      </section>
      <footer className={styles.pageFooter}><span>Built to keep your mind clear.</span><span>Taskflow <span className={styles.brandDot}>•</span> WAF-II Project 3</span></footer>
    </div>
  </main>;
}
