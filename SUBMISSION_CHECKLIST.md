# WAF-II Experiential Learning — Project 3 Submission Checklist

## Assigned project: To-Do List Application
- [x] Add tasks
- [x] Mark tasks completed
- [x] Delete tasks
- [x] Persist tasks with localStorage
- [x] Filter All / Active / Completed
- [x] Responsive UI
- [x] README and run instructions
- [x] GitHub repository populated

## Concepts to explain
1. **React Hooks:** useState stores task list, input, filter and hydration state; useEffect loads and saves browser storage.
2. **State Management:** state updates are immutable and drive the task list, counters, filters and progress UI.
3. **Client-side Rendering:** task interactions happen in the browser within a Client Component.

## Manual test evidence to capture
1. Empty list on first load.
2. Add a task; it appears in the list.
3. Submit whitespace-only input; no task is added.
4. Mark a task complete; styling and progress update.
5. Refresh; tasks and completion states remain.
6. Filter Active, Completed, and All.
7. Delete a task.
8. Clear completed tasks.
9. Resize to mobile width and capture responsive UI.

## Before final submission
- [ ] Run `npm install`
- [ ] Run `npm run dev` and test at `http://localhost:3000/todos`
- [ ] Run `npm run build`
- [ ] Capture screenshots for UI and test evidence
- [ ] Deploy to Vercel and test production URL
- [ ] Add production URL to submission/PESU Academy PDF
