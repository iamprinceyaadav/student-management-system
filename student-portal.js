// ===== Student Portal =====

function renderStudentPortal(student) {
  return `
    <div class="portal-header">
      <div class="portal-avatar">${getInitials(student.name)}</div>
      <div>
        <div class="portal-name">${student.name}</div>
        <div class="portal-info">${student.rollNo} &bull; ${student.class} &bull; ${student.gender}</div>
        <div class="portal-info">📧 ${student.email} &bull; 📞 ${student.phone}</div>
      </div>
    </div>

    <div class="portal-tabs">
      <button class="portal-tab active" onclick="switchPortalTab('overview', this)">🏠 Overview</button>
      <button class="portal-tab" onclick="switchPortalTab('profile', this)">👤 My Profile</button>
      <button class="portal-tab" onclick="switchPortalTab('grades', this)">📝 My Grades</button>
      <button class="portal-tab" onclick="switchPortalTab('attendance', this)">📅 Attendance</button>
      <button class="portal-tab" onclick="switchPortalTab('timetable', this)">🗓️ Timetable</button>
      <button class="portal-tab" onclick="switchPortalTab('fees', this)">💰 My Fees</button>
      <button class="portal-tab" onclick="switchPortalTab('idcard', this)">📱 ID Card</button>
      <button class="portal-tab" onclick="switchPortalTab('notices', this)">📢 Notices</button>
    </div>

    <div id="portalContent"></div>
  `;
}

function switchPortalTab(tab, btn) {
  document.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const student = getCurrentStudent();
  const container = document.getElementById('portalContent');
  if (!container || !student) return;
  if (tab === 'overview')   container.innerHTML = portalOverview(student);
  if (tab === 'profile')    container.innerHTML = portalProfile(student);
  if (tab === 'grades')     container.innerHTML = portalGrades(student);
  if (tab === 'attendance') container.innerHTML = portalAttendance(student);
  if (tab === 'timetable')  container.innerHTML = portalTimetable(student);
  if (tab === 'fees')       container.innerHTML = portalFees(student);
  if (tab === 'idcard')     container.innerHTML = portalIdCard(student);
  if (tab === 'notices')    container.innerHTML = portalNotices();
}

function getCurrentStudent() {
  const user = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
  return DB.students.find(s => s.rollNo === user.rollNo);
}

// ==========================================
// 1. OVERVIEW
// ==========================================
function portalOverview(student) {
  const att = calcAttendancePercent(student.id);
  const attColor = att >= 75 ? 'var(--success)' : att >= 60 ? 'var(--warning)' : 'var(--danger)';
  const grades = DB.grades.filter(g => g.studentId === student.id);
  const avgMarks = grades.length ? Math.round(grades.reduce((s, g) => s + g.total, 0) / grades.length) : 0;
  const fee = DB.fees.find(f => f.studentId === student.id);
  const feeTotal = fee ? fee.tuition + fee.hostel + fee.exam + fee.transport : 0;
  const feeBalance = fee ? feeTotal - fee.paid : 0;
  const overallGrade = avgMarks >= 90 ? 'A' : avgMarks >= 75 ? 'B' : avgMarks >= 60 ? 'C' : avgMarks >= 40 ? 'D' : 'F';
  const passed = grades.filter(g => g.total >= 40).length;
  const failed = grades.filter(g => g.total < 40).length;

  return `
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:12px;padding:20px 24px;color:white;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-size:20px;font-weight:700">Welcome back, ${student.name.split(' ')[0]}! 👋</div>
        <div style="font-size:13px;opacity:0.85;margin-top:4px">${student.class} &bull; Roll No: ${student.rollNo} &bull; ${new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      </div>
      <div style="font-size:40px">🎓</div>
    </div>

    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card stat-blue">
        <div class="stat-icon">📅</div>
        <div class="stat-info"><div class="stat-label">Attendance</div><div class="stat-value" style="color:${attColor}">${att}%</div></div>
      </div>
      <div class="stat-card stat-green">
        <div class="stat-icon">📝</div>
        <div class="stat-info"><div class="stat-label">Avg Marks</div><div class="stat-value">${avgMarks}/100</div></div>
      </div>
      <div class="stat-card stat-yellow">
        <div class="stat-icon">🏆</div>
        <div class="stat-info"><div class="stat-label">Overall Grade</div><div class="stat-value">${grades.length ? overallGrade : 'N/A'}</div></div>
      </div>
      <div class="stat-card stat-red">
        <div class="stat-icon">💰</div>
        <div class="stat-info"><div class="stat-label">Fee Balance</div><div class="stat-value" style="font-size:18px;color:${feeBalance>0?'var(--danger)':'var(--success)'}">₹${feeBalance.toLocaleString('en-IN')}</div></div>
      </div>
    </div>

    <div style="margin-bottom:20px">
      ${att < 75 ? `<div style="background:var(--danger-light);border-left:4px solid var(--danger);padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:8px;font-size:13px"><strong>⚠️ Low Attendance!</strong> Your attendance is ${att}%. Minimum 75% required.</div>` : ''}
      ${feeBalance > 0 ? `<div style="background:var(--warning-light);border-left:4px solid var(--warning);padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:8px;font-size:13px"><strong>💰 Fee Pending!</strong> ₹${feeBalance.toLocaleString('en-IN')} is due before ${fee?.dueDate}.</div>` : ''}
      ${failed > 0 ? `<div style="background:var(--danger-light);border-left:4px solid var(--danger);padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:8px;font-size:13px"><strong>❌ Failed Subjects!</strong> You have failed ${failed} subject(s).</div>` : ''}
      ${att >= 75 && feeBalance === 0 && failed === 0 ? `<div style="background:var(--success-light);border-left:4px solid var(--success);padding:12px 16px;border-radius:0 8px 8px 0;font-size:13px"><strong>✅ Great Performance!</strong> Good attendance, no pending fees and no failed subjects!</div>` : ''}
    </div>

    <div class="charts-grid">
      <div class="card">
        <div class="card-header"><h2 class="card-title">📊 Academic Summary</h2></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="background:var(--success-light);padding:12px;border-radius:8px;text-align:center">
              <div style="font-size:24px;font-weight:800;color:var(--success)">${passed}</div>
              <div style="font-size:11px;color:var(--success);font-weight:600">PASSED</div>
            </div>
            <div style="background:var(--danger-light);padding:12px;border-radius:8px;text-align:center">
              <div style="font-size:24px;font-weight:800;color:var(--danger)">${failed}</div>
              <div style="font-size:11px;color:var(--danger);font-weight:600">FAILED</div>
            </div>
          </div>
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>Attendance</span><span style="font-weight:600;color:${attColor}">${att}%</span></div>
            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${att}%;background:${attColor}"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>Average Marks</span><span style="font-weight:600">${avgMarks}%</span></div>
            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${avgMarks}%;background:var(--primary)"></div></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">📝 Recent Grades</h2></div>
        <div class="card-body" style="padding:0">
          ${grades.length === 0
            ? '<div class="empty-state"><div class="icon">📋</div><p>No grades yet</p></div>'
            : grades.slice(0,5).map(g => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--border)">
                <div>
                  <div style="font-weight:500;font-size:13px">${g.subject}</div>
                  <div style="font-size:11px;color:var(--text-muted)">${g.sem}</div>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-weight:600;font-size:13px">${g.total}/100</span>
                  <span class="grade-${g.grade}">${g.grade}</span>
                </div>
              </div>
            `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">📅 Today's Classes</h2></div>
        <div class="card-body">${portalTodayClasses(student)}</div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">💰 Fee Summary</h2></div>
        <div class="card-body">
          ${fee ? `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px"><span style="color:var(--text-secondary)">Total Fee</span><span style="font-weight:600">₹${feeTotal.toLocaleString('en-IN')}</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px"><span style="color:var(--text-secondary)">Paid</span><span style="font-weight:600;color:var(--success)">₹${fee.paid.toLocaleString('en-IN')}</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:13px"><span style="color:var(--text-secondary)">Balance</span><span style="font-weight:700;color:${feeBalance>0?'var(--danger)':'var(--success)'}">₹${feeBalance.toLocaleString('en-IN')}</span></div>
            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${calcFeePercent(fee)}%;background:${feeBalance===0?'var(--success)':'var(--warning)'}"></div></div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:6px">${calcFeePercent(fee)}% paid &bull; <span class="badge ${fee.status==='Paid'?'badge-green':fee.status==='Partial'?'badge-yellow':'badge-red'}">${fee.status}</span></div>
          ` : '<div class="empty-state" style="padding:20px"><p>No fee record found</p></div>'}
        </div>
      </div>
    </div>
  `;
}

function portalTodayClasses(student) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = days[new Date().getDay()];
  const tt = DB.timetable[student.class];
  if (!tt || !tt[today]) return `<p style="color:var(--text-muted);font-size:13px">No classes today (${today}) 🎉</p>`;
  const slots = ['9:00–10:00','10:00–11:00','11:00–11:30','11:30–12:30','12:30–1:30'];
  const colors = {'Mathematics':'#dbeafe','C Programming':'#fef9c3','English':'#ede9fe','Physics':'#fce7f3','Lab':'#dcfce7','Data Structures':'#dbeafe','DBMS':'#fef9c3','Java':'#ede9fe','Web Tech':'#fce7f3','OS':'#dbeafe','Networks':'#fef9c3','Software Engg':'#ede9fe','AI':'#fce7f3'};
  const texts = {'Mathematics':'#1d4ed8','C Programming':'#a16207','English':'#6d28d9','Physics':'#be185d','Lab':'#15803d','Data Structures':'#1d4ed8','DBMS':'#a16207','Java':'#6d28d9','Web Tech':'#be185d','OS':'#1d4ed8','Networks':'#a16207','Software Engg':'#6d28d9','AI':'#be185d'};
  return `<p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">Today: <strong>${today}</strong></p>` +
    tt[today].map((subj, i) => {
      if (subj === '-') return '';
      if (subj === 'Break') return `<div style="padding:8px 12px;background:#f8fafc;border-radius:6px;margin-bottom:6px;font-size:12px;color:var(--text-muted)">☕ ${slots[i]} — Break</div>`;
      return `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:${colors[subj]||'#f1f5f9'};border-radius:6px;margin-bottom:6px"><span style="font-size:11px;color:${texts[subj]||'#334155'};font-weight:600;width:80px">${slots[i]}</span><span style="font-size:13px;font-weight:600;color:${texts[subj]||'#334155'}">${subj}</span></div>`;
    }).join('');
}

// ==========================================
// 2. PROFILE
// ==========================================
function portalProfile(student) {
  const grades = DB.grades.filter(g => g.studentId === student.id);
  const att = calcAttendancePercent(student.id);
  const avg = grades.length ? Math.round(grades.reduce((s,g)=>s+g.total,0)/grades.length) : 0;
  const passed = grades.filter(g=>g.total>=40).length;
  const failed = grades.filter(g=>g.total<40).length;
  const overallGrade = avg>=90?'A':avg>=75?'B':avg>=60?'C':avg>=40?'D':'F';

  return `
    <div class="charts-grid">
      <div class="card">
        <div class="card-header"><h2 class="card-title">👤 Personal Information</h2></div>
        <div class="card-body">
          <div style="text-align:center;margin-bottom:20px">
            <div class="avatar" style="width:72px;height:72px;font-size:26px;margin:0 auto 12px">${getInitials(student.name)}</div>
            <div style="font-size:18px;font-weight:700">${student.name}</div>
            <span class="badge ${student.status==='Active'?'badge-green':'badge-red'}" style="margin-top:6px">${student.status}</span>
          </div>
          <table style="width:100%;font-size:13px">
            <tr><td style="color:var(--text-muted);padding:7px 0;width:45%">📋 Roll Number</td><td style="font-weight:600">${student.rollNo}</td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">🎓 Class</td><td><span class="badge badge-blue">${student.class}</span></td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">👤 Gender</td><td>${student.gender}</td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">🎂 Date of Birth</td><td>${student.dob||'-'}</td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">📍 Address</td><td>${student.address||'-'}</td></tr>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">📞 Contact Information</h2></div>
        <div class="card-body">
          <div style="margin-bottom:16px">
            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px">Student Contact</div>
            <div style="background:var(--bg);padding:12px;border-radius:8px">
              <div style="font-size:13px;margin-bottom:6px">📧 <strong>Email:</strong> ${student.email||'-'}</div>
              <div style="font-size:13px">📞 <strong>Phone:</strong> ${student.phone||'-'}</div>
            </div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px">Guardian Contact</div>
            <div style="background:var(--bg);padding:12px;border-radius:8px">
              <div style="font-size:13px;margin-bottom:6px">👨‍👩‍👦 <strong>Name:</strong> ${student.guardianName||'-'}</div>
              <div style="font-size:13px">📞 <strong>Phone:</strong> ${student.guardianPhone||'-'}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">🎓 Academic Information</h2></div>
        <div class="card-body">
          <table style="width:100%;font-size:13px">
            <tr><td style="color:var(--text-muted);padding:7px 0;width:55%">📚 Total Subjects</td><td style="font-weight:600">${grades.length}</td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">✅ Subjects Passed</td><td style="font-weight:600;color:var(--success)">${passed}</td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">❌ Subjects Failed</td><td style="font-weight:600;color:${failed>0?'var(--danger)':'var(--success)'}">${failed}</td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">📊 Average Marks</td><td style="font-weight:700">${avg}/100</td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">🏆 Overall Grade</td><td><span class="grade-${overallGrade}" style="font-size:18px">${overallGrade}</span></td></tr>
            <tr><td style="color:var(--text-muted);padding:7px 0">📅 Attendance</td><td style="font-weight:700;color:${att>=75?'var(--success)':att>=60?'var(--warning)':'var(--danger)'}">${att}%</td></tr>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2 class="card-title">🔐 Account Info</h2></div>
        <div class="card-body">
          <div style="background:var(--bg);padding:14px;border-radius:8px;margin-bottom:12px">
            <div style="font-size:13px;margin-bottom:6px">🪪 <strong>Username (Roll No):</strong> ${student.rollNo}</div>
            <div style="font-size:13px">🔑 <strong>Password:</strong> student123</div>
          </div>
          <div style="background:var(--primary-light);padding:12px;border-radius:8px;font-size:12px;color:var(--primary)">
            ℹ️ Contact admin to change password or update profile.
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 3. GRADES
// ==========================================
function portalGrades(student) {
  const grades = DB.grades.filter(g => g.studentId === student.id);
  const avg = grades.length ? Math.round(grades.reduce((s,g)=>s+g.total,0)/grades.length) : 0;
  const passed = grades.filter(g=>g.total>=40).length;
  const failed = grades.filter(g=>g.total<40).length;

  return `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card stat-blue"><div class="stat-icon">📚</div><div class="stat-info"><div class="stat-label">Total Subjects</div><div class="stat-value">${grades.length}</div></div></div>
      <div class="stat-card stat-green"><div class="stat-icon">📊</div><div class="stat-info"><div class="stat-label">Average Marks</div><div class="stat-value">${avg}/100</div></div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">✅</div><div class="stat-info"><div class="stat-label">Passed</div><div class="stat-value" style="color:var(--success)">${passed}</div></div></div>
      <div class="stat-card stat-red"><div class="stat-icon">❌</div><div class="stat-info"><div class="stat-label">Failed</div><div class="stat-value" style="color:${failed>0?'var(--danger)':'var(--success)'}">${failed}</div></div></div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <h2 class="card-title">📝 My Grades</h2>
        <button class="btn btn-primary btn-sm" onclick="showResultCard(${student.id})">🖨️ Print Result</button>
      </div>
      <div class="card-body" style="padding:0">
        ${grades.length === 0
          ? '<div class="empty-state"><div class="icon">📋</div><p>No grades found</p></div>'
          : `<div class="table-wrap"><table>
              <thead><tr><th>Subject</th><th>Semester</th><th>Mid</th><th>End</th><th>Total</th><th>Grade</th><th>Result</th></tr></thead>
              <tbody>
                ${grades.map(g=>`
                  <tr>
                    <td style="font-weight:500">${g.subject}</td>
                    <td><span class="badge badge-gray">${g.sem}</span></td>
                    <td style="text-align:center;font-weight:600">${g.mid}</td>
                    <td style="text-align:center;font-weight:600">${g.end}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <div class="progress-bar-wrap" style="width:60px"><div class="progress-bar" style="width:${g.total}%;background:${g.total>=75?'var(--success)':g.total>=60?'var(--primary)':g.total>=40?'var(--warning)':'var(--danger)'}"></div></div>
                        <span style="font-weight:700">${g.total}</span>
                      </div>
                    </td>
                    <td><span class="grade-${g.grade}">${g.grade}</span></td>
                    <td><span class="badge ${g.total>=40?'badge-green':'badge-red'}">${g.total>=40?'Pass':'Fail'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table></div>`}
      </div>
    </div>

    ${grades.length > 0 ? `
    <div class="card">
      <div class="card-header"><h2 class="card-title">📊 Performance Chart</h2></div>
      <div class="card-body">
        ${grades.map(g=>{
          const color = g.total>=75?'var(--success)':g.total>=60?'var(--primary)':g.total>=40?'var(--warning)':'var(--danger)';
          return `<div class="analytics-bar-wrap">
            <div class="bar-label" style="font-size:12px">${g.subject.substring(0,16)}</div>
            <div class="bar-outer"><div class="bar-inner" style="width:${g.total}%;background:${color}"></div></div>
            <div class="bar-value" style="color:${color}">${g.total}</div>
            <span class="grade-${g.grade}">${g.grade}</span>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}
  `;
}

// ==========================================
// 4. ATTENDANCE
// ==========================================
function portalAttendance(student) {
  const month = '2025-01';
  const days = DB.attendance[student.id]?.[month] || [];
  const present = days.filter(v=>v).length;
  const absent = days.length - present;
  const total = days.length;
  const pct = total ? Math.round((present/total)*100) : 0;
  const color = pct>=75?'var(--success)':pct>=60?'var(--warning)':'var(--danger)';
  const needed = Math.max(0, Math.ceil(0.75*total - present));

  return `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card stat-blue"><div class="stat-icon">📅</div><div class="stat-info"><div class="stat-label">Attendance %</div><div class="stat-value" style="color:${color}">${pct}%</div></div></div>
      <div class="stat-card stat-green"><div class="stat-icon">✅</div><div class="stat-info"><div class="stat-label">Present Days</div><div class="stat-value" style="color:var(--success)">${present}</div></div></div>
      <div class="stat-card stat-red"><div class="stat-icon">❌</div><div class="stat-info"><div class="stat-label">Absent Days</div><div class="stat-value" style="color:var(--danger)">${absent}</div></div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">📆</div><div class="stat-info"><div class="stat-label">Total Days</div><div class="stat-value">${total}</div></div></div>
    </div>

    <div class="card">
      <div class="card-header"><h2 class="card-title">📅 Monthly Attendance — ${month}</h2></div>
      <div class="card-body">
        <div class="progress-bar-wrap" style="height:14px;margin-bottom:8px">
          <div class="progress-bar" style="width:${pct}%;background:${color}"></div>
        </div>
        <div style="background:${pct<75?'var(--danger-light)':'var(--success-light)'};padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:16px;color:${pct<75?'var(--danger)':'var(--success)'};font-weight:500">
          ${pct>=75 ? '✅ Good attendance! You are eligible for exams.' : `⚠️ Low attendance! You need ${needed} more days to reach 75%.`}
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">Green = Present | Red = Absent</p>
        <div class="attendance-grid">
          ${days.map((v,i)=>`<div class="att-day ${v?'att-present':'att-absent'}" title="Day ${i+1}">${i+1}</div>`).join('')}
        </div>
        <div style="display:flex;gap:16px;margin-top:12px;font-size:12px">
          <span style="color:var(--success)">🟢 Present: ${present}</span>
          <span style="color:var(--danger)">🔴 Absent: ${absent}</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 5. TIMETABLE
// ==========================================
function portalTimetable(student) {
  const tt = DB.timetable[student.class];
  if (!tt) return '<div class="empty-state"><div class="icon">🗓️</div><p>No timetable found</p></div>';
  const TIME_SLOTS = ['9:00–10:00','10:00–11:00','11:00–11:30','11:30–12:30','12:30–1:30'];
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  const colors = {'Mathematics':'#dbeafe','C Programming':'#fef9c3','English':'#ede9fe','Physics':'#fce7f3','Lab':'#dcfce7','Data Structures':'#dbeafe','DBMS':'#fef9c3','Java':'#ede9fe','Web Tech':'#fce7f3','OS':'#dbeafe','Networks':'#fef9c3','Software Engg':'#ede9fe','AI':'#fce7f3'};
  const texts = {'Mathematics':'#1d4ed8','C Programming':'#a16207','English':'#6d28d9','Physics':'#be185d','Lab':'#15803d','Data Structures':'#1d4ed8','DBMS':'#a16207','Java':'#6d28d9','Web Tech':'#be185d','OS':'#1d4ed8','Networks':'#a16207','Software Engg':'#6d28d9','AI':'#be185d'};

  return `
    <div class="card">
      <div class="card-header"><h2 class="card-title">🗓️ Weekly Timetable — ${student.class}</h2></div>
      <div class="card-body">
        <div class="timetable-wrap">
          <table class="timetable">
            <thead><tr><th>Day</th>${TIME_SLOTS.map(t=>`<th>${t}</th>`).join('')}</tr></thead>
            <tbody>
              ${days.map(day=>{
                const subjects = tt[day]||[];
                const isToday = day===today;
                return `<tr style="${isToday?'background:var(--primary-light);':''}">
                  <td style="${isToday?'color:var(--primary);font-weight:700;':''}">${day}${isToday?' 👈':''}</td>
                  ${subjects.map(subj=>{
                    if(subj==='Break') return `<td style="background:#f1f5f9;color:#94a3b8;font-style:italic;font-size:12px">☕ Break</td>`;
                    if(subj==='-') return `<td style="color:#cbd5e1">—</td>`;
                    return `<td><span class="tt-subject" style="background:${colors[subj]||'#f1f5f9'};color:${texts[subj]||'#334155'}">${subj}</span></td>`;
                  }).join('')}
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-top:10px">👈 Highlighted = Today's classes</p>
      </div>
    </div>
  `;
}

// ==========================================
// 6. FEES
// ==========================================
function portalFees(student) {
  const fee = DB.fees.find(f=>f.studentId===student.id);
  if (!fee) return '<div class="empty-state"><div class="icon">💰</div><p>No fee record found</p></div>';
  const total = fee.tuition+fee.hostel+fee.exam+fee.transport;
  const balance = total-fee.paid;
  const pct = calcFeePercent(fee);
  const badge = fee.status==='Paid'?'badge-green':fee.status==='Partial'?'badge-yellow':'badge-red';

  return `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card stat-blue"><div class="stat-icon">💵</div><div class="stat-info"><div class="stat-label">Total Fee</div><div class="stat-value" style="font-size:18px">₹${total.toLocaleString('en-IN')}</div></div></div>
      <div class="stat-card stat-green"><div class="stat-icon">✅</div><div class="stat-info"><div class="stat-label">Paid</div><div class="stat-value" style="font-size:18px;color:var(--success)">₹${fee.paid.toLocaleString('en-IN')}</div></div></div>
      <div class="stat-card stat-red"><div class="stat-icon">⏳</div><div class="stat-info"><div class="stat-label">Balance</div><div class="stat-value" style="font-size:18px;color:${balance>0?'var(--danger)':'var(--success)'}">₹${balance.toLocaleString('en-IN')}</div></div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">📋</div><div class="stat-info"><div class="stat-label">Status</div><div class="stat-value"><span class="badge ${badge}">${fee.status}</span></div></div></div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">💰 Fee Breakdown</h2>
        <button class="btn btn-primary btn-sm" onclick="showFeeReceipt(${student.id})">🧾 Print Receipt</button>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
          <div style="background:var(--bg);padding:14px;border-radius:8px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Tuition</div><div style="font-size:20px;font-weight:700">₹${fee.tuition.toLocaleString('en-IN')}</div></div>
          <div style="background:var(--bg);padding:14px;border-radius:8px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Hostel</div><div style="font-size:20px;font-weight:700">₹${fee.hostel.toLocaleString('en-IN')}</div></div>
          <div style="background:var(--bg);padding:14px;border-radius:8px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Exam</div><div style="font-size:20px;font-weight:700">₹${fee.exam.toLocaleString('en-IN')}</div></div>
          <div style="background:var(--bg);padding:14px;border-radius:8px"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px">Transport</div><div style="font-size:20px;font-weight:700">₹${fee.transport.toLocaleString('en-IN')}</div></div>
        </div>
        <div class="progress-bar-wrap" style="height:12px;margin-bottom:8px">
          <div class="progress-bar" style="width:${pct}%;background:${pct===100?'var(--success)':'var(--warning)'}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted)">>
          <span>${pct}% paid</span><span>Due: ${fee.dueDate}</span>
        </div>
        ${balance>0
          ? `<div style="background:var(--danger-light);color:var(--danger);padding:10px 14px;border-radius:8px;font-size:13px;margin-top:12px;font-weight:500">⚠️ Please pay ₹${balance.toLocaleString('en-IN')} before ${fee.dueDate}</div>`
          : `<div style="background:var(--success-light);color:var(--success);padding:10px 14px;border-radius:8px;font-size:13px;margin-top:12px;font-weight:500">✅ All fees paid! Thank you.</div>`
        }
      </div>
    </div>
  `;
}

// ==========================================
// 7. ID CARD
// ==========================================
function portalIdCard(student) {
  const att = calcAttendancePercent(student.id);
  return `
    <div style="max-width:400px;margin:0 auto">
      <div class="card">
        <div class="card-header"><h2 class="card-title">📱 My Student ID Card</h2></div>
        <div class="card-body">
          <div class="id-card" id="idCardPrint">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
              <div>
                <div style="font-size:13px;font-weight:700;opacity:0.9">🎓 EduManage College</div>
                <div style="font-size:10px;opacity:0.6">Bhubaneswar, Odisha</div>
              </div>
              <div style="font-size:10px;background:rgba(255,255,255,0.2);padding:3px 8px;border-radius:10px">STUDENT ID</div>
            </div>
            <div class="id-card-avatar">${getInitials(student.name)}</div>
            <div class="id-card-name">${student.name}</div>
            <div class="id-card-row">📋 Roll No: <strong>${student.rollNo}</strong></div>
            <div class="id-card-row">🎓 Class: <strong>${student.class}</strong></div>
            <div class="id-card-row">👤 ${student.gender} &bull; DOB: ${student.dob||'N/A'}</div>
            <div class="id-card-row">📞 ${student.phone}</div>
            <div class="id-card-row">📅 Attendance: <strong>${att}%</strong></div>
            <div class="id-card-footer">Academic Year 2024-25 &bull; Valid till March 2026</div>
          </div>
          <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="window.print()">🖨️ Print ID Card</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 8. NOTICES
// ==========================================
function portalNotices() {
  const notices = typeof NOTICES !== 'undefined' ? NOTICES : [];
  return `
    <div class="card">
      <div class="card-header"><h2 class="card-title">📢 College Notices</h2></div>
      <div class="card-body">
        ${notices.length > 0
          ? notices.map(n=>`
            <div class="notice-item ${n.type}" style="margin-bottom:10px">
              <div class="notice-title">${n.type==='urgent'?'🔴':n.type==='info'?'🔵':n.type==='success'?'🟢':'🟡'} ${n.title}</div>
              <div style="font-size:13px;color:var(--text-secondary);margin:6px 0">${n.msg}</div>
              <div class="notice-meta">📅 ${n.date} &bull; 👤 ${n.author}</div>
            </div>
          `).join('')
          : '<div class="empty-state"><div class="icon">📢</div><p>No notices yet</p></div>'
        }
      </div>
    </div>
  `;
}