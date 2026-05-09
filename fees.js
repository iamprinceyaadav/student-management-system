// ===== Fees Page =====

function renderFeesPage() {
  return `
    <div class="stats-grid" style="margin-bottom:20px">
      ${renderFeeSummaryCards()}
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">💰 Fee Management</h2>
        <div class="toolbar">
          <select class="form-control" id="feeStatusFilter" onchange="filterFees()" style="width:140px">
            <option value="">All Status</option>
            <option>Paid</option>
            <option>Partial</option>
            <option>Unpaid</option>
          </select>
          <button class="btn btn-primary" onclick="openAddFee()">+ Add Fee Record</button>
        </div>
      </div>
      <div class="card-body" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Tuition</th>
                <th>Hostel</th>
                <th>Exam</th>
                <th>Transport</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="feesBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderFeeSummaryCards() {
  const total = DB.fees.reduce((s, f) => s + f.tuition + f.hostel + f.exam + f.transport, 0);
  const collected = DB.fees.reduce((s, f) => s + f.paid, 0);
  const pending = total - collected;
  const paid = DB.fees.filter(f => f.status === 'Paid').length;
  const unpaid = DB.fees.filter(f => f.status === 'Unpaid').length;
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  return `
    <div class="stat-card stat-blue"><div class="stat-icon">💵</div><div class="stat-info"><div class="stat-label">Total Fees Due</div><div class="stat-value" style="font-size:20px">${fmt(total)}</div></div></div>
    <div class="stat-card stat-green"><div class="stat-icon">✅</div><div class="stat-info"><div class="stat-label">Collected</div><div class="stat-value" style="font-size:20px;color:var(--success)">${fmt(collected)}</div></div></div>
    <div class="stat-card stat-red"><div class="stat-icon">⏳</div><div class="stat-info"><div class="stat-label">Pending</div><div class="stat-value" style="font-size:20px;color:var(--danger)">${fmt(pending)}</div></div></div>
    <div class="stat-card stat-yellow"><div class="stat-icon">📋</div><div class="stat-info"><div class="stat-label">Paid / Unpaid</div><div class="stat-value" style="font-size:20px">${paid} / ${unpaid}</div></div></div>
  `;
}

function renderFeesTable(fees) {
  const tbody = document.getElementById('feesBody');
  if (!tbody) return;
  if (!fees.length) {
    tbody.innerHTML = `<tr><td colspan="11"><div class="empty-state"><div class="icon">💰</div><p>No fee records found</p></div></td></tr>`;
    return;
  }
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  tbody.innerHTML = fees.map(f => {
    const student = getStudentById(f.studentId);
    if (!student) return '';
    const total = f.tuition + f.hostel + f.exam + f.transport;
    const balance = total - f.paid;
    const badge = f.status === 'Paid' ? 'badge-green' : f.status === 'Partial' ? 'badge-yellow' : 'badge-red';
    const pct = calcFeePercent(f);
    return `
      <tr class="fee-row">
        <td>
          <div class="student-name-cell">
            <div class="avatar" style="width:28px;height:28px;font-size:10px">${getInitials(student.name)}</div>
            <span style="font-weight:500">${student.name}</span>
          </div>
        </td>
        <td><span class="badge badge-blue">${student.class}</span></td>
        <td>${fmt(f.tuition)}</td>
        <td>${fmt(f.hostel)}</td>
        <td>${fmt(f.exam)}</td>
        <td>${fmt(f.transport)}</td>
        <td style="font-weight:700">${fmt(total)}</td>
        <td>
          <div>
            <div style="font-weight:600;color:var(--success)">${fmt(f.paid)}</div>
            <div class="progress-bar-wrap" style="width:70px;margin-top:4px">
              <div class="progress-bar" style="width:${pct}%;background:${pct===100?'var(--success)':pct>0?'var(--warning)':'var(--danger)'}"></div>
            </div>
          </div>
        </td>
        <td style="font-weight:600;color:${balance > 0 ? 'var(--danger)' : 'var(--success)'}">${fmt(balance)}</td>
        <td><span class="badge ${badge}">${f.status}</span></td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-primary btn-sm" onclick="openEditFee(${f.id})">Edit</button>
            <button class="btn btn-success btn-sm" onclick="markFeePaid(${f.id})">Mark Paid</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterFees() {
  const status = document.getElementById('feeStatusFilter')?.value || '';
  const filtered = status ? DB.fees.filter(f => f.status === status) : [...DB.fees];
  renderFeesTable(filtered);
}

function openAddFee() {
  openModal('Add Fee Record', feeFormHTML());
}

function openEditFee(id) {
  const f = DB.fees.find(x => x.id === id);
  if (!f) return;
  openModal('Edit Fee Record', feeFormHTML(f));
}

function feeFormHTML(f = {}) {
  return `
    <div class="form-group">
      <label class="form-label">Student *</label>
      <select class="form-control" id="ff_student">
        <option value="">-- Select Student --</option>
        ${DB.students.map(s => `<option value="${s.id}" ${f.studentId === s.id ? 'selected' : ''}>${s.name} (${s.class})</option>`).join('')}
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tuition Fee (₹)</label>
        <input class="form-control" id="ff_tuition" type="number" value="${f.tuition ?? 25000}" />
      </div>
      <div class="form-group">
        <label class="form-label">Hostel Fee (₹)</label>
        <input class="form-control" id="ff_hostel" type="number" value="${f.hostel ?? 0}" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Exam Fee (₹)</label>
        <input class="form-control" id="ff_exam" type="number" value="${f.exam ?? 1500}" />
      </div>
      <div class="form-group">
        <label class="form-label">Transport Fee (₹)</label>
        <input class="form-control" id="ff_transport" type="number" value="${f.transport ?? 0}" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Amount Paid (₹)</label>
        <input class="form-control" id="ff_paid" type="number" value="${f.paid ?? 0}" />
      </div>
      <div class="form-group">
        <label class="form-label">Due Date</label>
        <input class="form-control" id="ff_due" type="date" value="${f.dueDate || '2025-06-30'}" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveFee(${f.id || 0})">${f.id ? 'Update' : 'Save'} Record</button>
    </div>
  `;
}

function getFeeStatus(paid, total) {
  if (paid >= total) return 'Paid';
  if (paid > 0) return 'Partial';
  return 'Unpaid';
}

function saveFee(id) {
  const studentId = parseInt(document.getElementById('ff_student')?.value);
  if (!studentId) { alert('Select a student!'); return; }
  const tuition = parseInt(document.getElementById('ff_tuition').value) || 0;
  const hostel = parseInt(document.getElementById('ff_hostel').value) || 0;
  const exam = parseInt(document.getElementById('ff_exam').value) || 0;
  const transport = parseInt(document.getElementById('ff_transport').value) || 0;
  const paid = parseInt(document.getElementById('ff_paid').value) || 0;
  const total = tuition + hostel + exam + transport;
  const data = { studentId, tuition, hostel, exam, transport, paid, dueDate: document.getElementById('ff_due').value, status: getFeeStatus(paid, total) };
  if (id) {
    const idx = DB.fees.findIndex(f => f.id === id);
    if (idx >= 0) DB.fees[idx] = { ...DB.fees[idx], ...data };
  } else {
    DB.fees.push({ id: DB.nextId++, ...data });
  }
  closeModal();
  filterFees();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
}

function markFeePaid(id) {
  const f = DB.fees.find(x => x.id === id);
  if (!f) return;
  const total = f.tuition + f.hostel + f.exam + f.transport;
  f.paid = total;
  f.status = 'Paid';
  filterFees();
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
}
