function renderStudentsPage() {
  return '<div class="card">' +
    '<div class="card-header">' +
      '<h2 class="card-title">👨‍🎓 All Students</h2>' +
      '<div class="toolbar">' +
        '<div class="search-bar"><input type="text" id="studentSearch" placeholder="Search students..." oninput="filterStudents()" /></div>' +
        '<select class="form-control" id="classFilter" onchange="filterStudents()" style="width:130px">' +
          '<option value="">All Classes</option>' +
          '<option>BTech-1</option><option>BTech-2</option><option>BTech-3</option>' +
        '</select>' +
        '<button class="btn btn-primary" onclick="openAddStudent()">+ Add Student</button>' +
      '</div>' +
    '</div>' +
    '<div class="card-body" style="padding:0">' +
      '<div class="table-wrap">' +
        '<table>' +
          '<thead><tr>' +
            '<th>Roll No</th><th>Student</th><th>Class</th>' +
            '<th>Phone</th><th>Gender</th><th>Attendance</th>' +
            '<th>Status</th><th>Actions</th>' +
          '</tr></thead>' +
          '<tbody id="studentsBody"></tbody>' +
        '</table>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderStudentsTable(students) {
  var tbody = document.getElementById('studentsBody');
  if (!tbody) return;
  if (!students || students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="icon">🔍</div><p>No students found</p></div></td></tr>';
    return;
  }
  var html = '';
  for (var i = 0; i < students.length; i++) {
    var s = students[i];
    var att = calcAttendancePercent(s.id);
    var attColor = att >= 75 ? 'var(--success)' : att >= 60 ? 'var(--warning)' : 'var(--danger)';
    html += '<tr>' +
      '<td><code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:12px">' + s.rollNo + '</code></td>' +
      '<td><div class="student-name-cell"><div class="avatar">' + getInitials(s.name) + '</div>' +
        '<div><span style="font-weight:500">' + s.name + '</span>' +
        '<div style="font-size:11.5px;color:var(--text-muted)">' + s.email + '</div></div></div></td>' +
      '<td><span class="badge badge-blue">' + s.class + '</span></td>' +
      '<td>' + s.phone + '</td>' +
      '<td>' + s.gender + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:8px">' +
        '<div class="progress-bar-wrap" style="width:60px">' +
          '<div class="progress-bar" style="width:' + att + '%;background:' + attColor + '"></div>' +
        '</div>' +
        '<span style="font-size:12px;font-weight:600;color:' + attColor + '">' + att + '%</span>' +
      '</div></td>' +
      '<td><span class="badge ' + (s.status === 'Active' ? 'badge-green' : 'badge-red') + '">' + s.status + '</span></td>' +
      '<td><div style="display:flex;gap:6px">' +
        '<button class="btn btn-secondary btn-sm" onclick="viewStudent(' + s.id + ')">View</button>' +
        '<button class="btn btn-primary btn-sm" onclick="openEditStudent(' + s.id + ')">Edit</button>' +
        '<button class="btn btn-danger btn-sm" onclick="deleteStudent(' + s.id + ')">Del</button>' +
      '</div></td>' +
    '</tr>';
  }
  tbody.innerHTML = html;
}

function filterStudents() {
  var q = (document.getElementById('studentSearch') ? document.getElementById('studentSearch').value.toLowerCase() : '');
  var cls = (document.getElementById('classFilter') ? document.getElementById('classFilter').value : '');
  var filtered = DB.students.filter(function(s) {
    var matchQ = s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    var matchCls = cls ? s.class === cls : true;
    return matchQ && matchCls;
  });
  renderStudentsTable(filtered);
}

function openAddStudent() {
  openModal('Add New Student', studentFormHTML({}));
}

function openEditStudent(id) {
  var s = getStudentById(id);
  if (!s) return;
  openModal('Edit Student', studentFormHTML(s));
}

function studentFormHTML(s) {
  return '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Full Name *</label>' +
    '<input class="form-control" id="f_name" value="' + (s.name||'') + '" placeholder="Enter full name" /></div>' +
    '<div class="form-group"><label class="form-label">Roll Number *</label>' +
    '<input class="form-control" id="f_roll" value="' + (s.rollNo||'') + '" placeholder="e.g. COL009" /></div>' +
  '</div>' +
  '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Email</label>' +
    '<input class="form-control" id="f_email" type="email" value="' + (s.email||'') + '" placeholder="email@edu.com" /></div>' +
    '<div class="form-group"><label class="form-label">Phone</label>' +
    '<input class="form-control" id="f_phone" value="' + (s.phone||'') + '" placeholder="10-digit mobile" /></div>' +
  '</div>' +
  '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Class</label>' +
    '<select class="form-control" id="f_class">' +
      '<option ' + (s.class==='BTech-1'?'selected':'') + '>BTech-1</option>' +
      '<option ' + (s.class==='BTech-2'?'selected':'') + '>BTech-2</option>' +
      '<option ' + (s.class==='BTech-3'?'selected':'') + '>BTech-3</option>' +
    '</select></div>' +
    '<div class="form-group"><label class="form-label">Gender</label>' +
    '<select class="form-control" id="f_gender">' +
      '<option ' + (s.gender==='Male'?'selected':'') + '>Male</option>' +
      '<option ' + (s.gender==='Female'?'selected':'') + '>Female</option>' +
      '<option ' + (s.gender==='Other'?'selected':'') + '>Other</option>' +
    '</select></div>' +
  '</div>' +
  '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Date of Birth</label>' +
    '<input class="form-control" id="f_dob" type="date" value="' + (s.dob||'') + '" /></div>' +
    '<div class="form-group"><label class="form-label">Status</label>' +
    '<select class="form-control" id="f_status">' +
      '<option ' + (s.status==='Active'?'selected':'') + '>Active</option>' +
      '<option ' + (s.status==='Inactive'?'selected':'') + '>Inactive</option>' +
    '</select></div>' +
  '</div>' +
  '<div class="form-group"><label class="form-label">Address</label>' +
  '<input class="form-control" id="f_address" value="' + (s.address||'') + '" placeholder="City / Address" /></div>' +
  '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Guardian Name</label>' +
    '<input class="form-control" id="f_guardian" value="' + (s.guardianName||'') + '" /></div>' +
    '<div class="form-group"><label class="form-label">Guardian Phone</label>' +
    '<input class="form-control" id="f_gphone" value="' + (s.guardianPhone||'') + '" /></div>' +
  '</div>' +
  '<div class="modal-footer">' +
    '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveStudent(' + (s.id||0) + ')">' + (s.id ? 'Update' : 'Add') + ' Student</button>' +
  '</div>';
}

function saveStudent(id) {
  var name = document.getElementById('f_name').value.trim();
  var rollNo = document.getElementById('f_roll').value.trim();
  if (!name || !rollNo) { alert('Name and Roll No are required!'); return; }
  var data = {
    name: name,
    rollNo: rollNo,
    email: document.getElementById('f_email').value.trim(),
    phone: document.getElementById('f_phone').value.trim(),
    class: document.getElementById('f_class').value,
    gender: document.getElementById('f_gender').value,
    dob: document.getElementById('f_dob').value,
    status: document.getElementById('f_status').value,
    address: document.getElementById('f_address').value.trim(),
    guardianName: document.getElementById('f_guardian').value.trim(),
    guardianPhone: document.getElementById('f_gphone').value.trim(),
  };
  if (id) {
    var idx = DB.students.findIndex(function(s) { return s.id === id; });
    if (idx >= 0) DB.students[idx] = Object.assign({}, DB.students[idx], data);
  } else {
    data.id = DB.nextId++;
    DB.students.push(data);
  }
  closeModal();
  renderStudentsTable(DB.students);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
}

function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  DB.students = DB.students.filter(function(s) { return s.id !== id; });
  renderStudentsTable(DB.students);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
}

function viewStudent(id) {
  var s = getStudentById(id);
  if (!s) return;
  var att = calcAttendancePercent(s.id);
  var fee = DB.fees.find(function(f) { return f.studentId === id; });
  var attColor = att >= 75 ? 'var(--success)' : att >= 60 ? 'var(--warning)' : 'var(--danger)';
  openModal('Student Details',
    '<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)">' +
      '<div class="avatar" style="width:56px;height:56px;font-size:20px">' + getInitials(s.name) + '</div>' +
      '<div>' +
        '<div style="font-size:18px;font-weight:700">' + s.name + '</div>' +
        '<div style="font-size:13px;color:var(--text-secondary)">' + s.rollNo + ' &bull; ' + s.class + '</div>' +
        '<span class="badge ' + (s.status==='Active'?'badge-green':'badge-red') + '" style="margin-top:4px">' + s.status + '</span>' +
      '</div>' +
    '</div>' +
    '<table style="width:100%;font-size:13px">' +
      '<tr><td style="color:var(--text-muted);padding:6px 0;width:40%">Email</td><td style="font-weight:500">' + (s.email||'-') + '</td></tr>' +
      '<tr><td style="color:var(--text-muted);padding:6px 0">Phone</td><td style="font-weight:500">' + (s.phone||'-') + '</td></tr>' +
      '<tr><td style="color:var(--text-muted);padding:6px 0">Gender</td><td>' + s.gender + '</td></tr>' +
      '<tr><td style="color:var(--text-muted);padding:6px 0">Date of Birth</td><td>' + (s.dob||'-') + '</td></tr>' +
      '<tr><td style="color:var(--text-muted);padding:6px 0">Address</td><td>' + (s.address||'-') + '</td></tr>' +
      '<tr><td style="color:var(--text-muted);padding:6px 0">Guardian</td><td>' + (s.guardianName||'-') + '</td></tr>' +
      '<tr><td style="color:var(--text-muted);padding:6px 0">Guardian Phone</td><td>' + (s.guardianPhone||'-') + '</td></tr>' +
    '</table>' +
    '<div style="background:var(--bg);border-radius:8px;padding:14px;display:flex;gap:24px;margin-top:16px">' +
      '<div><div style="font-size:11px;color:var(--text-muted)">Attendance</div><div style="font-size:20px;font-weight:700;color:' + attColor + '">' + att + '%</div></div>' +
      '<div><div style="font-size:11px;color:var(--text-muted)">Fee Status</div><div style="font-size:20px;font-weight:700">' + (fee ? fee.status : 'N/A') + '</div></div>' +
    '</div>' +
    '<div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>'
  );
}