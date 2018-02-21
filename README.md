# Laiza Image Generator
This is a simple abstract image generator for Node.js built on Jimp library. You can control the generation process through settings.

Important! I recently updated the generator and many new features / filters are not covered in this readme file. You can find a brief description inside main.js, and the readme will be updated in a bit.

### Available settings
These can be changed right at the top of main.js

RESOLUTION - Pretty straightforward: resolution of the output pic (all the pictures are square). 1024 by default.

ITER_COUNT - Number of iterations to be processed. 20 by default.

SAVE_ALL_ITERS - Save all iterations or only the final one. Keeping this true is recommended since often the final pic looks worse than the ones before it. True by default.

RANDOM_FILTERS = Randomize what filters will be used. All filters have a 80% chance to appear. False by default.

USE_CIRCLES - Enable the "circles" filter. True by default.

USE_SINLINES - Enable the "sinlines" filter. True by default.

USE_COSLINES - Enable the "coslines" filter. True by default.

USE_SWIRL - Enable the "swirl" filter. True by default.

USE_TANGRAD - Enable the "tangrad" filter. True by default.

USE_TEST - Enable testing of the custom filter. False by default.


## Some examples of images you can get

<img src="https://imgur.com/DhPatow.png" width="400" height="400">
<img src="https://imgur.com/KYEjeZb.png" width="400" height="400">
<img src="https://imgur.com/sv8hEwx.png" width="400" height="400">
<img src="https://imgur.com/4u4O3Yb.png" width="400" height="400">

## Though many of the times they will look like these

<img src="https://imgur.com/r5khsAX.png" width="400" height="400">
<img src="https://imgur.com/gOFqZ7H.png" width="400" height="400">
<img src="https://imgur.com/X8JSegd.png" width="400" height="400">
<img src="https://imgur.com/8SzeXNf.png" width="400" height="400">

## Filters
### Circles
<img src="https://imgur.com/it61PCT.png" width="400" height="400">

### Swirl
<img src="https://imgur.com/oHUXJWH.png" width="400" height="400">

### Coslines
<img src="https://imgur.com/g7ZhTGZ.png" width="400" height="400">

### Sinlines
<img src="https://imgur.com/eI7UDsE.png" width="400" height="400">

### Tangrad
<img src="https://imgur.com/n1FukFT.png" width="400" height="400">


License: MIT