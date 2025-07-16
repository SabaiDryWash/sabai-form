// /api/order.js (Vercel API backend สำหรับรับข้อมูลออเดอร์ และส่ง Flex Message ไปที่ LINE)
// ⭐️ ต้องตั้ง Environment Variables ใน Vercel ชื่อ LINE_TOKEN, ADMIN_GROUP_ID ก่อน deploy!

export default async function handler(req, res) {
  // ⭐️ อนุญาตแค่ POST เท่านั้น (ป้องกัน request แปลกๆ)
  if (req.method !== "POST")
    return res.status(405).json({ result: "error", message: "Method not allowed" });

  // รับข้อมูลที่ส่งมาจากฟอร์ม (JSON)
  const data = req.body; // ข้อมูลลูกค้า, ออเดอร์, พิกัด, ฯลฯ

  // สร้าง Flex Message (LINE)
  const flexMessage = {
    type: 'flex',
    altText: 'สรุปออเดอร์รับ-ส่งผ้า',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: `ลูกค้า: ${data.customerName}`, weight: 'bold', size: 'lg' },
          { type: 'text', text: `เบอร์: ${data.phoneNumber}` },
          { type: 'text', text: `บริการ: ${data.serviceType}, ${data.weight}` },
          { type: 'text', text: `น้ำ: ${data.waterType}` },
          { type: 'text', text: `อบ: ${data.dryLevel}` },
          { type: 'text', text: `ระยะทาง: ${data.distance}` },
          { type: 'text', text: `รวม: ${data.totalPrice} บาท`, weight: 'bold' }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: "ดูแผนที่",
              // ⭐️ เปิดพิกัดลูกค้าใน Google Maps
              uri: `https://maps.google.com/?q=${data.latitude},${data.longitude}`
            }
          }
        ]
      }
    }
  };

  // ⭐️ ส่ง Flex Message ไป 2 ที่ (1. user ที่กรอกฟอร์ม, 2. กลุ่มแอดมิน)
  for (const to of [data.lineUserId, process.env.ADMIN_GROUP_ID]) {
    // ส่ง HTTP POST ไปยัง LINE Messaging API (push)
    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⭐️ ต้องใช้ LINE_TOKEN (Channel access token) ที่ได้จาก LINE Developers
        "Authorization": `Bearer ${process.env.LINE_TOKEN}`
      },
      body: JSON.stringify({
        to,                // ส่งไปยัง userId หรือ groupId
        messages: [flexMessage] // ส่ง Flex Message ที่สร้างไว้
      })
    });
  }

  // ⭐️ ส่งสถานะกลับไปให้ frontend (แจ้งว่าสำเร็จ)
  res.status(200).json({ result: "success" });
}
