// ===== Dashboard Page =====

function renderDashboardPage() {
  try {
    const totalStudents = DB.students.length;
    const activeStudents = DB.students.filter(s => s.status === 'Active').length;
    const avgAtt = Math.round(
      DB.students.reduce((s, st) => s + calcAttendancePercent(st.id), 0) / totalStudents
    );
    const feeCollected = DB.fees.reduce((s, f) => s + f.paid, 0);
    const feeTotal = DB.fees.reduce((s, f) => s + f.tuition + f.hostel + f.exam + f.transport, 0);
    const feePercent = Math.round((feeCollected / feeTotal) * 100);
    const gradeCount = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    DB.grades.forEach(g => { if (gradeCount[g.grade] !== undefined) gradeCount[g.grade]++; });
    const recentStudents = [...DB.students].slice(-4).reverse();

    return `
      <div class="stats-grid">
        <div class="stat-card stat-blue">
          <div class="stat-icon">🎓</div>
          <div class="stat-info">
            <div class="stat-label">Total Students</div>
            <div class="stat-value">${totalStudents}</div>
          </div>
        </div>
        <div class="stat-card stat-green">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-label">Active Students</div>
            <div class="stat-value">${activeStudents}</div>
          </div>
        </div>
        <div class="stat-card stat-yellow">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-label">Avg Attendance</div>
            <div class="stat-value">${avgAtt}%</div>
          </div>
        </div>
        <div class="stat-card stat-red">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-label">Fee Collection</div>
            <div class="stat-value">${feePercent}%</div>
          </div>
        </div>
      </div>

      <div class="charts-grid">

        <div class="card">
          <div class="card-header"><h2 class="card-title">📅 Attendance Overview</h2></div>
          <div class="card-body">
            ${DB.students.map(s => {
              const pct = calcAttendancePercent(s.id);
              const color = pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)';
              return `
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                  <div style="width:90px;font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name.split(' ')[0]}</div>
                  <div class="progress-bar-wrap" style="flex:1">
                    <div class="progress-bar" style="width:${pct}%;background:${color}"></div>
                  </div>
                  <span style="font-size:12px;font-weight:600;color:${color};width:36px;text-align:right">${pct}%</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2 class="card-title">📊 Grade Distribution</h2></div>
          <div class="card-body">
            ${Object.entries(gradeCount).map(([grade, count]) => {
              const max = Math.max(...Object.values(gradeCount)) || 1;
              const pct = Math.round((count / max) * 100);
              const colors = { A: 'var(--success)', B: 'var(--primary)', C: 'var(--warning)', D: 'orange', F: 'var(--danger)' };
              return `
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
                  <span style="font-weight:700;width:20px;color:${colors[grade]}">${grade}</span>
                  <div class="progress-bar-wrap" style="flex:1">
                    <div class="progress-bar" style="width:${pct}%;background:${colors[grade]}"></div>
                  </div>
                  <span style="font-size:12px;font-weight:600;width:20px;text-align:right">${count}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2 class="card-title">💳 Fee Collection Status</h2></div>
          <div class="card-body">
            <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
              <div style="background:var(--success-light);padding:12px 16px;border-radius:8px;flex:1;text-align:center">
                <div style="font-size:22px;font-weight:700;color:var(--success)">${DB.fees.filter(f => f.status === 'Paid').length}</div>
                <div style="font-size:11px;color:var(--success);font-weight:600">PAID</div>
              </div>
              <div style="background:var(--warning-light);padding:12px 16px;border-radius:8px;flex:1;text-align:center">
                <div style="font-size:22px;font-weight:700;color:var(--warning)">${DB.fees.filter(f => f.status === 'Partial').length}</div>
                <div style="font-size:11px;color:var(--warning);font-weight:600">PARTIAL</div>
              </div>
              <div style="background:var(--danger-light);padding:12px 16px;border-radius:8px;flex:1;text-align:center">
                <div style="font-size:22px;font-weight:700;color:var(--danger)">${DB.fees.filter(f => f.status === 'Unpaid').length}</div>
                <div style="font-size:11px;color:var(--danger);font-weight:600">UNPAID</div>
              </div>
            </div>
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">
              Overall: <strong>${feePercent}%</strong> collected
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar" style="width:${feePercent}%;background:var(--success)"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-top:4px">
              <span>₹${feeCollected.toLocaleString('en-IN')} collected</span>
              <span>₹${feeTotal.toLocaleString('en-IN')} total</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">🆕 Recent Students</h2>
            <button class="btn btn-secondary btn-sm" onclick="navigateTo('students')">View All</button>
          </div>
          <div class="card-body" style="padding:0">
            ${recentStudents.map(s => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)">
                <div class="avatar">${getInitials(s.name)}</div>
                <div style="flex:1">
                  <div style="font-weight:500;font-size:13px">${s.name}</div>
                  <div style="font-size:12px;color:var(--text-muted)">${s.rollNo} &bull; ${s.class}</div>
                </div>
                <span class="badge ${s.status === 'Active' ? 'badge-green' : 'badge-red'}">${s.status}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2 class="card-title">🏆 Top 3 Students</h2></div>
          <div class="card-body">
            ${renderTopStudentsLocal()}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2 class="card-title">⚠️ Low Attendance Alert</h2></div>
          <div class="card-body" style="padding:0">
            ${DB.students.filter(s => calcAttendancePercent(s.id) < 75).map(s => {
              const att = calcAttendancePercent(s.id);
              return `
                <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)">
                  <div class="avatar" style="background:var(--danger-light);color:var(--danger)">${getInitials(s.name)}</div>
                  <div style="flex:1">
                    <div style="font-weight:500">${s.name}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${s.class}</div>
                  </div>
                  <span style="font-weight:700;color:var(--danger)">${att}%</span>
                </div>
              `;
            }).join('') || '<div class="empty-state" style="padding:24px"><div class="icon">✅</div><p>All students have good attendance!</p></div>'}
          </div>
        </div>

      </div>
    `;
  } catch(e) {
    return `<div style="padding:20px;color:red">Dashboard Error: ${e.message}</div>`;
  }
}

function renderTopStudentsLocal() {
  const studentAvg = DB.students.map(s => {
    const grades = DB.grades.filter(g => g.studentId === s.id);
    const avg = grades.length ? Math.round(grades.reduce((sum, g) => sum + g.total, 0) / grades.length) : 0;
    return { student: s, avg, count: grades.length };
  }).filter(x => x.count > 0).sort((a, b) => b.avg - a.avg).slice(0, 3);

  if (!studentAvg.length) return '<div class="empty-state"><div class="icon">🏆</div><p>No grade data yet</p></div>';

  const medals = ['🥇', '🥈', '🥉'];
  return studentAvg.map((x, i) => `
    <div style="display:flex;align-items:center;gap:14px;padding:12px;background:var(--bg);border-radius:10px;margin-bottom:10px">
      <span style="font-size:28px">${medals[i]}</span>
      <div class="avatar">${getInitials(x.student.name)}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:13.5px">${x.student.name}</div>
        <div style="font-size:12px;color:var(--text-muted)">${x.student.rollNo} &bull; ${x.student.class}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:20px;font-weight:800;color:var(--primary)">${x.avg}%</div>
        <div style="font-size:11px;color:var(--text-muted)">${x.count} subjects</div>
      </div>
    </div>
  `).join('');
}