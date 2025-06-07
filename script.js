const education = document.getElementById('education');
const collegeDiv = document.getElementById('college-div');
const collegeInput = document.getElementById('college');
const property = document.getElementById('property');
const houseDiv = document.getElementById('house-div');
const houseInput = document.getElementById('house');
const form = document.getElementById('diyah-form');
const previewBar = document.getElementById('preview-bar');
const previewContent = document.getElementById('preview-content');
const downloadBtn = document.getElementById('download-btn');
const employment = document.getElementById('employment');
const jobDiv = document.getElementById('job-div');
const jobSelect = document.getElementById('job');

education.addEventListener('change', () => {
  if (["bachelor", "master", "doctor"].includes(education.value)) {
    collegeDiv.classList.remove("hidden");
    collegeInput.required = true;
  } else {
    collegeDiv.classList.add("hidden");
    collegeInput.required = false;
    collegeInput.value = '';
  }
  updatePreview();
});

property.addEventListener('change', () => {
  if (property.value === 'yes') {
    houseDiv.classList.remove('hidden');
    houseInput.required = true;
  } else {
    houseDiv.classList.add('hidden');
    houseInput.required = false;
    houseInput.value = '';
  }
  updatePreview();
});

employment.addEventListener('change', () => {
  if (employment.value === 'employed') {
    jobDiv.classList.remove('hidden');
    jobSelect.required = true;
  } else {
    jobDiv.classList.add('hidden');
    jobSelect.required = false;
    jobSelect.value = '';
  }
  updatePreview();
});

const moneyTable = {
  education: {
    highschool: 2000,
    bachelor: 4500,
    master: 8000,
    doctor: 12000
  },
  profession: {
    doctor: 100000,
    teacher: 10000,
    engineer: 100000
  },
  employment: {
    employed: 100000,
    unemployed: -50000
  },
  sister: {
    yes: -100000,
    no: 100000
  },
  property: {
    yes: 50000,
    no: 0
  },
  house: {
    myhouse: 100000,
    parenthouse: 50000
  },
  specialColleges: ['harvard', 'mit', 'oxford', 'cambridge', 'stanford', 'iit', 'ams'],
  job: {
    government: 3000,
    normal: 0
  }
};

function calculate(data) {
  let total = 0;
  if (data.education) total += moneyTable.education[data.education] || 0;
  if (data.college && moneyTable.specialColleges.some(c => data.college.toLowerCase().includes(c))) total += 100000;
  total += moneyTable.profession[data.profession] || 0;
  total += moneyTable.employment[data.employment] || 0;
  total += moneyTable.sister[data.sister] || 0;
  total += moneyTable.property[data.property] || 0;
  if (data.property === 'yes' && data.house) total += moneyTable.house[data.house] || 0;
  if (data.employment === 'employed' && data.job) total += moneyTable.job[data.job] || 0;
  return total;
}

function updatePreview() {
  const data = {
    name: document.getElementById('name').value.trim(),
    education: education.value,
    college: collegeInput.value.trim(),
    employment: employment.value,
    job: jobSelect.value,
    property: property.value,
    house: houseInput.value,
    profession: document.getElementById('profession').value,
    sister: document.getElementById('sister').value
  };

  const filled = data.name && data.education && data.employment && data.property && data.profession && data.sister && (['bachelor','master','doctor'].includes(data.education) ? data.college : true) && (data.property === 'yes' ? data.house : true) && (data.employment === 'employed' ? data.job : true);

  if (filled) {
    const amount = calculate(data);
    let jobText = '';
    if (data.employment === 'employed' && data.job === 'government') {
      jobText = 'Government Job (Rs 3,000 + Car)';
    } else if (data.employment === 'employed' && data.job === 'normal') {
      jobText = 'Normal Job (Rs 0)';
    }

    previewContent.innerHTML = `
      <strong>Name:</strong> ${data.name}<br>
      <strong>Education:</strong> ${education.options[education.selectedIndex].text}<br>
      ${data.college ? `<strong>College:</strong> ${data.college}<br>` : ''}
      <strong>Employment:</strong> ${employment.options[employment.selectedIndex].text}<br>
      ${jobText ? `<strong>Job:</strong> ${jobText}<br>` : ''}
      <strong>Property:</strong> ${property.options[property.selectedIndex].text}<br>
      ${data.house ? `<strong>House:</strong> ${houseInput.options[houseInput.selectedIndex].text}<br>` : ''}
      <strong>Profession:</strong> ${document.getElementById('profession').options[document.getElementById('profession').selectedIndex].text}<br>
      <strong>Sister:</strong> ${document.getElementById('sister').options[document.getElementById('sister').selectedIndex].text}<br>
      <hr>
      <strong>Total Diyah Money:</strong> Rs ${amount.toLocaleString()}
    `;
    previewBar.classList.add('visible');
  } else {
    previewContent.textContent = 'Fill the form completely to see the Diyah calculation preview.';
    previewBar.classList.remove('visible');
  }
}

form.addEventListener('input', updatePreview);
form.addEventListener('submit', e => { e.preventDefault(); updatePreview(); });

downloadBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFillColor(240, 240, 255);
  doc.roundedRect(10, 10, 190, 270, 10, 10, 'F');
  doc.addImage('https://i.postimg.cc/DZfpYts4/blood-money.jpg', 'PNG', 150, 12, 40, 40);
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 80);
  doc.text('Diyah (Blood Money) Report', 14, 25);

  const lines = previewContent.innerHTML.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '').split('\n');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 40;
  lines.forEach(line => {
    if (line.trim()) {
      doc.text(line.trim(), 14, y);
      y += 8;
    }
  });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Generated by Diyah Calculator App', 14, 280);

  doc.save(`Diyah_Report_${Date.now()}.pdf`);
});
