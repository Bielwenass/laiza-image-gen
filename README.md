# Laiza Image Generator
A simple random abstract image generator on Node.js, built with the Jimp library.

## Generation process
Different mathematical functions that control the color channels (called "filters" from now on) are applied on top of each other to create chaotic patterns that sometimes result in interesting images.

## Examples of generated images
<p>
	<img src="https://imgur.com/DhPatow.png" width="400">
	<img src="https://imgur.com/Vo0uxLR.png" width="400">
  <img src="https://imgur.com/ShslMO2.png" width="400">
  <img src="https://imgur.com/KYEjeZb.png" width="400">
  <img src="https://imgur.com/sv8hEwx.png" width="400">
	<img src="https://imgur.com/n9NwdDV.png" width="400">
	<img src="https://imgur.com/hiaQtDf.png" width="400">
	<img src="https://imgur.com/4u4O3Yb.png" width="400">
</p>

## Setup
Node v17 is recommended.
```
git clone git@github.com:Bielwenass/laiza-image-gen.git
cd laiza-image-gen
yarn
node src/main.js
```

## Available settings
Can be changed in `settings.js`.

`resolution`: Width and height of the output pics (in pixels).

`iterationsCount`: Number of times filters will be applied. Lower values will make the result simplistic, and higher values will make it more complex (or, potentially, messy).

`imagesCount`: Number of images to generate.

`saveAllIterations`: Save all iterations or only the final one. The progress pics sometimes look better than the final output, especially with high `iterationsCount`. Useful for understanding how different filters affect the end result. Off by default.

`enableRandomNames`: Assign random filenames on save. Useful if you wish to generate multiple batches of images without new ones overwriting the old ones.

`saturationPredefined`: Images are desaturated by a random amount by default - colors are usually too intense, so this was introduced for more variety. However, if this value is set, it will always be used to control the saturation, with 1 meaning full saturation, 0 meaning black & white images, and everything inbetween.

`genMode`: Possible values are `normal`, `random`, and `test`.
- `normal` uses filters set to true in `filtersToUse`
- `random` uses randomly selected filters for each image (50% chance for each filter)
- `test` only uses the test filter

`filtersToUse`: Controls which filters are enabled in the normal generation mode.

## Filters
Samples of all implemented filters. Shown are 1, 2 and 3 iterations of a given filter applied to a blank image.

### Circles
<p>
  <img src="https://imgur.com/Ef7O3Ef.png" width="250">
  <img src="https://imgur.com/kOVO4Zb.png" width="250">
  <img src="https://imgur.com/sSZnyR5.png" width="250">
</p>

### Swirl
<p>
  <img src="https://imgur.com/wpRNdMd.png" width="250">
  <img src="https://imgur.com/PqdChcj.png" width="250">
  <img src="https://imgur.com/QuD4Sev.png" width="250">
</p>

### Sinlines
<p>
  <img src="https://imgur.com/0kvgppk.png" width="250">
  <img src="https://imgur.com/AUpZG52.png" width="250">
  <img src="https://imgur.com/vabLjSG.png" width="250">
</p>

### Coslines
<p>
  <img src="https://imgur.com/FIgCRzr.png" width="250">
  <img src="https://imgur.com/2En5YIL.png" width="250">
  <img src="https://imgur.com/XGvsJxU.png" width="250">
</p>

### Gradient
<p>
  <img src="https://imgur.com/5dFhRMy.png" width="250">
  <img src="https://imgur.com/t6HrkKJ.png" width="250">
  <img src="https://imgur.com/OGbqVxM.png" width="250">
</p>

### Tangrad
<p>
  <img src="https://imgur.com/rCHaEHD.png" width="250">
  <img src="https://imgur.com/1k99FQd.png" width="250">
  <img src="https://imgur.com/oHNNnbF.png" width="250">
</p>

### Fuzzy
<p>
  <img src="https://imgur.com/q0oZ1Qr.png" width="250">
  <img src="https://imgur.com/E2TCeOm.png" width="250">
  <img src="https://imgur.com/4pIk31h.png" width="250">
</p>

### Powremain
<p>
  <img src="https://imgur.com/20XmC4u.png" width="250">
  <img src="https://imgur.com/zkXpqjA.png" width="250">
  <img src="https://imgur.com/bme1mD6.png" width="250">
</p>

### Powsubtract
<p>
	<img src="https://imgur.com/timzxgR.png" width="250">
	<img src="https://imgur.com/FFO6iVI.png" width="250">
	<img src="https://imgur.com/5cV5Ee3.png" width="250">
</p>

License: MIT