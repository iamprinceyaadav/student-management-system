// ===== ALL FEATURES =====

const NOTICES = [
  { id: 1, title: 'Semester Exam Schedule Released', msg: 'End semester exams will begin from 15th April 2025.', date: '2025-03-20', type: 'urgent', author: 'Principal' },
  { id: 2, title: 'Fee Last Date Reminder', msg: 'Last date for fee submission is 30th June 2025.', date: '2025-03-18', type: 'warning', author: 'Accounts Dept' },
  { id: 3, title: 'Sports Day Event', msg: 'Annual Sports Day will be held on 5th April 2025.', date: '2025-03-15', type: 'info', author: 'Sports Dept' },
  { id: 4, title: 'Library Books Return', msg: 'All issued library books must be returned before 10th April 2025.', date: '2025-03-10', type: 'success', author: 'Librarian' },
];

// ==========================================
// DARK MODE
// ==========================================
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  const btn = document.getElementById('darkToggleBtn');
  if (btn) btn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

function initDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('darkToggleBtn');
    if (btn) btn.textContent = '☀️ Light';
  }
}

// ==========================================
// LOCALSTORAGE
// ==========================================
function saveToLocalStorage() {
  try {
    localStorage.setItem('sms_students', JSON.stringify(DB.students));
    localStorage.setItem('sms_grades', JSON.stringify(DB.grades));
    localStorage.setItem('sms_fees', JSON.stringify(DB.fees));
    localStorage.setItem('sms_attendance', JSON.stringify(DB.attendance));
    localStorage.setItem('sms_nextId', String(DB.nextId));
    showToast('✅ Data saved!');
  } catch(e) {
    showToast('❌ Save failed!');
  }
}

function loadFromLocalStorage() {
  try {
    var s = localStorage.getItem('sms_students');
    var g = localStorage.getItem('sms_grades');
    var f = localStorage.getItem('sms_fees');
    var a = localStorage.getItem('sms_attendance');
    var n = localStorage.getItem('sms_nextId');
    if (s) DB.students   = JSON.parse(s);
    if (g) DB.grades     = JSON.parse(g);
    if (f) DB.fees       = JSON.parse(f);
    if (a) DB.attendance = JSON.parse(a);
    if (n) DB.nextId     = parseInt(n);
  } catch(e) {
    console.log('Load error:', e);
  }
}

function loadFromLocalStorage() {
  try {
    var s = localStorage.getItem('sms_students');
    var g = localStorage.getItem('sms_grades');
    var f = localStorage.getItem('sms_fees');
    var a = localStorage.getItem('sms_attendance');
    var n = localStorage.getItem('sms_nextId');
    if (s) DB.students    = JSON.parse(s);
    if (g) DB.grades      = JSON.parse(g);
    if (f) DB.fees        = JSON.parse(f);
    if (a) DB.attendance  = JSON.parse(a);
    if (n) DB.nextId      = parseInt(n);
  } catch(e) {
    console.log('Load error:', e);
  }
}

function loadFromLocalStorage() {
  try {
    if (localStorage.getItem('sms_students')) DB.students = JSON.parse(localStorage.getItem('sms_students'));
    if (localStorage.getItem('sms_grades')) DB.grades = JSON.parse(localStorage.getItem('sms_grades'));
    if (localStorage.getItem('sms_fees')) DB.fees = JSON.parse(localStorage.getItem('sms_fees'));
    if (localStorage.getItem('sms_attendance')) DB.attendance = JSON.parse(localStorage.getItem('sms_attendance'));
    if (localStorage.getItem('sms_nextId')) DB.nextId = parseInt(localStorage.getItem('sms_nextId'));
  } catch(e) { console.log('localStorage load error:', e); }
}

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e293b;color:white;padding:12px 20px;border-radius:8px;font-size:13px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function getNotifications() {
  const notifs = [];
  DB.students.forEach(s => {
    const att = calcAttendancePercent(s.id);
    if (att < 75) notifs.push({ type: 'danger', icon: '📅', msg: `${s.name} — Attendance ${att}% (Low!)` });
  });
  DB.fees.forEach(f => {
    if (f.status === 'Unpaid') {
      const s = getStudentById(f.studentId);
      if (s) notifs.push({ type: 'warning', icon: '💰', msg: `${s.name} — Fee Unpaid` });
    }
  });
  return notifs;
}

function toggleNotifications() {
  const dd = document.getElementById('notifDropdown');
  if (dd) dd.classList.toggle('open');
}

function renderNotifications() {
  const notifs = getNotifications();
  const badge = document.getElementById('notifBadge');
  const list = document.getElementById('notifList');
  if (badge) {
    badge.textContent = notifs.length;
    badge.style.display = notifs.length ? 'flex' : 'none';
  }
  if (list) {
    list.innerHTML = notifs.length === 0
      ? '<div class="notif-item" style="color:var(--text-muted);text-align:center">✅ No new notifications</div>'
      : notifs.map(n => `<div class="notif-item">${n.icon} ${n.msg}</div>`).join('');
  }
}

// ==========================================
// TOP STUDENTS
// ==========================================
function renderTopStudents() {
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
        <div style="font-weight:600;font-size:13px">${x.student.name}</div>
        <div style="font-size:12px;color:var(--text-muted)">${x.student.rollNo} &bull; ${x.student.class}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:20px;font-weight:800;color:var(--primary)">${x.avg}%</div>
        <div style="font-size:11px;color:var(--text-muted)">${x.count} subjects</div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// BIRTHDAY
// ==========================================
function renderBirthdayBanner() {
  const today = new Date();
  const bdays = DB.students.filter(s => {
    if (!s.dob) return false;
    const d = new Date(s.dob);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  });
  if (!bdays.length) return '';
  return `
    <div style="background:linear-gradient(135deg,#fbbf24,#f59e0b);border-radius:10px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
      <span style="font-size:28px">🎂</span>
      <div>
        <div style="font-weight:700;color:#1c1917">Today's Birthdays!</div>
        <div style="font-size:13px;color:#44403c">${bdays.map(s => s.name).join(', ')}</div>
      </div>
    </div>
  `;
}

// ==========================================
// RESULT CARD
// ==========================================
function showResultCard(studentId) {
  const s = getStudentById(studentId);
  if (!s) return;
  const grades = DB.grades.filter(g => g.studentId === studentId);
  const total = grades.reduce((sum, g) => sum + g.total, 0);
  const avg = grades.length ? Math.round(total / grades.length) : 0;
  const overallGrade = avg >= 90 ? 'A' : avg >= 75 ? 'B' : avg >= 60 ? 'C' : avg >= 40 ? 'D' : 'F';
  const att = calcAttendancePercent(studentId);

  openModal('📊 Result Card', `
    <div id="resultCardPrint" style="padding:8px">
      <div style="text-align:center;border-bottom:3px double #2563eb;padding-bottom:16px;margin-bottom:20px">
        <div style="font-size:22px;font-weight:800;color:#1e293b">🎓 EduManage College</div>
        <div style="font-size:12px;color:#64748b">Bhubaneswar, Odisha | Academic Year 2024-25</div>
        <div style="display:inline-block;background:#2563eb;color:white;padding:5px 20px;border-radius:20px;margin-top:8px;font-size:14px;font-weight:700">STUDENT RESULT CARD</div>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:20px;align-items:center">
        <div class="avatar" style="width:56px;height:56px;font-size:20px">${getInitials(s.name)}</div>
        <div>
          <div style="font-size:17px;font-weight:700">${s.name}</div>
          <div style="font-size:13px;color:var(--text-secondary)">${s.rollNo} &bull; ${s.class}</div>
          <div style="font-size:13px;color:var(--text-secondary)">Attendance: <strong style="color:${att>=75?'var(--success)':'var(--danger)'}">${att}%</strong></div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">
        <thead>
          <tr style="background:#2563eb;color:white">
            <th style="padding:10px;text-align:left">Subject</th>
            <th style="padding:10px;text-align:center">Sem</th>
            <th style="padding:10px;text-align:center">Mid</th>
            <th style="padding:10px;text-align:center">End</th>
            <th style="padding:10px;text-align:center">Total</th>
            <th style="padding:10px;text-align:center">Grade</th>
            <th style="padding:10px;text-align:center">Result</th>
          </tr>
        </thead>
        <tbody>
          ${grades.length === 0
            ? '<tr><td colspan="7" style="text-align:center;padding:16px;color:#94a3b8">No grades recorded</td></tr>'
            : grades.map(g => `
              <tr style="border-bottom:1px solid #e2e8f0">
                <td style="padding:9px 10px;font-weight:500">${g.subject}</td>
                <td style="padding:9px 10px;text-align:center">${g.sem}</td>
                <td style="padding:9px 10px;text-align:center">${g.mid}</td>
                <td style="padding:9px 10px;text-align:center">${g.end}</td>
                <td style="padding:9px 10px;text-align:center;font-weight:700">${g.total}</td>
                <td style="padding:9px 10px;text-align:center;font-weight:700;color:${g.grade==='A'?'#16a34a':g.grade==='B'?'#2563eb':g.grade==='C'?'#d97706':g.grade==='F'?'#dc2626':'#ea580c'}">${g.grade}</td>
                <td style="padding:9px 10px;text-align:center;font-weight:600;color:${g.total>=40?'#16a34a':'#dc2626'}">${g.total>=40?'Pass':'Fail'}</td>
              </tr>
            `).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:space-between;background:var(--bg);padding:14px 16px;border-radius:8px;flex-wrap:wrap;gap:12px">
        <div><div style="font-size:11px;color:var(--text-muted)">Total Marks</div><div style="font-weight:700;font-size:16px">${total}/${grades.length*100}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">Average</div><div style="font-weight:700;font-size:16px">${avg}%</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">Overall Grade</div><div style="font-weight:700;font-size:20px" class="grade-${overallGrade}">${overallGrade}</div></div>
        <div><div style="font-size:11px;color:var(--text-muted)">Final Result</div><div style="font-weight:700;font-size:16px;color:${avg>=40?'var(--success)':'var(--danger)'}">${avg>=40?'✅ PASS':'❌ FAIL'}</div></div>
      </div>
    </div>
    <div class="modal-footer no-print">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print</button>
    </div>
  `);
}

// ==========================================
// FEE RECEIPT
// ==========================================
function showFeeReceipt(studentId) {
  const s = getStudentById(studentId);
  const fee = DB.fees.find(f => f.studentId === studentId);
  if (!s || !fee) return;
  const total = fee.tuition + fee.hostel + fee.exam + fee.transport;
  const receiptNo = 'RCP' + String(studentId).padStart(4, '0') + '2025';
  const today = new Date().toLocaleDateString('en-IN');

  openModal('🧾 Fee Receipt', `
    <div id="receiptPrint" style="padding:8px">
      <div style="text-align:center;border-bottom:2px solid #2563eb;padding-bottom:16px;margin-bottom:16px">
        <div style="font-size:22px;font-weight:800;color:#1e293b">🎓 EduManage College</div>
        <div style="font-size:12px;color:#64748b">Bhubaneswar, Odisha</div>
        <div style="font-size:15px;font-weight:700;margin-top:8px">FEE PAYMENT RECEIPT</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:13px">
        <div><b>Receipt No:</b> ${receiptNo}</div>
        <div><b>Date:</b> ${today}</div>
      </div>
      <div style="background:var(--bg);padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px">
        <div style="margin-bottom:4px"><b>Student:</b> ${s.name}</div>
        <div style="margin-bottom:4px"><b>Roll No:</b> ${s.rollNo}</div>
        <div><b>Class:</b> ${s.class}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
        <thead><tr style="background:#2563eb;color:white"><th style="padding:8px;text-align:left">Fee Type</th><th style="padding:8px;text-align:right">Amount</th></tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #e2e8f0"><td style="padding:8px">Tuition Fee</td><td style="padding:8px;text-align:right">₹${fee.tuition.toLocaleString('en-IN')}</td></tr>
          ${fee.hostel ? `<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:8px">Hostel Fee</td><td style="padding:8px;text-align:right">₹${fee.hostel.toLocaleString('en-IN')}</td></tr>` : ''}
          ${fee.exam ? `<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:8px">Exam Fee</td><td style="padding:8px;text-align:right">₹${fee.exam.toLocaleString('en-IN')}</td></tr>` : ''}
          ${fee.transport ? `<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:8px">Transport Fee</td><td style="padding:8px;text-align:right">₹${fee.transport.toLocaleString('en-IN')}</td></tr>` : ''}
          <tr style="background:var(--bg);font-weight:700"><td style="padding:8px">Total</td><td style="padding:8px;text-align:right">₹${total.toLocaleString('en-IN')}</td></tr>
          <tr style="color:var(--success);font-weight:700"><td style="padding:8px">Amount Paid</td><td style="padding:8px;text-align:right">₹${fee.paid.toLocaleString('en-IN')}</td></tr>
          <tr style="font-weight:700;color:${fee.paid<total?'var(--danger)':'var(--success)'}"><td style="padding:8px">Balance</td><td style="padding:8px;text-align:right">₹${(total-fee.paid).toLocaleString('en-IN')}</td></tr>
        </tbody>
      </table>
      <div style="text-align:center;font-size:12px;color:var(--text-muted);border-top:1px dashed var(--border);padding-top:12px">
        Status: <strong>${fee.status}</strong> &bull; Due: ${fee.dueDate} &bull; Thank you!
      </div>
    </div>
    <div class="modal-footer no-print">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print</button>
    </div>
  `);
}

// ==========================================
// ID CARD
// ==========================================
function showIdCard(studentId) {
  const s = getStudentById(studentId);
  if (!s) return;
  openModal('📱 Student ID Card', `
    <div style="padding:16px">
      <div class="id-card" id="idCardPrint">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
          <div>
            <div style="font-size:13px;font-weight:700;opacity:0.9">🎓 EduManage College</div>
            <div style="font-size:10px;opacity:0.6">Bhubaneswar, Odisha</div>
          </div>
          <div style="font-size:10px;background:rgba(255,255,255,0.2);padding:3px 8px;border-radius:10px">STUDENT ID</div>
        </div>
        <div class="id-card-avatar">${getInitials(s.name)}</div>
        <div class="id-card-name">${s.name}</div>
        <div class="id-card-row">📋 Roll No: <strong>${s.rollNo}</strong></div>
        <div class="id-card-row">🎓 Class: <strong>${s.class}</strong></div>
        <div class="id-card-row">👤 ${s.gender} &bull; DOB: ${s.dob||'N/A'}</div>
        <div class="id-card-row">📞 ${s.phone}</div>
        <div class="id-card-footer">Academic Year 2024-25 &bull; Valid till March 2026</div>
      </div>
    </div>
    <div class="modal-footer no-print">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print</button>
    </div>
  `);
}

// ==========================================
// ADVANCED SEARCH
// ==========================================
function renderAdvancedSearch() {
  return `
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><h2 class="card-title">🔍 Advanced Search</h2></div>
      <div class="card-body">
        <div class="form-row" style="margin-bottom:12px">
          <div class="form-group">
            <label class="form-label">Name / Roll No / Email</label>
            <input class="form-control" id="advSearch" placeholder="Type to search..." oninput="doAdvancedSearch()" />
          </div>
          <div class="form-group">
            <label class="form-label">Class</label>
            <select class="form-control" id="advClass" onchange="doAdvancedSearch()">
              <option value="">All Classes</option>
              <option>BTech-1</option><option>BTech-2</option><option>BTech-3</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select class="form-control" id="advGender" onchange="doAdvancedSearch()">
              <option value="">All</option><option>Male</option><option>Female</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-control" id="advStatus" onchange="doAdvancedSearch()">
              <option value="">All</option><option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div id="advSearchResults"></div>
  `;
}

function doAdvancedSearch() {
  const q = document.getElementById('advSearch')?.value.toLowerCase() || '';
  const cls = document.getElementById('advClass')?.value || '';
  const gender = document.getElementById('advGender')?.value || '';
  const status = document.getElementById('advStatus')?.value || '';
  const results = DB.students.filter(s => {
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    return matchQ && (!cls || s.class===cls) && (!gender || s.gender===gender) && (!status || s.status===status);
  });
  const container = document.getElementById('advSearchResults');
  if (!container) return;
  if (!results.length) { container.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><p>No students found</p></div>'; return; }
  container.innerHTML = `
    <div class="card">
      <div class="card-header"><h2 class="card-title">Results (${results.length} found)</h2></div>
      <div class="card-body" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Roll No</th><th>Student</th><th>Class</th><th>Status</th><th>Attendance</th><th>Actions</th></tr></thead>
            <tbody>
              ${results.map(s => {
                const att = calcAttendancePercent(s.id);
                const attColor = att>=75?'var(--success)':att>=60?'var(--warning)':'var(--danger)';
                return `<tr>
                  <td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:12px">${s.rollNo}</code></td>
                  <td><div class="student-name-cell"><div class="avatar" style="width:28px;height:28px;font-size:10px">${getInitials(s.name)}</div><span style="font-weight:500">${s.name}</span></div></td>
                  <td><span class="badge badge-blue">${s.class}</span></td>
                  <td><span class="badge ${s.status==='Active'?'badge-green':'badge-red'}">${s.status}</span></td>
                  <td><span style="font-weight:600;color:${attColor}">${att}%</span></td>
                  <td><div style="display:flex;gap:6px">
                    <button class="btn btn-secondary btn-sm" onclick="showResultCard(${s.id})">📊 Result</button>
                    <button class="btn btn-primary btn-sm" onclick="showIdCard(${s.id})">📱 ID</button>
                  </div></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// ANALYTICS
// ==========================================
function renderAnalyticsPage() {
  const totalStudents = DB.students.length;
  const maleCount = DB.students.filter(s=>s.gender==='Male').length;
  const femaleCount = DB.students.filter(s=>s.gender==='Female').length;
  const classCount = {};
  DB.students.forEach(s => { classCount[s.class] = (classCount[s.class]||0)+1; });
  const gradeCount = {A:0,B:0,C:0,D:0,F:0};
  DB.grades.forEach(g => { if(gradeCount[g.grade]!==undefined) gradeCount[g.grade]++; });
  const feeCollected = DB.fees.reduce((s,f)=>s+f.paid,0);
  const feeTotal = DB.fees.reduce((s,f)=>s+f.tuition+f.hostel+f.exam+f.transport,0);
  const avgAtt = Math.round(DB.students.reduce((s,st)=>s+calcAttendancePercent(st.id),0)/totalStudents);

  return `
    <div class="stats-grid" style="margin-bottom:24px">
      <div class="stat-card stat-blue"><div class="stat-icon">🎓</div><div class="stat-info"><div class="stat-label">Total Students</div><div class="stat-value">${totalStudents}</div></div></div>
      <div class="stat-card stat-green"><div class="stat-icon">📅</div><div class="stat-info"><div class="stat-label">Avg Attendance</div><div class="stat-value">${avgAtt}%</div></div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">💰</div><div class="stat-info"><div class="stat-label">Fee Collected</div><div class="stat-value" style="font-size:18px">₹${(feeCollected/1000).toFixed(0)}K</div></div></div>
      <div class="stat-card stat-red"><div class="stat-icon">📝</div><div class="stat-info"><div class="stat-label">Total Grades</div><div class="stat-value">${DB.grades.length}</div></div></div>
    </div>
    <div class="charts-grid">
      <div class="card">
        <div class="card-header"><h2 class="card-title">👥 Gender Distribution</h2></div>
        <div class="card-body">
          <div class="analytics-bar-wrap"><div class="bar-label">Male</div><div class="bar-outer"><div class="bar-inner" style="width:${Math.round(maleCount/totalStudents*100)}%;background:var(--primary)"></div></div><div class="bar-value">${maleCount}</div></div>
          <div class="analytics-bar-wrap"><div class="bar-label">Female</div><div class="bar-outer"><div class="bar-inner" style="width:${Math.round(femaleCount/totalStudents*100)}%;background:#ec4899"></div></div><div class="bar-value">${femaleCount}</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2 class="card-title">🏫 Class-wise Students</h2></div>
        <div class="card-body">
          ${Object.entries(classCount).map(([cls,count])=>`
            <div class="analytics-bar-wrap">
              <div class="bar-label">${cls}</div>
              <div class="bar-outer"><div class="bar-inner" style="width:${Math.round(count/totalStudents*100)}%;background:var(--primary)"></div></div>
              <div class="bar-value">${count}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2 class="card-title">📊 Grade Distribution</h2></div>
        <div class="card-body">
          ${Object.entries(gradeCount).map(([grade,count])=>{
            const max=Math.max(...Object.values(gradeCount))||1;
            const colors={A:'var(--success)',B:'var(--primary)',C:'var(--warning)',D:'orange',F:'var(--danger)'};
            return `<div class="analytics-bar-wrap">
              <div class="bar-label">Grade ${grade}</div>
              <div class="bar-outer"><div class="bar-inner" style="width:${Math.round(count/max*100)}%;background:${colors[grade]}"></div></div>
              <div class="bar-value" style="color:${colors[grade]}">${count}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2 class="card-title">🏆 Top Students</h2></div>
        <div class="card-body">${renderTopStudents()}</div>
      </div>
    </div>
  `;
}

// ==========================================
// PROGRESS REPORT
// ==========================================
function renderProgressReport() {
  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">📈 Student Progress Report</h2>
        <select class="form-control" id="progressStudent" onchange="renderProgressChart()" style="width:200px">
          <option value="">-- Select Student --</option>
          ${DB.students.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}
        </select>
      </div>
      <div class="card-body" id="progressBody">
        <div class="empty-state"><div class="icon">📈</div><p>Select a student to view progress</p></div>
      </div>
    </div>
  `;
}

function renderProgressChart() {
  const id = parseInt(document.getElementById('progressStudent')?.value);
  const container = document.getElementById('progressBody');
  if (!id || !container) return;
  const s = getStudentById(id);
  const grades = DB.grades.filter(g=>g.studentId===id);
  const att = calcAttendancePercent(id);
  const avg = grades.length ? Math.round(grades.reduce((sum,g)=>sum+g.total,0)/grades.length) : 0;
  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card stat-blue" style="flex:1"><div class="stat-icon">📝</div><div class="stat-info"><div class="stat-label">Avg Marks</div><div class="stat-value">${avg}%</div></div></div>
      <div class="stat-card stat-green" style="flex:1"><div class="stat-icon">📅</div><div class="stat-info"><div class="stat-label">Attendance</div><div class="stat-value">${att}%</div></div></div>
      <div class="stat-card stat-yellow" style="flex:1"><div class="stat-icon">📚</div><div class="stat-info"><div class="stat-label">Subjects</div><div class="stat-value">${grades.length}</div></div></div>
    </div>
    ${grades.length===0 ? '<p style="color:var(--text-muted)">No grades recorded yet</p>' :
      grades.map(g=>{
        const color=g.total>=75?'var(--success)':g.total>=60?'var(--primary)':g.total>=40?'var(--warning)':'var(--danger)';
        return `<div class="analytics-bar-wrap">
          <div class="bar-label">${g.subject.substring(0,15)}</div>
          <div class="bar-outer"><div class="bar-inner" style="width:${g.total}%;background:${color}"></div></div>
          <div class="bar-value" style="color:${color}">${g.total}</div>
          <span class="grade-${g.grade}">${g.grade}</span>
        </div>`;
      }).join('')
    }
  `;
}

// ==========================================
// NOTICE BOARD
// ==========================================
function renderNoticeBoardPage() {
  return `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">📧 Notice Board</h2>
        <button class="btn btn-primary" onclick="openAddNotice()">+ Add Notice</button>
      </div>
      <div class="card-body" id="noticeList">
        ${renderNotices()}
      </div>
    </div>
  `;
}

function renderNotices() {
  return NOTICES.map(n=>`
    <div class="notice-item ${n.type}" style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="notice-title">${n.type==='urgent'?'🔴':n.type==='info'?'🔵':n.type==='success'?'🟢':'🟡'} ${n.title}</div>
        <button class="btn btn-danger btn-sm" onclick="deleteNotice(${n.id})">✕</button>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);margin:6px 0">${n.msg}</div>
      <div class="notice-meta">📅 ${n.date} &bull; 👤 ${n.author}</div>
    </div>
  `).join('');
}

function openAddNotice() {
  openModal('Add Notice', `
    <div class="form-group"><label class="form-label">Title *</label><input class="form-control" id="nt_title" placeholder="Notice title" /></div>
    <div class="form-group"><label class="form-label">Message *</label><textarea class="form-control" id="nt_msg" rows="3" placeholder="Notice details..."></textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Type</label>
        <select class="form-control" id="nt_type">
          <option value="urgent">🔴 Urgent</option>
          <option value="warning">🟡 Warning</option>
          <option value="info">🔵 Info</option>
          <option value="success">🟢 General</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Author</label><input class="form-control" id="nt_author" value="Admin" /></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNotice()">Post Notice</button>
    </div>
  `);
}

function saveNotice() {
  const title = document.getElementById('nt_title')?.value.trim();
  const msg = document.getElementById('nt_msg')?.value.trim();
  if (!title || !msg) { alert('Title and message required!'); return; }
  NOTICES.unshift({ id: Date.now(), title, msg, type: document.getElementById('nt_type').value, author: document.getElementById('nt_author').value||'Admin', date: new Date().toISOString().split('T')[0] });
  closeModal();
  const nl = document.getElementById('noticeList');
  if (nl) nl.innerHTML = renderNotices();
}

function deleteNotice(id) {
  if (!confirm('Delete this notice?')) return;
  const idx = NOTICES.findIndex(n=>n.id===id);
  if (idx>=0) NOTICES.splice(idx,1);
  const nl = document.getElementById('noticeList');
  if (nl) nl.innerHTML = renderNotices();
}