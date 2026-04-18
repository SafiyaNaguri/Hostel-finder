const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, "hostels-data.json");

const SEED_HOSTELS = [
  {
    id: 0,
    name: "Sunrise Boys Hostel",
    location: "Ameerpet, Hyderabad",
    price: 3200,
    rating: 4.8,
    reviews: 124,
    type: "Boys",
    tags: ["AC", "WiFi", "Meals"],
    grad: "img-grad-1",
    icon: "🏠",
    owner: "Ravi Kumar",
    desc: "A modern, well-maintained hostel with excellent facilities and a friendly atmosphere. Perfect for working professionals and students looking for a comfortable, affordable stay in the heart of the city.",
    facilities: ["📶 WiFi", "❄ AC", "🚿 Hot Water", "👕 Laundry", "📹 CCTV", "📚 Study Room", "🍽 Mess", "💡 Power Backup"],
    reviews_data: [
      { author: "Arun P.", stars: 5, text: "Excellent hostel! Very clean, good food and great WiFi. The owner is very cooperative.", date: "Jan 2025" },
      { author: "Suresh K.", stars: 4, text: "Good value for money. AC works well, meals are decent. Location is very convenient for Metro.", date: "Dec 2024" },
      { author: "Vikram M.", stars: 5, text: "Been staying here for 8 months. One of the best hostels in Ameerpet. Highly recommend!", date: "Nov 2024" }
    ]
  },
  {
    id: 1,
    name: "BackPacker Inn",
    location: "Madhapur, Hyderabad",
    price: 2800,
    rating: 4.5,
    reviews: 89,
    type: "Co-ed",
    tags: ["WiFi", "Security", "Gym"],
    grad: "img-grad-2",
    icon: "🎒",
    owner: "Meena Joshi",
    desc: "Vibrant co-ed hostel popular with young professionals working in Hi-Tech City. Great social atmosphere with a rooftop hangout area.",
    facilities: ["📶 WiFi", "🏋 Gym", "🔒 Security", "🚗 Parking", "📹 CCTV", "🛁 Attached Bath"],
    reviews_data: [
      { author: "Divya L.", stars: 5, text: "Love the vibe here! Very social, clean and the gym is a huge plus. Great staff.", date: "Feb 2025" },
      { author: "Kiran T.", stars: 4, text: "Good location near Cyber City. Rooms are spacious. Wish food was included.", date: "Jan 2025" }
    ]
  },
  {
    id: 2,
    name: "Metro Stay PG",
    location: "Hi-Tech City, Hyderabad",
    price: 4500,
    rating: 4.7,
    reviews: 203,
    type: "Boys",
    tags: ["Premium", "AC", "Meals", "WiFi"],
    grad: "img-grad-3",
    icon: "🏢",
    owner: "Sanjay Naidu",
    desc: "Premium PG accommodation near Cyber Hub. Fully furnished rooms with all amenities. Ideal for IT professionals.",
    facilities: ["📶 WiFi", "❄ AC", "🍽 3 Meals", "👕 Laundry", "📹 CCTV", "🔒 Guard", "💡 Power Backup", "🛁 Attached Bath"],
    reviews_data: [
      { author: "Rohan B.", stars: 5, text: "Premium quality at a fair price. The food is amazing and management is top class.", date: "Mar 2025" },
      { author: "Neha G.", stars: 5, text: "Best PG I've stayed in Hyderabad. 3 meals a day, AC, great WiFi. Worth every rupee.", date: "Feb 2025" },
      { author: "Amit V.", stars: 4, text: "Great facilities. AC sometimes needs service but overall excellent experience.", date: "Jan 2025" }
    ]
  },
  {
    id: 3,
    name: "Student Nest",
    location: "Koti, Hyderabad",
    price: 2200,
    rating: 4.3,
    reviews: 67,
    type: "Girls",
    tags: ["Budget", "Meals", "Security"],
    grad: "img-grad-4",
    icon: "🏫",
    owner: "Lakshmi Devi",
    desc: "Affordable girls hostel near Osmania University. Safe, clean and close to colleges and coaching centers. Strict curfew and CCTV.",
    facilities: ["📶 WiFi", "🍽 Meals", "📹 CCTV", "🔒 Guard", "📚 Study Room", "🚿 Hot Water"],
    reviews_data: [
      { author: "Ananya R.", stars: 5, text: "Very safe and clean. Food is homely and staff is like family. Perfect for students.", date: "Feb 2025" },
      { author: "Pooja M.", stars: 4, text: "Good budget option near Osmania. Nice study room and friendly atmosphere.", date: "Dec 2024" }
    ]
  },
  {
    id: 4,
    name: "Green Valley Hostel",
    location: "Kondapur, Hyderabad",
    price: 3800,
    rating: 4.6,
    reviews: 112,
    type: "Co-ed",
    tags: ["AC", "WiFi", "Gym", "Meals"],
    grad: "img-grad-2",
    icon: "🌿",
    owner: "Harish M.",
    desc: "Eco-friendly hostel with a lush garden setting. Solar-powered, great food and a wonderful community.",
    facilities: ["📶 WiFi", "❄ AC", "🏋 Gym", "🍽 Meals", "🌿 Garden", "💡 Solar Power", "🏊 Pool"],
    reviews_data: [
      { author: "Rohini S.", stars: 5, text: "Love the peaceful environment. Food is organic and delicious. Highly recommended.", date: "Mar 2025" }
    ]
  },
  {
    id: 5,
    name: "City Comfort PG",
    location: "Begumpet, Hyderabad",
    price: 5000,
    rating: 4.9,
    reviews: 178,
    type: "Boys",
    tags: ["Premium", "AC", "WiFi", "Laundry"],
    grad: "img-grad-1",
    icon: "🏙",
    owner: "Prasad K.",
    desc: "Luxury PG accommodation in central Hyderabad. All rooms are fully furnished with individual AC and WiFi.",
    facilities: ["📶 WiFi", "❄ AC", "👕 Laundry", "🚗 Parking", "📹 CCTV", "🔒 Guard", "🛁 Attached Bath", "💡 Power Backup"],
    reviews_data: [
      { author: "Vijay R.", stars: 5, text: "Worth every rupee! The best PG experience I've had. Immaculate rooms and great service.", date: "Mar 2025" }
    ]
  }
];

function loadHostelsFromDisk() {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveHostelsToDisk() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(hostels, null, 2), "utf8");
}

let hostels = loadHostelsFromDisk();
if (!hostels) {
  hostels = JSON.parse(JSON.stringify(SEED_HOSTELS));
  saveHostelsToDisk();
}

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "NestHop backend running" });
});

app.get("/api/hostels", (req, res) => {
  res.json(hostels);
});

app.post("/api/hostels", (req, res) => {
  const { name, location, price, type, owner, desc, facilities } = req.body || {};

  if (!name || !location || !price || !type) {
    return res.status(400).json({ error: "name, location, price and type are required" });
  }

  const cleanedFacilities = Array.isArray(facilities)
    ? facilities.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  const hostel = {
    id: hostels.length ? Math.max(...hostels.map((h) => h.id)) + 1 : 0,
    name,
    location,
    price: Number(price),
    rating: 0,
    reviews: 0,
    type,
    tags: ["New"],
    grad: "img-grad-4",
    icon: "🏠",
    owner: owner || "Owner",
    desc: desc || "Newly listed hostel.",
    facilities: cleanedFacilities.length ? cleanedFacilities : ["📶 WiFi"],
    reviews_data: []
  };

  hostels.unshift(hostel);
  saveHostelsToDisk();
  res.status(201).json(hostel);
});

app.delete("/api/hostels/:id", (req, res) => {
  const id = Number(req.params.id);
  const ownerSubmitted = req.body && req.body.owner != null ? String(req.body.owner).trim() : "";
  const idx = hostels.findIndex((h) => h.id === id);
  if (idx === -1) return res.status(404).json({ error: "Hostel not found" });
  const ownerActual = String(hostels[idx].owner || "").trim();
  if (!ownerSubmitted || ownerSubmitted.toLowerCase() !== ownerActual.toLowerCase()) {
    return res.status(403).json({ error: "Owner name does not match this listing" });
  }
  hostels.splice(idx, 1);
  saveHostelsToDisk();
  res.json({ ok: true });
});

app.post("/api/hostels/:id/reviews", (req, res) => {
  const hostelId = Number(req.params.id);
  const { author = "You", stars, text } = req.body || {};

  const hostel = hostels.find((h) => h.id === hostelId);
  if (!hostel) return res.status(404).json({ error: "Hostel not found" });
  if (!stars || !text) return res.status(400).json({ error: "stars and text are required" });

  const review = {
    author,
    stars: Number(stars),
    text,
    date: "Just now"
  };

  hostel.reviews_data.unshift(review);
  hostel.reviews += 1;

  const totalStars = hostel.reviews_data.reduce((sum, r) => sum + Number(r.stars || 0), 0);
  hostel.rating = Number((totalStars / hostel.reviews_data.length).toFixed(1));

  saveHostelsToDisk();
  res.status(201).json(review);
});

app.use(express.static(path.resolve(__dirname, "..")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend.html"));
});

app.listen(PORT, () => {
  console.log(`NestHop server running at http://localhost:${PORT}`);
});
