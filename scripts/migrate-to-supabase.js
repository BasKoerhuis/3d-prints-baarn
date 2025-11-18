const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  console.log('🚀 Starting migration...\n');

  // Migrate products
  try {
    const productsPath = path.join(__dirname, '../data/products.json');
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      
      console.log(`📦 Migrating ${products.length} products...`);
      
      for (const product of products) {
        const { error } = await supabase.from('products').insert({
          // Laat id weg - Supabase genereert nieuwe UUID
          name: product.name,
          slug: product.slug,
          short_description: product.shortDescription,
          long_description: product.longDescription,
          dimensions: product.dimensions,
          features: product.features,
          price_child: product.priceChild,
          price_adult: product.priceAdult,
          images: product.images || [],
          in_stock: product.inStock
        });
        
        if (error) {
          console.log(`❌ Error migrating product ${product.name}:`, error.message);
        } else {
          console.log(`✅ Migrated: ${product.name}`);
        }
      }
    }
  } catch (error) {
    console.log('❌ Products migration error:', error.message);
  }

  // Migrate gallery
  try {
    const galleryPath = path.join(__dirname, '../data/gallery.json');
    if (fs.existsSync(galleryPath)) {
      const gallery = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));
      
      console.log(`\n🖼️  Migrating ${gallery.length} gallery images...`);
      
      for (const image of gallery) {
        const { error } = await supabase.from('gallery').insert({
          // Laat id weg - Supabase genereert nieuwe UUID
          filename: image.filename,
          path: image.path,
          alt: image.alt,
          tags: image.tags || []
        });
        
        if (error) {
          console.log(`❌ Error migrating image ${image.filename}:`, error.message);
        } else {
          console.log(`✅ Migrated: ${image.filename}`);
        }
      }
    }
  } catch (error) {
    console.log('❌ Gallery migration error:', error.message);
  }

  console.log('\n🎉 Migration complete!');
}

migrate();
