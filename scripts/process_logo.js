import { Jimp } from 'jimp';

async function process() {
    try {
        const image = await Jimp.read('../public/favicon.png');
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        const getRGBA = (x, y) => {
            const color = image.getPixelColor(x, y);
            return {
                r: (color >> 24) & 255,
                g: (color >> 16) & 255,
                b: (color >> 8) & 255,
                a: color & 255
            };
        };

        const corner = getRGBA(0, 0);
        console.log(`Corner: A=${corner.a}, R=${corner.r}, G=${corner.g}, B=${corner.b}`);

        const TARGET_R = 155;
        const TARGET_G = 107;
        const TARGET_B = 72;

        image.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const a = this.bitmap.data[idx + 3];

            // Calculate distance from corner color (background)
            const dist = Math.sqrt(
                Math.pow(r - corner.r, 2) +
                Math.pow(g - corner.g, 2) +
                Math.pow(b - corner.b, 2)
            );

            // Strategy: If pixel determines it's NOT background, recolor it.
            // If corner is transparent, background is transparent (A=0).
            // If corner is white, background is white.

            const isBackground = (corner.a < 10 && a < 10) || (corner.a >= 10 && dist < 30); // Threshold of 30

            if (!isBackground && a > 10) {
                this.bitmap.data[idx + 0] = TARGET_R;
                this.bitmap.data[idx + 1] = TARGET_G;
                this.bitmap.data[idx + 2] = TARGET_B;
                // Force alpha to 255 if it was semi-transparent? No, keep alpha for antialiasing.
                // But if it was white on white, alpha might be full.
                // If we are recoloring "black" text to "orange", we keep alpha.
            }
        });

        await image.write('../public/logo_orange.png');
        console.log("Success: ../public/logo_orange.png written");

    } catch (err) {
        console.error(err);
    }
}

process();
