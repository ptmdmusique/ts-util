"use strict";
var sample = 'This is a sample HTML string<br /><p><img src="testtesttest.png" alt="" /></p><br /><p><img src="image-url-1.png" alt="" /></p>';
function getImages(htmlString) {
    var imgRex = /<img.*?src="(.*?)"[^>]+>/g;
    var images = [];
    var img;
    while ((img = imgRex.exec(htmlString))) {
        images.push(img[1]);
    }
    return images;
}
var imgs = getImages(sample);
console.log(imgs); // ["image-url-1.png", "image-url-1.png"]
