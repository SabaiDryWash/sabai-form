// /api/order.js (Vercel API backend สำหรับรับข้อมูลออเดอร์ และส่ง Flex Message ไปที่ LINE)
// ⭐️ ต้องตั้ง Environment Variables ใน Vercel ชื่อ LINE_TOKEN, ADMIN_GROUP_ID ก่อน deploy!

module.exports = async function handler(req, res) {
  console.log("API CALLED:", req.method); // Debug: เช็คว่า function ถูกเรียก
  if (req.method !== "POST")
    return res.status(405).json({ result: "error", message: "Method not allowed" });

  const data = req.body;
  console.log("DATA:", data); // Debug: เช็คข้อมูลที่รับเข้ามา

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
              uri: `https://maps.google.com/?q=${data.latitude},${data.longitude}`
            }
          }
        ]
      }
    }
  };

  // ⭐️ ส่ง Flex Message ไป 2 ที่ (1. user ที่กรอกฟอร์ม, 2. กลุ่มแอดมิน)
  for (const to of [data.lineUserId, process.env.ADMIN_GROUP_ID]) {
    try {
      const resp = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.LINE_TOKEN}`
        },
        body: JSON.stringify({
          to,
          messages: [flexMessage]
        })
      });
      const result = await resp.json();
      console.log(`Push to ${to}:`, result); // Debug: log response LINE
    } catch (err) {
      console.error(`Push to ${to} error:`, err);
    }
  }

  res.status(200).json({ result: "success" });
};
