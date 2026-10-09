/* ============================================
   StudyQuest — Heatmap (GitHub-style)
   ============================================ */

import { Store } from './store.js';
import { Utils } from './utils.js';

let containerEl = null;
let tooltipEl = null;

function getColors() {
  const settings = Store.getSettings();
  const h = settings.accentHue || 140;
  const s = settings.accentSaturation || 70;
  return {
    0: `hsl(${h}, ${s}%, 15% / 0.3)`,
    1: `hsl(${h}, ${s}%, 25%)`,
    2: `hsl(${h}, ${s}%, 35%)`,
    3: `hsl(${h}, ${s}%, 45%)`,
    4: `hsl(${h}, ${s}%, 55%)`
  };
}

function getLevel(minutes) {
  if (minutes === 0) return 0;
  if (minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  if (minutes <= 120) return 3;
  return 4;
}

function buildHeatmap() {
  if (!containerEl) return;

  const studyMap = Store.getStudyMap(365);
  const stats = Store.getStats();
  const colors = getColors();

  // Calculate dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();

  // We need 52 full weeks + remaining days in current week
  const totalDays = 52 * 7 + dayOfWeek + 1;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);

  // Build cell data
  const cells = [];
  const monthLabels = [];
  let prevMonth = -1;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const minutes = studyMap[key] || 0;
    const level = getLevel(minutes);
    const col = Math.floor(i / 7);
    const row = i % 7;

    cells.push({ date: d, key, minutes, level, col, row });

    // Track month labels
    if (d.getMonth() !== prevMonth && d.getDate() <= 7) {
      prevMonth = d.getMonth();
      monthLabels.push({ month: Utils.getMonthName(d.getMonth()), col });
    }
  }

  const totalCols = Math.ceil(totalDays / 7);
  const totalMinutes = Object.values(studyMap).reduce((a, b) => a + b, 0);
  const totalDaysStudied = Object.values(studyMap).filter(m => m > 0).length;

  // Create tooltip
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'heatmap-tooltip';
    document.body.appendChild(tooltipEl);
  }

  // Build DOM
  const wrapper = Utils.el('div', { class: 'heatmap-wrapper animate-fade-in' },
    // Stats row
    Utils.el('div', { class: 'heatmap-stats' },
      Utils.el('div', { class: 'heatmap-stat' },
        Utils.el('span', { class: 'heatmap-stat-value font-mono' }, Utils.formatDuration(totalMinutes)),
        Utils.el('span', { class: 'heatmap-stat-label' }, 'no último ano')
      ),
      Utils.el('div', { class: 'heatmap-stat' },
        Utils.el('span', { class: 'heatmap-stat-value font-mono' }, `${totalDaysStudied}`),
        Utils.el('span', { class: 'heatmap-stat-label' }, 'dias ativos')
      ),
      Utils.el('div', { class: 'heatmap-stat' },
        Utils.el('span', { class: 'heatmap-stat-value font-mono' }, `${stats.currentStreak}`),
        Utils.el('span', { class: 'heatmap-stat-label', style: { display: 'flex', alignItems: 'center', gap: '4px' } }, 'streak atual ', Utils.el('img', { src: 'assets/icons/fogo.png', style: { width: '12px', height: '12px', imageRendering: 'pixelated' } }))
      ),
      Utils.el('div', { class: 'heatmap-stat' },
        Utils.el('span', { class: 'heatmap-stat-value font-mono' }, `${stats.longestStreak}`),
        Utils.el('span', { class: 'heatmap-stat-label' }, 'maior streak')
      )
    ),

    // Heatmap container
    Utils.el('div', { class: 'heatmap-scroll-container' },
      // Month labels
      Utils.el('div', { class: 'heatmap-months', style: { paddingLeft: '32px' } },
        ...monthLabels.map(m =>
          Utils.el('span', {
            class: 'heatmap-month-label',
            style: { left: `${m.col * 17 + 32}px` } // 14px width + 3px gap
          }, m.month)
        )
      ),

      Utils.el('div', { class: 'heatmap-body' },
        // Day labels
        Utils.el('div', { class: 'heatmap-day-labels' },
          Utils.el('span', { class: 'heatmap-day-label' }),
          Utils.el('span', { class: 'heatmap-day-label' }, 'Seg'),
          Utils.el('span', { class: 'heatmap-day-label' }),
          Utils.el('span', { class: 'heatmap-day-label' }, 'Qua'),
          Utils.el('span', { class: 'heatmap-day-label' }),
          Utils.el('span', { class: 'heatmap-day-label' }, 'Sex'),
          Utils.el('span', { class: 'heatmap-day-label' })
        ),

        // Grid
        Utils.el('div', {
          class: 'heatmap-grid',
          style: { gridTemplateColumns: `repeat(${totalCols}, 14px)` }
        },
          ...cells.map((cell, i) => {
            const div = Utils.el('div', {
              class: 'heatmap-cell',
              style: {
                backgroundColor: colors[cell.level],
                animationDelay: `${cell.col * 10}ms`
              },
              dataset: { date: cell.key, level: cell.level }
            });

            div.addEventListener('mouseenter', (e) => {
              const dateStr = cell.date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });
              const sessions = Store.getSessions().filter(s => s.date === cell.key);
              tooltipEl.innerHTML = `
                <div class="heatmap-tooltip-date">${dateStr}</div>
                <div class="heatmap-tooltip-info">${Utils.formatDuration(cell.minutes)} · ${sessions.length} sessã${sessions.length !== 1 ? 'es' : 'o'}</div>
              `;
              tooltipEl.classList.add('visible');

              const rect = e.target.getBoundingClientRect();
              tooltipEl.style.top = `${rect.top - 8}px`;
              tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
            });

            div.addEventListener('mouseleave', () => {
              tooltipEl.classList.remove('visible');
            });

            return div;
          })
        )
      )
    ),

    // Legend
    Utils.el('div', { class: 'heatmap-legend' },
      Utils.el('span', { class: 'heatmap-legend-text' }, 'Menos'),
      ...Object.values(colors).map(color =>
        Utils.el('div', { class: 'heatmap-legend-cell', style: { backgroundColor: color } })
      ),
      Utils.el('span', { class: 'heatmap-legend-text' }, 'Mais')
    )
  );

  containerEl.innerHTML = '';
  containerEl.appendChild(wrapper);

  // Scroll to end
  const scrollContainer = containerEl.querySelector('.heatmap-scroll-container');
  if (scrollContainer) {
    requestAnimationFrame(() => {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth;
    });
  }
}

export const Heatmap = {
  render(container) {
    containerEl = container;
    buildHeatmap();
  },
  refresh() {
    buildHeatmap();
  },
  destroy() {
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
    containerEl = null;
  }
};
