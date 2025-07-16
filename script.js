function selectService(button, value) {
  document.querySelectorAll(".service-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  document.getElementById("serviceType").value = value;

  const waterOptions = document.getElementById("waterOptions");
  const dryOptions = document.getElementById("dryOptions");

  if (value === 'ซัก') {
    waterOptions.classList.add("show");
    dryOptions.classList.remove("show");
  } else if (value === 'อบ') {
    waterOptions.classList.remove("show");
    dryOptions.classList.add("show");
  } else if (value === 'ซัก-อบ') {
    waterOptions.classList.add("show");
    dryOptions.classList.add("show");
  } else {
    waterOptions.classList.remove("show");
    dryOptions.classList.remove("show");
  }

  calculateTotalPrice(); // ✅ เรียกคำนวณค่ารวม
}

function selectWeight(button, value) {
  document.querySelectorAll('.weight-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  document.getElementById('weight').value = value;

  calculateTotalPrice(); // ✅ เรียกคำนวณค่ารวม
}

function selectWater(button, value) {
  document.querySelectorAll(".water-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  document.getElementById("waterType").value = value;

  calculateTotalPrice(); // ✅ เรียกคำนวณค่ารวม
}

let isDryHotSelected = false;

function toggleDryHot(button) {
  isDryHotSelected = !isDryHotSelected;
  button.classList.toggle("active");

  calculateTotalPrice(); // ✅ เรียกคำนวณค่ารวม
}

function changeDryLevel(step) {
  const display = document.getElementById("dryLevelDisplay");
  const input = document.getElementById("dryLevel");
  const values = [0, 7, 14, 21, 28];  // ✅ เพิ่มระดับ 28 นาที
  let current = parseInt(input.value);
  let index = values.indexOf(current);
  index = Math.min(Math.max(index + step, 0), values.length - 1);

  const newVal = values[index];
  input.value = newVal;
  display.textContent = `+${newVal} นาที`;

  display.classList.remove("dry-level-gray", "dry-level-green", "dry-level-orange", "dry-level-red","dry-level-purple");

  switch (newVal) {
    case 0:
      display.classList.add("dry-level-gray");
      break;
    case 7:
      display.classList.add("dry-level-green");
      break;
    case 14:
      display.classList.add("dry-level-orange");
      break;
    case 21:
      display.classList.add("dry-level-red");
    case 28:
  display.classList.add("dry-level-purple"); // ✅ สีสำหรับ 28 นาที
  break;

}

  calculateTotalPrice(); // ✅ เรียกคำนวณค่ารวม
}

function updateDistance(distanceInKm) {
  const distanceInput = document.getElementById("distance");
  if (distanceInput) {
    distanceInput.value = distanceInKm.toFixed(2) + " กม.";
  }
  document.getElementById("distanceKm").value = distanceInKm;
  calculateTotalPrice();
}

function calculateTotalPrice() {
  let total = 0;

  // ประเภทบริการ
  const serviceType = document.getElementById("serviceType").value;
  if (serviceType === "ซัก") total += 40;
  else if (serviceType === "อบ") total += 40;
  else if (serviceType === "ซัก-อบ") total += 80;

  // ปริมาณผ้า
  const weight = document.getElementById("weight").value;
  if (weight === "20KG") total += 10;
  else if (weight === "25KG") total += 20;

  // ประเภทน้ำ
  const waterType = document.getElementById("waterType").value;
  if (waterType === "น้ำอุ่น") total += 10;
  else if (waterType === "น้ำร้อน") total += 20;

  // เวลาอบ
  const dryLevel = parseInt(document.getElementById("dryLevel").value || "0");
  if (isDryHotSelected) {
    if (weight === "20KG") total += 10;
    else if (weight === "25KG") total += 20;
  }

  // ค่าเวลาอบ + นาที
  if (dryLevel === 7) total += 10;
else if (dryLevel === 14) total += 20;
else if (dryLevel === 21) total += 30;
else if (dryLevel === 28) total += 40;  // ✅ เพิ่มระดับใหม่

  // ระยะทาง (ปัดขึ้น ×2 แล้ว ×10)
  const distanceKm = parseFloat(document.getElementById("distanceKm")?.value || "0");
  const roundTripKm = Math.ceil(distanceKm * 2);
  total += roundTripKm * 10;

  // แสดงผล
  const display = document.getElementById("totalPrice");
  if (display) {
    display.textContent = total ;
  }
}

document.querySelector("form").addEventListener("submit", function (e) {
  const service = document.getElementById("serviceType").value;
  const weight = document.getElementById("weight").value;
  const water = document.getElementById("waterType").value;
  const dryLevel = parseInt(document.getElementById("dryLevel").value || "0");
  const lat = document.getElementById("latitude").value;
  const lng = document.getElementById("longitude").value;
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phoneNumber").value.trim();

  let errors = [];

  // ปริมาณผ้า
  if (!weight) {
    errors.push("กรุณาเลือกปริมาณผ้า");
  }

  // ประเภทบริการ
  if (!service) {
    errors.push("กรุณาเลือกประเภทบริการ");
  }

  // เงื่อนไขตามประเภทบริการ
  if (service === "ซัก") {
    if (!water) {
      errors.push("กรุณาเลือกประเภทน้ำ");
    }
    // ไม่ต้องอบร้อนก็ได้
  } else if (service === "อบ") {
    if (!isDryHotSelected) {
      errors.push("กรุณาเลือกอบร้อน");
    }
    // ไม่ต้องเลือกประเภทน้ำ
  } else if (service === "ซัก-อบ") {
    if (!water) {
      errors.push("กรุณาเลือกประเภทน้ำ");
    }
    if (!isDryHotSelected) {
      errors.push("กรุณาเลือกอบร้อน");
    }
  }

  // จุดรับ-ส่ง
  if (!lat || !lng) {
    errors.push("กรุณากำหนดจุดรับ-ส่งผ้าบนแผนที่");
  }

  // ชื่อผู้ใช้บริการ
  if (!name) {
    errors.push("กรุณากรอกชื่อผู้ใช้บริการ");
  }

  // หมายเลขโทรศัพท์
  const phonePattern = /^0\d{9}$/;
  if (!phonePattern.test(phone)) {
    errors.push("กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก เริ่มต้นด้วย 0)");
  }

  // ถ้ามี error ให้แสดงเตือน
  if (errors.length > 0) {
    alert(errors.join("\n"));
    e.preventDefault(); // หยุดส่งฟอร์ม
  }
});

async function submitForm() {
  // รวบรวมค่าจาก form
  const data = {
    lineUserId: document.getElementById('lineUserId').value,
    serviceType: document.getElementById('serviceType').value,
    weight: document.getElementById('weight').value,
    waterType: document.getElementById('waterType').value,
    dryLevel: document.getElementById('dryLevel').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    distance: document.getElementById('distance').value,
    customerName: document.getElementById('customerName').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    totalPrice: document.getElementById('totalPrice').innerText
  };

  const response = await fetch("https://sabai-form-vka67iqbk-sabais-projects.vercel.app/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  if(result.result === "success"){
    alert("ส่งข้อมูลสำเร็จ! รอรับข้อความทาง LINE");
    // Optionally: ปิดหน้าต่าง LIFF
    // liff.closeWindow();
  } else {
    alert("เกิดข้อผิดพลาด: " + (result.message || ""));
  }
  return false; // กันไม่ให้ reload หน้า
}

