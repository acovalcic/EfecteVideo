"use strict";

let effect = "normal";

let video = document.getElementById('video');
let canvas = document.getElementById('canvasProcessed');
let context = canvas.getContext('2d');

let buttons = document.getElementsByClassName("effectType");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
        context.restore();
        context.save();
        window.effect = this.dataset.effect;
        effect = this.dataset.effect;
    });
}

video.addEventListener('play', function () {
    draw(video, context);
    if (video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight) {
        canvas.width = video.clientWidth;
        canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
    }
}, false);

window.addEventListener('resize', function(){    
        canvas.width = video.clientWidth;
        canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
});

function draw(video, context) {
    if (video.paused || video.ended) {
        return false;
    }

    switch (effect) {
        case "normal":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            break;
        case "rotation":
            let unghi = 3 * Math.PI / 180;
            let ct = Math.cos(unghi), st = Math.sin(unghi);
            let x = video.clientWidth / 2, y = video.clientHeight / 2;
            context.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            context.fillText("Rotation Effect", 10, 10);
            break;
        case "emboss":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let pixels = imageData.data;
            let imgDataWidth = imageData.width;

            for (let i = 0; i < pixels.length; i++) {
                if (i % 4 != 3) {
                    pixels[i] = 127 + 2 * pixels[i] - pixels[i + 4] - pixels[i + imgDataWidth * 4];
                }
            }
            context.putImageData(imageData, 0, 0);
            context.fillText("Emboss Effect", 10, 10);
            break;
        case "blackWhite":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData1 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let data = imageData1.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const average = Math.round((r + g + b) / 3);

                data[i] = data[i + 1] = data[i + 2] = average;
            }
            context.putImageData(imageData1, 0, 0);
            break;
        case "threshold":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData7 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let data7 = imageData7.data;
            for (let i = 0; i < data7.length; i += 4) {
                const r = data7[i];
                const g = data7[i + 1];
                const b = data7[i + 2];

                const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                data7[i] = data7[i + 1] = data7[i + 2] = (v >= 100) ? 255 : 0;
            }
            context.putImageData(imageData7, 0, 0);
            break;
        case "sepia":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData8 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let data8 = imageData8.data;
            for (let i = 0; i < data8.length; i += 4) {
                const r = data8[i];
                const g = data8[i + 1];
                const b = data8[i + 2];

                data8[i] = Math.round((r * .393) + (g * .769) + (b * .189));
                data8[i + 1] = Math.round((r * .349) + (g * .686) + (b * .168));
                data8[i + 2] = Math.round((r * .272) + (g * .534) + (b * .131));
            }
            context.putImageData(imageData8, 0, 0);
            break;
        case "invert":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData6 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let data6 = imageData6.data;
            for (let i = 0; i < data6.length; i += 4) {
                const r = data6[i];
                const g = data6[i + 1];
                const b = data6[i + 2];

                data6[i] = 255 - r;
                data6[i + 1] = 255 - g;
                data6[i + 2] = 255 - b;
            }
            context.putImageData(imageData6, 0, 0);
            break;
        case "pixelate":
            const blocksize = 4;
            let canvas2 = document.createElement("canvas");
            canvas2.width = canvas.width;
            canvas2.height = canvas.height;
            const context2 = canvas2.getContext("2d");
            context2.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            for (var i = 0; i < canvas.width; i += blocksize) {
                for (var j = 0; j < canvas.height; j += blocksize) {
                    var pixel = context2.getImageData(i, j, 1, 1);
                    context.fillStyle = "rgb(" + pixel.data[0] + "," + pixel.data[1] + "," + pixel.data[2] + ")";
                    context.fillRect(i, j, i + blocksize - 1, j + blocksize - 1);
                }
            }
            break;
        case "twoChannels":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            var imageData5 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            var data5 = imageData5.data;

            for (let i = 0; i < data5.length; i += 4) {
                var r = data5[i];
                var g = data5[i + 1];
                var b = data5[i + 2];

                data5[i] = r;
                data5[i + 1] = g;
                data5[i + 2] = g;
            }
            context.putImageData(imageData5, 0, 0);
            break;
        case "red":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData3 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let data3 = imageData3.data;
            for (let i = 0; i < data3.length; i += 4) {
                const r = data3[i];
                const g = data3[i + 1];
                const b = data3[i + 2];

                data3[i] = r;
                data3[i + 1] = 0;
                data3[i + 2] = 0;
            }

            context.putImageData(imageData3, 0, 0);

            break;
        case "green":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData4 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let data4 = imageData4.data;
            for (let i = 0; i < data4.length; i += 4) {
                const r = data4[i];
                const g = data4[i + 1];
                const b = data4[i + 2];

                data4[i] = 0;
                data4[i + 1] = g;
                data4[i + 2] = 0;
            }

            context.putImageData(imageData4, 0, 0);

            break;
        case "blue":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData2 = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let data2 = imageData2.data;
            for (let i = 0; i < data2.length; i += 4) {
                const r = data2[i];
                const g = data2[i + 1];
                const b = data2[i + 2];

                data2[i] = 0;
                data2[i + 1] = 0;
                data2[i + 2] = b;
            }

            context.putImageData(imageData2, 0, 0);
            break;
    }
    
    setTimeout(draw, 66, video, context);
}