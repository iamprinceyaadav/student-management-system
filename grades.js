// ===== Grades Page =====

function renderGradesPage() {
  return '<div class="card">' +
    '<div class="card-header">' +
      '<h2 class="card-title">📝 Grades & Marks</h2>' +
      '<div class="toolbar">' +
        '<select class="form-control" id="gradeStudentFilter" onchange="filterGrades()" style="width:180px">' +
          '<option value="">All Students</option>' +
          DB.students.map(function(s) { return '<option value="' + s.id + '">' + s.name + '</option>'; }).join('') +
        '</select>' +
        '<select class="form-control" id="gradeClassFilter" onchange="filterGradesByClass()" style="width:130px">' +
          '<option value="">All Classes</option>' +
          '<option>BTech-1</option><option>BTech-2</option><option>BTech-3</option>' +
        '</select>' +
        '<button class="btn btn-primary" onclick="openAddGrade()">+ Add Grade</button>' +
      '</div>' +
    '</div>' +
    '<div class="card-body" style="padding:0">' +
      '<div class="table-wrap">' +
        '<table>' +
          '<thead><tr>' +
            '<th>Student</th><th>Class</th><th>Subject</th><th>Semester</th>' +
            '<th>Mid (25)</th><th>End (75)</th><th>Total (100)</th><th>Grade</th><th>Actions</th>' +
          '</tr></thead>' +
          '<tbody id="gradesBody"></tbody>' +
        '</table>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderGradesTable(grades) {
  var tbody = document.getElementById('gradesBody');
  if (!tbody) return;
  if (!grades || grades.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><div class="icon">📋</div><p>No grades found</p></div></td></tr>';
    return;
  }
  var html = '';
  for (var i = 0; i < grades.length; i++) {
    var g = grades[i];
    var student = getStudentById(g.studentId);
    if (!student) continue;
    var barColor = g.total >= 80 ? 'var(--success)' : g.total >= 60 ? 'var(--primary)' : g.total >= 40 ? 'var(--warning)' : 'var(--danger)';
    html += '<tr>' +
      '<td><div class="student-name-cell"><div class="avatar" style="width:28px;height:28px;font-size:10px">' + getInitials(student.name) + '</div><span style="font-weight:500">' + student.name + '</span></div></td>' +
      '<td><span class="badge badge-blue">' + student.class + '</span></td>' +
      '<td>' + g.subject + '</td>' +
      '<td><span class="badge badge-gray">' + g.sem + '</span></td>' +
      '<td style="text-align:center;font-weight:600">' + g.mid + '</td>' +
      '<td style="text-align:center;font-weight:600">' + g.end + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:8px">' +
        '<div class="progress-bar-wrap" style="width:60px"><div class="progress-bar" style="width:' + g.total + '%;background:' + barColor + '"></div></div>' +
        '<span style="font-weight:700">' + g.total + '</span>' +
      '</div></td>' +
      '<td><span class="grade-' + g.grade + '">' + g.grade + '</span></td>' +
      '<td><div style="display:flex;gap:6px">' +
        '<button class="btn btn-primary btn-sm" onclick="openEditGrade(' + g.id + ')">Edit</button>' +
        '<button class="btn btn-danger btn-sm" onclick="deleteGrade(' + g.id + ')">Del</button>' +
      '</div></td>' +
    '</tr>';
  }
  tbody.innerHTML = html;
}

function filterGrades() {
  var sid = parseInt(document.getElementById('gradeStudentFilter') ? document.getElementById('gradeStudentFilter').value : 0) || 0;
  renderGradesTable(sid ? DB.grades.filter(function(g) { return g.studentId === sid; }) : DB.grades.slice());
}

function filterGradesByClass() {
  var cls = document.getElementById('gradeClassFilter') ? document.getElementById('gradeClassFilter').value : '';
  renderGradesTable(cls ? DB.grades.filter(function(g) {
    var s = getStudentById(g.studentId);
    return s && s.class === cls;
  }) : DB.grades.slice());
}

function calcGrade(total) {
  if (total >= 90) return 'A';
  if (total >= 75) return 'B';
  if (total >= 60) return 'C';
  if (total >= 40) return 'D';
  return 'F';
}

function openAddGrade() {
  openModal('Add Grade', gradeFormHTML({}));
}

function openEditGrade(id) {
  var g = DB.grades.find(function(x) { return x.id === id; });
  if (g) openModal('Edit Grade', gradeFormHTML(g));
}

function gradeFormHTML(g) {
  return '<div class="form-group">' +
    '<label class="form-label">Student *</label>' +
    '<select class="form-control" id="gf_student">' +
      '<option value="">-- Select Student --</option>' +
      DB.students.map(function(s) {
        return '<option value="' + s.id + '" ' + (g.studentId === s.id ? 'selected' : '') + '>' + s.name + ' (' + s.class + ')</option>';
      }).join('') +
    '</select>' +
  '</div>' +
  '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Subject *</label>' +
    '<input class="form-control" id="gf_subject" value="' + (g.subject || '') + '" placeholder="e.g. Data Structures" /></div>' +
    '<div class="form-group"><label class="form-label">Semester</label>' +
    '<select class="form-control" id="gf_sem">' +
      ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6'].map(function(s) {
        return '<option ' + (g.sem === s ? 'selected' : '') + '>' + s + '</option>';
      }).join('') +
    '</select></div>' +
  '</div>' +
  '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Mid Marks (out of 25)</label>' +
    '<input class="form-control" id="gf_mid" type="number" min="0" max="25" value="' + (g.mid || '') + '" oninput="autoCalcGrade()" /></div>' +
    '<div class="form-group"><label class="form-label">End Marks (out of 75)</label>' +
    '<input class="form-control" id="gf_end" type="number" min="0" max="75" value="' + (g.end || '') + '" oninput="autoCalcGrade()" /></div>' +
  '</div>' +
  '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Total (auto)</label>' +
    '<input class="form-control" id="gf_total" value="' + (g.total || '') + '" readonly style="background:var(--bg)" /></div>' +
    '<div class="form-group"><label class="form-label">Grade (auto)</label>' +
    '<input class="form-control" id="gf_grade" value="' + (g.grade || '') + '" readonly style="background:var(--bg);font-weight:700" /></div>' +
  '</div>' +
  '<div class="modal-footer">' +
    '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveGrade(' + (g.id || 0) + ')">' + (g.id ? 'Update' : 'Save') + ' Grade</button>' +
  '</div>';
}

function autoCalcGrade() {
  var mid = parseInt(document.getElementById('gf_mid') ? document.getElementById('gf_mid').value : 0) || 0;
  var end = parseInt(document.getElementById('gf_end') ? document.getElementById('gf_end').value : 0) || 0;
  var total = mid + end;
  if (document.getElementById('gf_total')) document.getElementById('gf_total').value = total;
  if (document.getElementById('gf_grade')) document.getElementById('gf_grade').value = calcGrade(total);
}

function saveGrade(id) {
  var studentId = parseInt(document.getElementById('gf_student') ? document.getElementById('gf_student').value : 0);
  var subject = document.getElementById('gf_subject') ? document.getElementById('gf_subject').value.trim() : '';
  if (!studentId || !subject) { alert('Student and subject are required!'); return; }
  var mid = parseInt(document.getElementById('gf_mid').value) || 0;
  var end = parseInt(document.getElementById('gf_end').value) || 0;
  var total = mid + end;
  var data = {
    studentId: studentId,
    subject: subject,
    mid: mid,
    end: end,
    total: total,
    grade: calcGrade(total),
    sem: document.getElementById('gf_sem').value
  };
  if (id) {
    var idx = DB.grades.findIndex(function(g) { return g.id === id; });
    if (idx >= 0) DB.grades[idx] = Object.assign({}, DB.grades[idx], data);
  } else {
    data.id = DB.nextId++;
    DB.grades.push(data);
  }
  closeModal();
  renderGradesTable(DB.grades);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
}

function deleteGrade(id) {
  if (!confirm('Delete this grade record?')) return;
  DB.grades = DB.grades.filter(function(g) { return g.id !== id; });
  renderGradesTable(DB.grades);
  if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
}