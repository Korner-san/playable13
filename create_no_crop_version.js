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

// Convert all images to base64
console.log('Converting images to base64...');
const img1Base64 = imageToBase64('page1.jpg');
const img2Base64 = imageToBase64('page2.jpg'); 
const img3Base64 = imageToBase64('page3.jpg');

if (!img1Base64 || !img2Base64 || !img3Base64) {
    console.error('Failed to convert one or more images');
    process.exit(1);
}

console.log('Images converted successfully!');
console.log(`Image 1 size: ${Math.round(img1Base64.length * 0.75 / 1024)}KB`);
console.log(`Image 2 size: ${Math.round(img2Base64.length * 0.75 / 1024)}KB`);
console.log(`Image 3 size: ${Math.round(img3Base64.length * 0.75 / 1024)}KB`);

// Read the template HTML
let htmlContent = fs.readFileSync('index_no_crop.html', 'utf8');

// Replace placeholders with actual base64 data
htmlContent = htmlContent.replace(/IMAGE1_BASE64_PLACEHOLDER/g, img1Base64);
htmlContent = htmlContent.replace(/IMAGE2_BASE64_PLACEHOLDER/g, img2Base64);
htmlContent = htmlContent.replace(/IMAGE3_BASE64_PLACEHOLDER/g, img3Base64);

// Write the final Facebook-compliant HTML
fs.writeFileSync('facebook_playable_no_crop.html', htmlContent);

const finalSize = Math.round(fs.statSync('facebook_playable_no_crop.html').size / 1024);
console.log(`\n✅ SUCCESS! Created facebook_playable_no_crop.html`);
console.log(`📊 Final file size: ${finalSize}KB (${finalSize < 5120 ? 'UNDER' : 'OVER'} Facebook's 5MB limit)`);
console.log(`🎯 Images will display WITHOUT cropping using object-fit: contain`);
console.log(`📱 Optimized for both desktop and mobile viewing`);

if (finalSize >= 5120) {
    console.log(`⚠️  WARNING: File size exceeds Facebook's 5MB limit!`);
    console.log(`💡 Consider compressing your images to reduce file size.`);
} 