var DB = {
  students: [
    { id: 1, rollNo: 'COL001', name: 'Aarav Sharma', class: 'BTech-3', email: 'aarav@edu.com', phone: '9876543210', gender: 'Male', dob: '2002-04-15', address: 'Bhubaneswar', guardianName: 'Ramesh Sharma', guardianPhone: '9876500001', status: 'Active' },
    { id: 2, rollNo: 'COL002', name: 'Priya Patel', class: 'BTech-3', email: 'priya@edu.com', phone: '9876543211', gender: 'Female', dob: '2002-08-22', address: 'Cuttack', guardianName: 'Suresh Patel', guardianPhone: '9876500002', status: 'Active' },
    { id: 3, rollNo: 'COL003', name: 'Rohit Nayak', class: 'BTech-2', email: 'rohit@edu.com', phone: '9876543212', gender: 'Male', dob: '2003-01-10', address: 'Puri', guardianName: 'Manoj Nayak', guardianPhone: '9876500003', status: 'Active' },
    { id: 4, rollNo: 'COL004', name: 'Sneha Mishra', class: 'BTech-2', email: 'sneha@edu.com', phone: '9876543213', gender: 'Female', dob: '2003-06-18', address: 'Rourkela', guardianName: 'Sanjay Mishra', guardianPhone: '9876500004', status: 'Active' },
    { id: 5, rollNo: 'COL005', name: 'Vikram Singh', class: 'BTech-1', email: 'vikram@edu.com', phone: '9876543214', gender: 'Male', dob: '2004-11-30', address: 'Sambalpur', guardianName: 'Rajendra Singh', guardianPhone: '9876500005', status: 'Inactive' },
    { id: 6, rollNo: 'COL006', name: 'Ananya Das', class: 'BTech-1', email: 'ananya@edu.com', phone: '9876543215', gender: 'Female', dob: '2004-03-25', address: 'Berhampur', guardianName: 'Tapan Das', guardianPhone: '9876500006', status: 'Active' },
    { id: 7, rollNo: 'COL007', name: 'Kiran Kumar', class: 'BTech-3', email: 'kiran@edu.com', phone: '9876543216', gender: 'Male', dob: '2002-07-14', address: 'Bhubaneswar', guardianName: 'Sunil Kumar', guardianPhone: '9876500007', status: 'Active' },
    { id: 8, rollNo: 'COL008', name: 'Pooja Rath', class: 'BTech-2', email: 'pooja@edu.com', phone: '9876543217', gender: 'Female', dob: '2003-09-05', address: 'Khordha', guardianName: 'Deepak Rath', guardianPhone: '9876500008', status: 'Active' },
  ],

  grades: [
    { id: 1, studentId: 1, subject: 'Data Structures', mid: 24, end: 68, total: 92, grade: 'A', sem: 'Sem 5' },
    { id: 2, studentId: 1, subject: 'Database', mid: 22, end: 60, total: 82, grade: 'B', sem: 'Sem 5' },
    { id: 3, studentId: 1, subject: 'Operating Systems', mid: 20, end: 55, total: 75, grade: 'C', sem: 'Sem 5' },
    { id: 4, studentId: 2, subject: 'Data Structures', mid: 25, end: 70, total: 95, grade: 'A', sem: 'Sem 5' },
    { id: 5, studentId: 2, subject: 'Database', mid: 21, end: 58, total: 79, grade: 'B', sem: 'Sem 5' },
    { id: 6, studentId: 3, subject: 'Web Technology', mid: 19, end: 50, total: 69, grade: 'C', sem: 'Sem 3' },
    { id: 7, studentId: 3, subject: 'Java Programming', mid: 23, end: 63, total: 86, grade: 'A', sem: 'Sem 3' },
    { id: 8, studentId: 4, subject: 'Web Technology', mid: 15, end: 40, total: 55, grade: 'D', sem: 'Sem 3' },
    { id: 9, studentId: 5, subject: 'Mathematics', mid: 10, end: 28, total: 38, grade: 'F', sem: 'Sem 1' },
    { id: 10, studentId: 6, subject: 'Mathematics', mid: 24, end: 65, total: 89, grade: 'A', sem: 'Sem 1' },
  ],

  attendance: {
    1: { '2025-01': [1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1] },
    2: { '2025-01': [1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1] },
    3: { '2025-01': [1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1] },
    4: { '2025-01': [0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0] },
    5: { '2025-01': [1,1,1,0,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,1,0] },
    6: { '2025-01': [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1] },
    7: { '2025-01': [1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1] },
    8: { '2025-01': [1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1] },
  },

  timetable: {
    'BTech-1': {
      Monday:    ['Mathematics', 'English', 'Break', 'C Programming', 'Physics'],
      Tuesday:   ['C Programming', 'Mathematics', 'Break', 'English', 'Lab'],
      Wednesday: ['Physics', 'C Programming', 'Break', 'Mathematics', 'Lab'],
      Thursday:  ['English', 'Physics', 'Break', 'C Programming', 'Mathematics'],
      Friday:    ['Lab', 'Lab', 'Break', 'English', 'Physics'],
      Saturday:  ['Mathematics', 'English', 'Break', '-', '-'],
    },
    'BTech-2': {
      Monday:    ['Data Structures', 'DBMS', 'Break', 'Java', 'Web Tech'],
      Tuesday:   ['Java', 'Data Structures', 'Break', 'DBMS', 'Lab'],
      Wednesday: ['Web Tech', 'Java', 'Break', 'Data Structures', 'Lab'],
      Thursday:  ['DBMS', 'Web Tech', 'Break', 'Java', 'Data Structures'],
      Friday:    ['Lab', 'Lab', 'Break', 'DBMS', 'Web Tech'],
      Saturday:  ['Data Structures', 'DBMS', 'Break', '-', '-'],
    },
    'BTech-3': {
      Monday:    ['OS', 'Networks', 'Break', 'Software Engg', 'AI'],
      Tuesday:   ['AI', 'OS', 'Break', 'Networks', 'Lab'],
      Wednesday: ['Software Engg', 'AI', 'Break', 'OS', 'Lab'],
      Thursday:  ['Networks', 'Software Engg', 'Break', 'AI', 'OS'],
      Friday:    ['Lab', 'Lab', 'Break', 'Networks', 'Software Engg'],
      Saturday:  ['OS', 'AI', 'Break', '-', '-'],
    },
  },

  fees: [
    { id: 1, studentId: 1, tuition: 25000, hostel: 10000, exam: 1500, transport: 3000, paid: 39500, dueDate: '2025-06-30', status: 'Paid' },
    { id: 2, studentId: 2, tuition: 25000, hostel: 0, exam: 1500, transport: 3000, paid: 20000, dueDate: '2025-06-30', status: 'Partial' },
    { id: 3, studentId: 3, tuition: 25000, hostel: 10000, exam: 1500, transport: 0, paid: 36500, dueDate: '2025-06-30', status: 'Paid' },
    { id: 4, studentId: 4, tuition: 25000, hostel: 0, exam: 1500, transport: 3000, paid: 0, dueDate: '2025-06-30', status: 'Unpaid' },
    { id: 5, studentId: 5, tuition: 25000, hostel: 10000, exam: 1500, transport: 3000, paid: 10000, dueDate: '2025-06-30', status: 'Partial' },
    { id: 6, studentId: 6, tuition: 25000, hostel: 0, exam: 1500, transport: 0, paid: 26500, dueDate: '2025-06-30', status: 'Paid' },
    { id: 7, studentId: 7, tuition: 25000, hostel: 10000, exam: 1500, transport: 3000, paid: 0, dueDate: '2025-06-30', status: 'Unpaid' },
    { id: 8, studentId: 8, tuition: 25000, hostel: 0, exam: 1500, transport: 3000, paid: 29500, dueDate: '2025-06-30', status: 'Paid' },
  ],

  nextId: 9,
};

function getStudentById(id) {
  return DB.students.find(function(s) { return s.id === id; });
}

function calcAttendancePercent(studentId) {
  var data = DB.attendance[studentId];
  if (!data) return 0;
  var present = 0, total = 0;
  for (var month in data) {
    data[month].forEach(function(v) { total++; if (v) present++; });
  }
  return total ? Math.round((present / total) * 100) : 0;
}

function calcFeePercent(fee) {
  var total = fee.tuition + fee.hostel + fee.exam + fee.transport;
  return total ? Math.round((fee.paid / total) * 100) : 0;
}

function getInitials(name) {
  return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
}