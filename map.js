let marker;
let shopLat = 12.250000;  // พิกัดร้าน (ตัวอย่าง)
let shopLng = 102.500000;

function initMap() {
  const center = { lat: shopLat, lng: shopLng };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: center,
  });

  marker = new google.maps.Marker({
    position: center,
    map: map,
    draggable: true,
  });

  // เมื่อผู้ใช้ลากหมุด
  marker.addListener("dragend", function () {
    const lat = marker.getPosition().lat();
    const lng = marker.getPosition().lng();

    // อัปเดตค่า input ซ่อน
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;

    // คำนวณระยะทาง
    const distance = calculateDistance(shopLat, shopLng, lat, lng);
    updateDistance(distance);
  });

  // คำนวณระยะทางครั้งแรก
  const initialDistance = calculateDistance(shopLat, shopLng, center.lat, center.lng);
  updateDistanceDisplay(initialDistance);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function updateDistanceDisplay(distance) {
  const distanceField = document.getElementById("distance");
  distanceField.value = `${distance.toFixed(2)} กม.`;
}

