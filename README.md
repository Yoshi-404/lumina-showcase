# Lumina — Gamified Study App (Tech Showcase)

> 💡 **Live Demo:** [Play with Lumina here!](https://luminastudy-seven.vercel.app)
> 🇧🇷 [Leia em Português](./README-pt.md)

<img width="1280" height="715" alt="スクリーンショット 2026-10-09 9 34 00" src="https://github.com/user-attachments/assets/7d337430-dcd1-439c-a8ac-34f36e8bfaea" />

Lumina is a gamified study application designed to make learning addictive. This repository serves as a **Tech Showcase** highlighting the engineering and logic behind one of its core features: **The GitHub-Style Consistency Heatmap**.

*(Note: The full source code containing the complete virtual economy, Firebase integration, and proprietary sticker data is kept in a private repository to protect intellectual property).*

---

## The Feature: Activity Heatmap

To keep students motivated, Lumina tracks every Pomodoro session and Flashcard review, visualizing their daily consistency through a dynamic 5-level intensity heatmap — exactly like GitHub's contribution graph.

<img width="1280" height="712" alt="スクリーンショット 2026-10-09 9 34 24" src="https://github.com/user-attachments/assets/79634698-0767-4aa7-9b00-7c4625461766" />

<img width="1280" height="709" alt="スクリーンショット 2026-10-09 9 34 13" src="https://github.com/user-attachments/assets/3ad0eb23-49c1-4e3e-a788-60140c88a03c" />

<img width="1280" height="713" alt="スクリーンショット 2026-10-09 9 34 32" src="https://github.com/user-attachments/assets/1bc0ab94-3efa-4413-b2ad-d06f7019abd6" />

<img width="1280" height="710" alt="スクリーンショット 2026-10-09 9 34 45" src="https://github.com/user-attachments/assets/91ee71b9-2920-4fff-a68d-9ea880e3a966" />

<img width="1280" height="710" alt="スクリーンショット 2026-10-09 9 35 20" src="https://github.com/user-attachments/assets/2dc06660-4988-4f7c-8c35-a2877ac80cd4" />

### Technical Challenges Solved:
1. **Dynamic Date Math:** Generating exactly 365 days of history backwards from the current date, accounting for leap years and month boundaries.
2. **Matrix Rendering:** Dynamically grouping days into weeks (columns) so the layout flows horizontally from left to right (past to present).
3. **Data Mapping:** Efficiently matching thousands of study session timestamps from the Firebase NoSQL database to their respective calendar blocks in `O(N)` time complexity.
4. **Color Intensity Scaling:** Normalizing daily study minutes across 5 tiers (Level 0 to Level 4) relative to the user's personal best, ensuring the graph always looks balanced.

## Source Code Spotlight

In this showcase repository, you can review the pure Vanilla JS implementation of the Heatmap rendering engine:

* [`src/heatmap.js`](./src/heatmap.js) — The core class responsible for data aggregation, matrix generation, and DOM manipulation.

### Sneak Peek (How the matrix is built):

```javascript
// Generating the 52-week matrix structure dynamically
const weeks = [];
let currentWeek = [];

for (let i = 0; i < 365; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() - (364 - i));
  
  // Calculate activity intensity
  const minutes = dayStats[dateStr] || 0;
  const level = this.calculateLevel(minutes, maxMinutes);

  currentWeek.push({ date, minutes, level });

  // If it's Saturday (6), wrap to the next column
  if (date.getDay() === 6 || i === 364) {
    weeks.push(currentWeek);
    currentWeek = [];
  }
}
```

## Stack & Architecture
* **Frontend:** Vanilla JS (ES6+), HTML5, CSS3 Variables (No heavy frameworks).
* **Backend:** Firebase Firestore (NoSQL) & Authentication.
* **Hosting:** Vercel (CI/CD connected to the private master branch).

---
*If you are a recruiter or developer interested in the full architecture, feel free to reach out or test the live application!*
