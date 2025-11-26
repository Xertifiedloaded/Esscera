-- Seed initial data for Luxe Parfum

-- Insert admin user (password: admin123 - hashed with SHA-256)
INSERT INTO users (id, email, username, password, role) VALUES
  ('admin-001', 'admin@esscera.com', 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, price, category, image, available, seo_meta, created_by_id) VALUES
  ('prod-001', 'Noir Absolu', 'A captivating blend of dark oud, black amber, and vanilla bourbon. An enigmatic fragrance for the bold and mysterious.', 295, 'Eau de Parfum', '/luxury-black-perfume-bottle-gold-accents.jpg', true, 'Luxury oud perfume with amber and vanilla notes', 'admin-001'),
  ('prod-002', 'Or Royal', 'The essence of opulence. Rose de Mai, saffron, and precious woods create a regal symphony of scent.', 450, 'Parfum', '/luxury-gold-perfume-bottle-ornate-design.jpg', true, 'Royal rose and saffron luxury perfume', 'admin-001'),
  ('prod-003', 'Velvet Midnight', 'Whispers of jasmine sambac, tuberose, and musk create an intoxicating nocturnal elixir.', 325, 'Eau de Parfum', '/luxury-purple-velvet-perfume-bottle-elegant.jpg', true, 'Jasmine and tuberose evening perfume', 'admin-001'),
  ('prod-004', 'Amber Dynastie', 'A warm embrace of amber, benzoin, and labdanum. Timeless elegance in a bottle.', 275, 'Eau de Parfum', '/luxury-amber-colored-perfume-bottle-classic.jpg', true, 'Warm amber luxury fragrance', 'admin-001'),
  ('prod-005', 'Iris Impérial', 'The noble iris root meets Florentine orris and soft suede. Sophistication personified.', 520, 'Parfum', '/luxury-iris-purple-perfume-bottle-sophisticated.jpg', false, 'Iris and orris luxury perfume', 'admin-001'),
  ('prod-006', 'Bois Précieux', 'Rare sandalwood, cedar atlas, and vetiver create a refined woody masterpiece.', 385, 'Eau de Parfum', '/luxury-wooden-brown-perfume-bottle-masculine.jpg', true, 'Sandalwood and cedar luxury perfume', 'admin-001')
ON CONFLICT (id) DO NOTHING;

-- Insert CMS content
INSERT INTO cms_content (id, page, section, content) VALUES
  ('cms-001', 'home', 'hero', '{"title": "The Art of Luxury", "subtitle": "Discover Timeless Elegance", "description": "Exquisite fragrances crafted for those who appreciate the finer things in life."}'),
  ('cms-002', 'about', 'story', '{"title": "Our Heritage", "description": "Founded in the heart of Paris, LUXE PARFUM has been crafting exceptional fragrances for over a century."}'),
  ('cms-003', 'footer', 'contact', '{"address": "12 Avenue Montaigne, Paris 75008", "phone": "+33 1 42 68 00 00", "email": "contact@luxeparfum.com", "whatsapp": "+33612345678"}')
ON CONFLICT (page, section) DO NOTHING;
