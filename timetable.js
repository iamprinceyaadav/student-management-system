// ===== Timetable Page =====

const SUBJECT_COLORS = {
  'Mathematics':    '#dbeafe',
  'C Programming':  '#fef9c3',
  'English':        '#ede9fe',
  'Physics':        '#fce7f3',
  'Lab':            '#dcfce7',
  'Data Structures':'#dbeafe',
  'DBMS':           '#fef9c3',
  'Java':           '#ede9fe',
  'Web Technology': '#fce7f3',
  'Web Tech':       '#fce7f3',
  'OS':             '#dbeafe',
  'Networks':       '#fef9c3',
  'Software Engg':  '#ede9fe',
  'AI':             '#fce7f3',
  'Break':          '#f1f5f9',
  '-':              '#f8fafc',
};

const SUBJECT_TEXT = {
  'Mathematics':    '#1d4ed8',
  'C Programming':  '#a16207',
  'English':        '#6d28d9',
  'Physics':        '#be185d',
  'Lab':            '#15803d',
  'Data Structures':'#1d4ed8',
  'DBMS':           '#a16207',
  'Java':           '#6d28d9',
  'Web Technology': '#be185d',
  'Web Tech':       '#be185d',
  'OS':             '#1d4ed8',
  'Networks':       '#a16207',
  'Software Engg':  '#6d28d9',
  'AI':             '#be185d',
  'Break':          '#94a3b8',
  '-':              '#cbd5e1',
};

const TIME_SLOTS = ['9:00–10:00', '10:00–11:00', '11:00–11:30', '11:30–12:30', '12:30–1:30'];

function renderTimetablePage() {
  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">🗓️ Class Timetable</h2>
        <div class="toolbar">
          <select class="form-control" id="ttClassSel" onchange="renderTimetableView()" style="width:130px">
            <option>BTech-1</option>
            <option>BTech-2</option>
            <option>BTech-3</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <div id="timetableView"></div>
      </div>
    </div>
  `;
}

function renderTimetableView() {
  const cls = document.getElementById('ttClassSel')?.value || 'BTech-1';
  const tt = DB.timetable[cls];
  const container = document.getElementById('timetableView');
  if (!container) return;

  const days = Object.keys(tt);
  container.innerHTML = `
    <div class="timetable-wrap">
      <table class="timetable">
        <thead>
          <tr>
            <th>Day / Time</th>
            ${TIME_SLOTS.map(t => `<th>${t}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${days.map(day => `
            <tr>
              <td>${day}</td>
              ${tt[day].map(subj => {
                const bg = SUBJECT_COLORS[subj] || '#f1f5f9';
                const tc = SUBJECT_TEXT[subj] || '#334155';
                if (subj === 'Break') {
                  return `<td style="background:#f1f5f9;color:#94a3b8;font-style:italic;font-size:12px">☕ Break</td>`;
                }
                if (subj === '-') {
                  return `<td style="color:#cbd5e1">—</td>`;
                }
                return `<td><span class="tt-subject" style="background:${bg};color:${tc}">${subj}</span></td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;font-size:12px">
      <strong style="color:var(--text-secondary)">Legend:</strong>
      ${[...new Set(Object.values(tt).flat().filter(s => s !== '-' && s !== 'Break'))].map(subj => {
        const bg = SUBJECT_COLORS[subj] || '#f1f5f9';
        const tc = SUBJECT_TEXT[subj] || '#334155';
        return `<span class="tt-subject" style="background:${bg};color:${tc}">${subj}</span>`;
      }).join('')}
    </div>
  `;
}
