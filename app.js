// ===== App Controller =====

var currentRole = null;
var activeTab = 'admin';

var ADMIN_PAGES = {
  dashboard:   { title: 'Dashboard',       render: function() { return renderDashboardPage(); },  init: null },
  students:    { title: 'Students',        render: function() { return renderStudentsPage(); },   init: function() { renderStudentsTable(DB.students); } },
  grades:      { title: 'Grades',          render: function() { return renderGradesPage(); },     init: function() { renderGradesTable(DB.grades); } },
  attendance:  { title: 'Attendance',      render: function() { return renderAttendancePage(); }, init: renderAttendanceView },
  timetable:   { title: 'Timetable',       render: function() { return renderTimetablePage(); },  init: renderTimetableView },
  fees:        { title: 'Fees',            render: function() { return renderFeesPage(); },        init: function() { renderFeesTable(DB.fees); } },
  search:      { title: 'Advanced Search', render: function() { return renderAdvancedSearch(); },  init: null },
  analytics:   { title: 'Analytics',       render: function() { return renderAnalyticsPage(); },  init: null },
  progress:    { title: 'Progress Report', render: function() { return renderProgressReport(); }, init: null },
  noticeboard: { title: 'Notice Board',    render: function() { return renderNoticeBoardPage(); },init: null },
};

var ADMIN_NAV = [
  { page: 'dashboard',   icon: '📊', label: 'Dashboard' },
  { page: 'students',    icon: '👨‍🎓', label: 'Students' },
  { page: 'grades',      icon: '📝', label: 'Grades' },
  { page: 'attendance',  icon: '📅', label: 'Attendance' },
  { page: 'timetable',   icon: '🗓️', label: 'Timetable' },
  { page: 'fees',        icon: '💰', label: 'Fees' },
  { page: 'search',      icon: '🔍', label: 'Search' },
  { page: 'analytics',   icon: '📉', label: 'Analytics' },
  { page: 'progress',    icon: '📈', label: 'Progress' },
  { page: 'noticeboard', icon: '📧', label: 'Notice Board' },
];

function buildNav(items) {
  var nav = document.getElementById('sidebarNav');
  if (!nav) return;
  nav.innerHTML = items.map(function(n) {
    return '<a href="#" class="nav-item" data-page="' + n.page + '"><span class="nav-icon">' + n.icon + '</span> ' + n.label + '</a>';
  }).join('');
  document.querySelectorAll('.nav-item[data-page]').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });
}

function navigateTo(page) {
  var cfg = ADMIN_PAGES[page];
  if (!cfg) return;
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var navEl = document.querySelector('.nav-item[data-page="' + page + '"]');
  if (navEl) navEl.classList.add('active');
  document.getElementById('pageTitle').textContent = cfg.title;
  document.getElementById('contentArea').innerHTML = cfg.render();
  if (cfg.init) cfg.init();
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function switchTab(tab) {
  activeTab = tab;
  var tabAdmin = document.getElementById('tabAdmin');
  var tabStudent = document.getElementById('tabStudent');
  var adminHint = document.getElementById('adminHint');
  var studentHint = document.getElementById('studentHint');
  var loginLabel = document.getElementById('loginLabel');
  var loginUser = document.getElementById('loginUser');
  var loginError = document.getElementById('loginError');
  if (tabAdmin) tabAdmin.classList.toggle('active', tab === 'admin');
  if (tabStudent) tabStudent.classList.toggle('active', tab === 'student');
  if (adminHint) adminHint.style.display = tab === 'admin' ? 'block' : 'none';
  if (studentHint) studentHint.style.display = tab === 'student' ? 'block' : 'none';
  if (loginLabel) loginLabel.textContent = tab === 'admin' ? 'Username' : 'Roll Number';
  if (loginUser) {
    loginUser.placeholder = tab === 'admin' ? 'Enter username' : 'Enter Roll No e.g. COL001';
    loginUser.value = '';
  }
  if (loginError) loginError.style.display = 'none';
}

function togglePass() {
  var inp = document.getElementById('loginPass');
  var icon = document.getElementById('eyeIcon');
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  if (icon) icon.textContent = inp.type === 'password' ? '👁️' : '🙈';
}

function showError(msg) {
  var el = document.getElementById('loginError');
  if (!el) { alert(msg); return; }
  el.textContent = msg;
  el.style.display = 'block';
}

function doLogin() {
  var userEl = document.getElementById('loginUser');
  var passEl = document.getElementById('loginPass');
  if (!userEl || !passEl) return;
  var user = userEl.value.trim();
  var pass = passEl.value.trim();
  if (!user || !pass) { showError('⚠️ Please enter both fields!'); return; }
  if (activeTab === 'admin') {
    if (user === 'admin' && pass === 'admin123') {
      loginSuccess('admin', { name: 'Administrator', role: 'admin' });
    } else {
      showError('❌ Wrong credentials! Use: admin / admin123');
    }
  } else {
    var student = DB.students.find(function(s) {
      return s.rollNo.toLowerCase() === user.toLowerCase();
    });
    if (student && pass === 'student123') {
      loginSuccess('student', { name: student.name, role: 'student', rollNo: student.rollNo });
    } else {
      showError('❌ Wrong Roll No or password! Use: COL001 / student123');
    }
  }
}

function loginSuccess(role, userData) {
  currentRole = role;
  sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
  if (typeof loadFromLocalStorage === 'function') loadFromLocalStorage();

  document.getElementById('loginWrapper').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  document.getElementById('roleBadge').textContent = role === 'admin' ? '👨‍💼 Admin' : '👨‍🎓 Student';
  document.getElementById('loggedInUser').textContent = '👤 ' + userData.name;

  if (role === 'admin') {
    buildNav(ADMIN_NAV);
    if (typeof renderNotifications === 'function') renderNotifications();
    navigateTo('dashboard');
  } else {
    var student = DB.students.find(function(s) { return s.rollNo === userData.rollNo; });
    var sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav) {
      sidebarNav.innerHTML = '<a href="#" class="nav-item active"><span class="nav-icon">🏠</span> My Portal</a>';
    }
    document.getElementById('pageTitle').textContent = 'Student Portal';
    if (student) {
      document.getElementById('contentArea').innerHTML = renderStudentPortal(student);
      var pc = document.getElementById('portalContent');
      if (pc) pc.innerHTML = portalOverview(student);
    }
  }
}

function doLogout() {
  sessionStorage.removeItem('loggedInUser');
  currentRole = null;
  activeTab = 'admin';
  document.getElementById('loginWrapper').style.display = 'flex';
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').style.display = 'none';
  var tabAdmin = document.getElementById('tabAdmin');
  var tabStudent = document.getElementById('tabStudent');
  if (tabAdmin) tabAdmin.classList.add('active');
  if (tabStudent) tabStudent.classList.remove('active');
  document.getElementById('loginLabel').textContent = 'Username';
  document.getElementById('loginUser').placeholder = 'Enter username';
  document.getElementById('adminHint').style.display = 'block';
  document.getElementById('studentHint').style.display = 'none';
}

function openModal(title, bodyHTML) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function toggleNotifications() {
  var dd = document.getElementById('notifDropdown');
  if (dd) dd.classList.toggle('open');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  var isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  var btn = document.getElementById('darkToggleBtn');
  if (btn) btn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
}

function initDarkMode() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    var btn = document.getElementById('darkToggleBtn');
    if (btn) btn.textContent = '☀️ Light';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();

  var menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  var modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);

  var modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  var loginPass = document.getElementById('loginPass');
  if (loginPass) {
    loginPass.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin();
    });
  }

  var loginUser = document.getElementById('loginUser');
  if (loginUser) {
    loginUser.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin();
    });
  }
});