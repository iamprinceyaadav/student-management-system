// ===== Attendance Page =====

function renderAttendancePage() {
  const months = ['2025-01', '2025-02', '2025-03'];
  return `
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <h2 class="card-title">📅 Attendance Management</h2>
        <div class="toolbar">
          <select class="form-control" id="attStudentSel" onchange="renderAttendanceView()" style="width:200px">
            ${DB.students.map(s => `<option value="${s.id}">${s.name} (${s.class})</option>`).join('')}
          </select>
          <select class="form-control" id="attMonthSel" onchange="renderAttendanceView()" style="width:140px">
            ${months.map(m => `<option value="${m}">${m}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="card-body" id="attendanceView"></div>
    </div>

    <div class="card">
      <div class="card-header"><h2 class="card-title">📊 Class Attendance Summary</h2></div>
      <div class="card-body" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Roll No</th><th>Student</th><th>Class</th><th>Days Present</th><th>Days Total</th><th>Percentage</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${DB.students.map(s => {
                const pct = calcAttendancePercent(s.id);
                const data = DB.attendance[s.id]?.['2025-01'] || [];
                const present = data.filter(v => v).length;
                const total = data.length;
                const color = pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)';
                const badge = pct >= 75 ? 'badge-green' : pct >= 60 ? 'badge-yellow' : 'badge-red';
                const label = pct >= 75 ? 'Regular' : pct >= 60 ? 'Warning' : 'Low';
                return `
                  <tr>
                    <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:12px">${s.rollNo}</code></td>
                    <td><div class="student-name-cell"><div class="avatar" style="width:28px;height:28px;font-size:10px">${getInitials(s.name)}</div><span style="font-weight:500">${s.name}</span></div></td>
                    <td><span class="badge badge-blue">${s.class}</span></td>
                    <td style="font-weight:600">${present}</td>
                    <td>${total}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <div class="progress-bar-wrap" style="width:80px"><div class="progress-bar" style="width:${pct}%;background:${color}"></div></div>
                        <span style="font-weight:700;color:${color}">${pct}%</span>
                      </div>
                    </td>
                    <td><span class="badge ${badge}">${label}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAttendanceView() {
  const sid = parseInt(document.getElementById('attStudentSel')?.value);
  const month = document.getElementById('attMonthSel')?.value || '2025-01';
  const container = document.getElementById('attendanceView');
  if (!container) return;

  const student = getStudentById(sid);
  if (!student) return;

  if (!DB.attendance[sid]) DB.attendance[sid] = {};
  if (!DB.attendance[sid][month]) {
    DB.attendance[sid][month] = Array(26).fill(1);
  }

  const days = DB.attendance[sid][month];
  const present = days.filter(v => v).length;
  const total = days.length;
  const pct = Math.round((present / total) * 100);

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:24px;margin-bottom:16px;flex-wrap:wrap">
      <div><span style="font-size:12px;color:var(--text-muted)">Student</span><div style="font-weight:600;font-size:15px">${student.name}</div></div>
      <div><span style="font-size:12px;color:var(--text-muted)">Month</span><div style="font-weight:600">${month}</div></div>
      <div><span style="font-size:12px;color:var(--text-muted)">Present</span><div style="font-weight:700;font-size:18px;color:var(--success)">${present}/${total}</div></div>
      <div><span style="font-size:12px;color:var(--text-muted)">Percentage</span><div style="font-weight:700;font-size:18px;color:${pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)'}">${pct}%</div></div>
    </div>
    <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px">Click a day to toggle attendance (🟢 = Present, 🔴 = Absent)</p>
    <div class="attendance-grid">
      ${days.map((v, i) => `
        <div class="att-day ${v ? 'att-present' : 'att-absent'}" title="Day ${i+1}" onclick="toggleAtt(${sid},'${month}',${i})">
          ${i + 1}
        </div>
      `).join('')}
    </div>
    <div style="display:flex;gap:12px;margin-top:12px;font-size:12px">
      <span style="color:var(--success)">● Present</span>
      <span style="color:var(--danger)">● Absent</span>
    </div>
  `;
}

function toggleAtt(sid, month, dayIndex) {
  if (!DB.attendance[sid]) DB.attendance[sid] = {};
  if (!DB.attendance[sid][month]) DB.attendance[sid][month] = Array(26).fill(1);
  DB.attendance[sid][month][dayIndex] ^= 1;
  renderAttendanceView();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
}
