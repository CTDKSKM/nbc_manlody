export const colorExtractor = (imgTag:HTMLImageElement) => {
  const image = imgTag;
  const canvas = document.createElement('canvas');
  const ctx = canvas?.getContext('2d');

  canvas.width = image?.width;
  canvas.height = image?.height;
  ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData?.data as Uint8ClampedArray;

  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;

  for (let i = 0; i < pixels?.length; i += 4) {
    redSum += pixels[i];
    greenSum += pixels[i + 1];
    blueSum += pixels[i + 2];
  }

  const pixelCount = pixels.length / 4;
  const averageRed = Math.round(redSum / pixelCount);
  const averageGreen = Math.round(greenSum / pixelCount);
  const averageBlue = Math.round(blueSum / pixelCount);

  return [averageRed, averageGreen, averageBlue, 1]
};