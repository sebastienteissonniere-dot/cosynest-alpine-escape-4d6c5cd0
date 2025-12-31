const Jimp = require('jimp');

async function inspect() {
    try {
        const image = await Jimp.read('../public/logo_from_favicon.png');
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const cornerPixel = Jimp.intToRGBA(image.getPixelColor(0, 0));
        const centerPixel = Jimp.intToRGBA(image.getPixelColor(width / 2, height / 2));
        
        console.log(`Dimensions: ${width}x${height}`);
        console.log(`Corner Pixel (0,0): R=${cornerPixel.r}, G=${cornerPixel.g}, B=${cornerPixel.b}, A=${cornerPixel.a}`);
        console.log(`Center Pixel: R=${centerPixel.r}, G=${centerPixel.g}, B=${centerPixel.b}, A=${centerPixel.a}`);
    } catch (err) {
        console.error(err);
    }
}

inspect();
