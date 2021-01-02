const sample =
  'This is a sample HTML string<br /><p><img src="testtesttest.png" alt="" /></p><br /><p><img src="image-url-1.png" alt="" /></p>';

function getImages(htmlString: string) {
  const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
  const images = [];
  let img;
  while ((img = imgRex.exec(htmlString))) {
    images.push(img[1]);
  }
  return images;
}

const imgs = getImages(sample);
console.log(imgs); // ["image-url-1.png", "image-url-1.png"]
