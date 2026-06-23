INSERT INTO products (name, category, price, created_at, updated_at)
SELECT
  (ARRAY['Ultra','Pro','Elite','Smart','Nano','Hyper','Apex','Flux','Nova','Zen','Arc','Edge','Core','Peak','Prime','Swift','Bold','Pure','Volt','Aura','Lumix','Nexus','Orbit','Pixel'])[floor(random()*24+1)::int]
  || ' ' ||
  (ARRAY['Headphones','Speaker','Watch','Laptop','Tablet','Phone','Camera','Keyboard','Mouse','Monitor','Drone','Charger','Router','Earbuds','Projector','Console','Controller','Cable','Jacket','Shoes','Backpack','Sunglasses','Wallet','Belt','Gloves','Hat','Scarf','Sneakers','Hoodie','Vest','Novel','Guide','Journal','Planner','Handbook','Atlas','Memoir','Manual','Desk','Chair','Lamp','Mirror','Shelf','Rug','Pillow','Vase','Clock','Frame'])[floor(random()*48+1)::int]
  || ' ' ||
  (ARRAY['X1','V2','Pro','Max','Plus','SE','Lite','Ultra','2024','Gen2','Mini','Air','Sport','Series','Edition','GT'])[floor(random()*16+1)::int],
  (ARRAY['Electronics','Clothing','Books','Home & Garden','Sports','Toys','Automotive','Health & Beauty','Food & Grocery','Office Supplies'])[floor(random()*10+1)::int],
  ROUND((random()*2495+4.99)::numeric,2),
  NOW()-(random()*INTERVAL '730 days'),
  NOW()-(random()*INTERVAL '30 days')
FROM generate_series(1,200000);

SELECT COUNT(*) AS total_products FROM products;
