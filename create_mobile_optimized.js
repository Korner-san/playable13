const fs = require('fs');
const path = require('path');

// Function to convert image to base64
function imageToBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        return imageBuffer.toString('base64');
    } catch (error) {
        console.error(`Error reading ${imagePath}:`, error);
        return null;
    }
}

console.log('🚀 Creating mobile-optimized Facebook playable ad...');
console.log('📱 Optimized for 945x2048 phone screenshots');
console.log('🎯 80% content / 20% CTA split layout');

// Convert all images to base64
console.log('\n📸 Converting images to base64...');
const img1Base64 = imageToBase64('page1.jpg');
const img2Base64 = imageToBase64('page2.jpg'); 
const img3Base64 = imageToBase64('page3.jpg');

if (!img1Base64 || !img2Base64 || !img3Base64) {
    console.error('❌ Failed to convert one or more images');
    process.exit(1);
}

console.log('✅ Images converted successfully!');
console.log(`   📊 Image 1 size: ${Math.round(img1Base64.length * 0.75 / 1024)}KB`);
console.log(`   📊 Image 2 size: ${Math.round(img2Base64.length * 0.75 / 1024)}KB`);
console.log(`   📊 Image 3 size: ${Math.round(img3Base64.length * 0.75 / 1024)}KB`);

// Read the mobile-optimized template HTML
let htmlContent = fs.readFileSync('index_mobile_optimized.html', 'utf8');

// Replace placeholders with actual base64 data
htmlContent = htmlContent.replace(/IMAGE1_BASE64_PLACEHOLDER/g, img1Base64);
htmlContent = htmlContent.replace(/IMAGE2_BASE64_PLACEHOLDER/g, img2Base64);
htmlContent = htmlContent.replace(/IMAGE3_BASE64_PLACEHOLDER/g, img3Base64);

// Write the final Facebook-compliant HTML
fs.writeFileSync('facebook_mobile_playable.html', htmlContent);

const finalSize = Math.round(fs.statSync('facebook_mobile_playable.html').size / 1024);
const totalImageSize = Math.round((img1Base64.length + img2Base64.length + img3Base64.length) * 0.75 / 1024);

console.log('\n🎉 SUCCESS! Mobile-optimized playable ad created!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📄 File: facebook_mobile_playable.html`);
console.log(`📊 Total size: ${finalSize}KB (${finalSize < 5120 ? '✅ UNDER' : '❌ OVER'} Facebook's 5MB limit)`);
console.log(`🖼️  Images size: ${totalImageSize}KB`);
console.log(`📱 Layout: 80% article content / 20% CTA button`);
console.log(`🎯 Optimized for: 945x2048 mobile screenshots`);
console.log(`🚫 No cropping: Complete articles visible`);
console.log(`✅ Facebook compliant: Single HTML with embedded images`);

if (finalSize >= 5120) {
    console.log(`\n⚠️  WARNING: File size exceeds Facebook's 5MB limit!`);
    console.log(`💡 Consider compressing your images to reduce file size.`);
} else {
    console.log(`\n🚀 Ready to upload to Facebook Ads Manager!`);
}

console.log('\n📋 Features included:');
console.log('   ✅ Auto-advance every 5 seconds');
console.log('   ✅ Manual navigation with arrow button');
console.log('   ✅ Progress indicators');
console.log('   ✅ Touch-optimized for mobile');
console.log('   ✅ FbPlayableAd.onCTAClick() integration');
console.log('   ✅ Responsive design for all screen sizes');
console.log('   ✅ Smooth transitions between articles'); 