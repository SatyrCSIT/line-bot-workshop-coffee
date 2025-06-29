# ☕ Satyr Cafe LINE Bot & Admin Dashboard

**ยินดีต้อนรับสู่ Cafe LINE Bot และ Admin Dashboard** – ระบบที่ให้ลูกค้าดูเมนูเครื่องดื่ม โปรโมชัน และที่ตั้งร้านผ่าน LINE Official Account (OA) และให้ผู้ดูแลระบบเพิ่มเมนูและโปรโมชันผ่านหน้า Admin Dashboard ที่พัฒนาด้วย **React**! Backend ใช้ **Node.js**, **MySQL**, และ **LINE Bot SDK** พร้อมทดสอบ webhook ด้วย **ngrok** 🚀

---

## ✨ คุณสมบัติเด่น

### Backend (LINE Bot)
- 🧑 **สมัครสมาชิก**: ผู้ใช้สมัครสมาชิกผ่าน LINE และรับการแจ้งเตือนไปยัง Telegram  
- ☕ **เมนูเครื่องดื่ม**: แสดงเมนูในรูปแบบ Flex Message แบ่งตามหมวดหมู่ (Coffee, Tea, Milk)  
- 🎉 **โปรโมชัน**: ดูโปรโมชันที่กำลังใช้งานอยู่ในขณะนั้น  
- 📍 **ที่ตั้งร้าน**: ส่งพิกัดร้านในรูปแบบ Location Message  
- 🗄️ **ฐานข้อมูล**: ใช้ MySQL เพื่อจัดการข้อมูลเมนู โปรโมชัน ผู้ใช้ 

### Frontend (Admin Dashboard)
- 🖥️ **หน้า Admin Dashboard**: พัฒนาด้วย React และ Tailwind CSS สำหรับเพิ่มเมนูและโปรโมชัน  
- ➕ **เพิ่มเมนู**: กรอกชื่อ, ราคา, URL รูปภาพ, และหมวดหมู่เพื่อเพิ่มลงฐานข้อมูล  
- 🎁 **เพิ่มโปรโมชัน**: กรอกชื่อ, คำอธิบาย, วันที่เริ่ม/สิ้นสุด, URL รูปภาพ, และสถานะ  

---

## 🛠️ ความต้องการของระบบ

- **Node.js** (เวอร์ชัน 16 หรือสูงกว่า)  
- **MySQL** (เวอร์ชัน 5.7 หรือสูงกว่า)  
- **LINE Official Account** และ **LINE Developers Account**  
- **ngrok** (สำหรับทดสอบ webhook)  
- **Telegram Bot** (สำหรับแจ้งเตือนการสมัครสมาชิก)  
- **React** และ **Vite** (สำหรับ frontend)  

---

## 📦 การติดตั้ง

### 1. ตั้งค่า LINE Official Account และ LINE Developers

1. **สร้าง LINE Official Account**  
   - ไปที่ [LINE Official Account Manager](https://manager.line.biz/)  
   - สร้างบัญชีสำหรับ **Cafe**  
   - คัดลอก **Channel ID** และ **Channel Secret** จากการตั้งค่า  

2. **ตั้งค่า LINE Messaging API**  
   - เข้า [LINE Developers Console](https://developers.line.biz/)  
   - สร้าง **Provider** และ **Channel** (เลือก Messaging API)  
   - คัดลอก **Channel Access Token** และ **Channel Secret**  
   - เปิดใช้งาน **Webhook** ใน LINE Developers Console  

3. **ตั้งค่า Telegram Bot**  
   - สร้าง Telegram Bot ผ่าน [BotFather](https://t.me/BotFather)  
   - รับ **Bot Token** และ **Chat ID** ของกลุ่มหรือแชทสำหรับแจ้งเตือน  

---

### 2. ตั้งค่า Backend

1. **Clone โปรเจกต์**  
   ```bash
   git clone <repository-url>
   cd line-bot-workshop-coffee
   ```

2. **ติดตั้ง Dependencies**  
   รันคำสั่งต่อไปนี้ในโฟลเดอร์ backend:  
   ```bash
   npm init -y
   npm install express @line/bot-sdk mysql2 dotenv cors
   ```

3. **ตั้งค่าไฟล์ `.env`**  
   สร้างไฟล์ `.env` ใน root directory และเพิ่มข้อมูล:  
   ```plaintext
   CHANNEL_ACCESS_TOKEN=<your-line-channel-access-token>
   CHANNEL_SECRET=<your-line-channel-secret>
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=<your-mysql-password>
   DB_NAME=coffee_shop
   ```

4. **ตั้งค่าฐานข้อมูล MySQL**  
   - ติดตั้ง MySQL และสร้างฐานข้อมูล `coffee_shop`  
   - นำเข้าโครงสร้างฐานข้อมูลจากไฟล์ `coffee_shop.sql`:  
     ```bash
     mysql -u root -p coffee_shop < coffee_shop.sql
     ```
   - ตรวจสอบว่ามีตาราง `menu`, `promotions`, `shop`, และ `users`  

5. **รัน Backend Server**  
   ```bash
   node coffee-workshop.js
   ```
   Backend จะรันที่ `http://localhost:3000`  

---

### 3. ตั้งค่า ngrok

1. **ติดตั้ง ngrok**  
   - ดาวน์โหลดจาก [ngrok.com](https://ngrok.com/download) หรือติดตั้งผ่าน npm:  
     ```bash
     npm install -g ngrok
     ```

2. **รัน ngrok**  
   - รัน backend server ก่อน:  
     ```bashuno
     node coffee-workshop.js
     ```
   - รัน ngrok เพื่อสร้าง public URL สำหรับ `http://localhost:3000`:  
     ```bash
     ngrok http 3000
     ```
   - คัดลอก URL (เช่น `https://<random>.ngrok.io`)  
   - ตั้งค่า Webhook ใน LINE Developers Console โดยใช้ URL เช่น `https://<random>.ngrok.io/webhook`  

---

### 4. ตั้งค่า Frontend (Admin Dashboard)

1. **สร้างโปรเจกต์ React ด้วย Vite**  
   ในโฟลเดอร์ใหม่ (เช่น `coffee-shop-admin`):  
   ```bash
   npm create vite@latest coffee-shop-admin
   ```
   - เลือก **Framework**: React  
   - เลือก **Variant**: JavaScript  

2. **ติดตั้ง Dependencies เพิ่มเติม**  
   เข้าไปในโฟลเดอร์ `coffee-shop-admin` และรัน:  
   ```bash
   cd coffee-shop-admin
   npm install
   npm install tailwindcss postcss autoprefixer axios
   npx tailwindcss init -p
   ```

3. **ตั้งค่า Tailwind CSS**  
   - แก้ไขไฟล์ `tailwind.config.js`:  
     ```javascript
     /** @type {import('tailwindcss').Config} */
     export default {
       content: [
         "./index.html",
         "./src/**/*.{js,ts,jsx,tsx}",
       ],
       theme: {
         extend: {},
       },
       plugins: [],
     }
     ```
   - แก้ไขไฟล์ `src/index.css`:  
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

4. **รัน Frontend Server**  
   ```bash
   npm run dev
   ```
   Frontend จะรันที่ `http://localhost:5173`  

---

## 🚀 การใช้งาน

### Backend (LINE Bot)
| คำสั่ง                | การทำงาน                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| `สมัครสมาชิก` / `register` | ลงทะเบียนผู้ใช้ในระบบและส่งการแจ้งเตือนไปยัง Telegram                   |
| `รายการเครื่องดื่ม`       | แสดงเมนูเครื่องดื่มในรูปแบบ Flex Message แบ่งตามหมวดหมู่                |
| `โปรโมชัน` / `promotion` | แสดงโปรโมชันที่กำลังใช้งานอยู่ในขณะนั้น                                 |
| `แผนที่ร้าน`            | ส่งที่ตั้งร้านพร้อมพิกัดในรูปแบบ Location Message                      |

- เพิ่ม LINE OA เป็นเพื่อนใน LINE และส่งข้อความด้านบนเพื่อทดสอบ  

### Frontend (Admin Dashboard)
- เข้าไปที่ `http://localhost:5173` เพื่อเข้าสู่หน้า Admin Dashboard  
- **เพิ่มเมนู**:  
  - กรอก **ชื่อเมนู**, **ราคา**, **URL รูปภาพ**, และเลือก **หมวดหมู่** (Coffee, Tea, Milk)  
  - กดปุ่ม **เพิ่มเมนู** เพื่อบันทึกข้อมูลลงฐานข้อมูล MySQL  
- **เพิ่มโปรโมชัน**:  
  - กรอก **ชื่อโปรโมชัน**, **คำอธิบาย**, **วันที่เริ่ม**, **วันที่สิ้นสุด**, **URL รูปภาพ**, และเลือก **สถานะใช้งาน**  
  - กดปุ่ม **เพิ่มโปรโมชัน** เพื่อบันทึกข้อมูลลงฐานข้อมูล MySQL  
  
---

## ⚠️ ข้อควรระวัง

- **รักษาความปลอดภัย**: เก็บ **Channel Access Token**, **Channel Secret**, และข้อมูลใน `.env` ให้ปลอดภัย  
- **Webhook URL**: อัปเดต URL จาก ngrok ใน LINE Developers Console ทุกครั้งที่รัน ngrok ใหม่  
- **MySQL**: ตรวจสอบว่า `DB_PASS` ใน `.env` ตรงกับรหัสผ่าน MySQL และ MySQL server รันอยู่  
- **Telegram**: ตรวจสอบว่า **Bot Token** และ **Chat ID** ถูกต้อง  
- **CORS**: ตรวจสอบว่า backend อนุญาต CORS สำหรับ frontend (`http://localhost:5173`)  
- **HTTPS**: ใช้ HTTPS ใน production เพื่อความปลอดภัย  

---

## 🛠️ การแก้ปัญหา

- **Webhook ไม่ทำงาน**  
  - ตรวจสอบว่า URL ใน LINE Developers Console ถูกต้องและ ngrok รันอยู่  
  - ตรวจสอบ **Channel Secret** และ **Channel Access Token** ใน `.env`  

- **MySQL Connection Error**  
  - ตรวจสอบว่า MySQL server รันอยู่และข้อมูลใน `.env` ถูกต้อง  

- **Telegram Notification ล้มเหลว**  
  - ตรวจสอบ **Bot Token** และ **Chat ID** ในโค้ด (`coffee-workshop.js`)  

- **Frontend ไม่สามารถเชื่อมต่อ Backend**  
  - ตรวจสอบว่า backend รันที่ `http://localhost:3000`  
  - ตรวจสอบว่า `cors` ถูกตั้งค่าใน `coffee-workshop.js`  

---

## 📜 License

โปรเจกต์นี้อยู่ภายใต้ [MIT License](LICENSE).

---

_พัฒนาโดย [Satyr]_