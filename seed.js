cat > seed.js <<'EOL'
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/petalglow";

const productSchema = new mongoose.Schema({
  name: String, price: Number, description: String, image: String, category: String
});
const Product = mongoose.model("Product", productSchema);

async function seed(){
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  await Product.deleteMany({});
  await Product.insertMany([
    { name: "PetalGlow Pink Lip Gloss", price: 249, description: "Smooth & shiny lip gloss", image: "https://i.imgur.com/FqTg1.png", category: "Lips" },
    { name: "Rose Blush Palette", price: 499, description: "Beautiful pink tone blush kit", image: "https://i.imgur.com/3s4G2.png", category: "Face" },
    { name: "Mascara VolumeX", price: 299, description: "Makes lashes longer & thicker", image: "https://i.imgur.com/d5R91.png", category: "Eyes" }
  ]);
  console.log("✅ Seeded products");
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
EOL
