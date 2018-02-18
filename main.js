var fs = require("fs");
var Jimp = require("jimp");

const RESOLUTION = 1024,    // resolution of the output pic
	ITER_COUNT = 20,        // number of iterations to be processed
	SAVE_ALL_ITERS = true,  // save all iterations or only the final one
	RANDOM_FILTERS = false, // randomize what filters will be used
	USE_CIRCLES = true,     // enable the "circles" filter
	USE_SINLINES = true,    // enable the "sinlines" filter
	USE_COSLINES = true,    // enable the "coslines" filter
	USE_SWIRL = true,       // enable the "swirl" filter
	USE_TANGRAD = true,     // enable the "tangrad" filter
	USE_TEST = false;       // enable testing of the custom filter




var usable_filters = [];
if (RANDOM_FILTERS) {

	if (getRandomInt(0, 4)) usable_filters.push("circles");
	if (getRandomInt(0, 4)) usable_filters.push("sinlines");
	if (getRandomInt(0, 4)) usable_filters.push("coslines");
	if (getRandomInt(0, 4)) usable_filters.push("swirl");
	if (getRandomInt(0, 4)) usable_filters.push("tangrad");

} else {

	if (USE_CIRCLES)  usable_filters.push("circles");
	if (USE_SINLINES) usable_filters.push("sinlines");
	if (USE_COSLINES) usable_filters.push("coslines");
	if (USE_SWIRL)    usable_filters.push("swirl");
	if (USE_TANGRAD)  usable_filters.push("tangrad");
	if (USE_TEST)     usable_filters.push("testfilter");
}


var stream = fs.createWriteStream("morph.log", {flags:'a'})

fs.writeFile('morph.log', '', function(err){if (err) console.log(err)}) // clean file
stream.write("start \n");


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min
}


var image = new Jimp(RESOLUTION, RESOLUTION, function (err, image) {

	var again = 0

	for (var i = 1; i <= ITER_COUNT; i++) {

		stream.write('\n' + "iteration " + i + '\n')

		if (!again) {
			var randPtX = getRandomInt(-RESOLUTION, RESOLUTION*2),
				randPtY = getRandomInt(-RESOLUTION, RESOLUTION*2)
		} else if (getRandomInt(0, 1)) {
			randPtX += getRandomInt(-50, 50)
			randPtY += getRandomInt(-50, 50)
		}

		var randPow = getRandomInt(0, 5),
			radius = getRandomInt(10, RESOLUTION/2),
			again = getRandomInt (0, 1)


		switch (usable_filters[Math.floor(Math.random() * usable_filters.length)]) {
			case "testfilter": 
				testfilter(this, randPtX, randPtY, randPow, radius)
				stream.write("TESTING A NEW FILTER at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
				break;
			case "circles":
				circles(this, randPtX, randPtY, randPow, radius)
				stream.write("circles at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
				break;
			case "sinlines":
				sinlines(this, randPtX, randPtY, randPow, radius)
				stream.write("sinlines at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
				break;
			case "coslines":
				coslines(this, randPtX, randPtY, randPow, radius)
				stream.write("coslines at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
				break;
			case "swirl":
				swirl(this, randPtX, randPtY, randPow, radius)
				stream.write("swirl at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
				break;
			case "tangrad":
				tangrad(this, randPtX, randPtY, randPow, radius)
				stream.write("tangrad at X = " + randPtX + " Y = " + randPtY + " radius = " + radius + "\n")
				break;
			case "default":
				stream.write("none of the filters could be applied")
		}

		if (SAVE_ALL_ITERS || i == ITER_COUNT) {
			image.write( "outp" + i + ".png" )
		}
	
	}
});


function circles(image, randPtX, randPtY, randPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * (dist ([randPtX, randPtY], [x, y]) / radius ) )
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * (dist ([randPtX, randPtY], [x, y]) / radius ) )
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * (dist ([randPtX, randPtY], [x, y]) / radius ) )
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function sinlines(image, randPtX, randPtY, randPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (RESOLUTION - 1), 
				ypercent = y / (RESOLUTION - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] + 127 + 0.5 * colA[0] * Math.sin(xpercent + ypercent))
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] + 127 + 0.5 * colA[1] * Math.sin(xpercent + ypercent))
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] + 127 + 0.5 * colA[2] * Math.sin(xpercent + ypercent))
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function coslines(image, randPtX, randPtY, randPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (RESOLUTION - 1), 
				ypercent = y / (RESOLUTION - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] + 127 + 0.5 * colA[0] * Math.cos(xpercent + ypercent))
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] + 127 + 0.5 * colA[1] * Math.cos(xpercent + ypercent))
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] + 127 + 0.5 * colA[2] * Math.cos(xpercent + ypercent))
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function swirl(image, randPtX, randPtY, randPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * (1 / dist ([randPtX, randPtY], [x, y]) * radius ) )
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * (1 / dist ([randPtX, randPtY], [x, y]) * radius ) )
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * (1 / dist ([randPtX, randPtY], [x, y]) * radius ) )
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function tangrad(image, randPtX, randPtY, randPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (RESOLUTION - 1), 
				ypercent = y / (RESOLUTION - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * Math.tan(xpercent) - colB[0] * Math.tan(ypercent))
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * Math.tan(xpercent) - colB[1] * Math.tan(ypercent))
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * Math.tan(xpercent) - colB[2] * Math.tan(ypercent))
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function gradient(image, randPtX, randPtY, randPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (RESOLUTION - 1), 
				ypercent = y / (RESOLUTION - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - (xpercent * colA[0] + (1 - xpercent) * colB[0]))
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - (xpercent * colA[1] + (1 - xpercent) * colB[1]))
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - (xpercent * colA[2] + (1 - xpercent) * colB[2]))
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function testfilter(image, randPtX, randPtY, randPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	// randPtX = 500
	// randPtY = 500

	var min = 999999,
		max = -999999

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (RESOLUTION - 1), 
				ypercent = y / (RESOLUTION - 1),
				coef = Math.random() % 100 / 100
				formula = dist ([randPtX, randPtY], [x, y]) * 0.01

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * formula)
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * formula)
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * formula)
			this.bitmap.data[ idx + 3 ] = 255;

			if (formula > max) {
				max = formula
			}
			if (formula < min) {
				min = formula
			}

	});

	stream.write("min = " + min + " max = " + max + "\n")
}


function dist(ptA, ptB) {
	return Math.hypot(ptA[0] - ptB[0], ptA[1] - ptB[1])
}


stream.write("end \n")