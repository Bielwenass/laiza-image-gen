var fs = require("fs");
var Jimp = require("jimp");

const resolution = 1024;



var stream = fs.createWriteStream("morph.log", {flags:'a'});

fs.writeFile('morph.log', '', function(err){if (err) console.log(err)}) // clean file
stream.write("start \n");


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}


var image = new Jimp(resolution, resolution, function (err, image) {

	var again = 0

	for (var i = 1; i < 26; i++) {

		stream.write("iteration " + i + '\n')

		if (!again) {
			var rdptX = getRandomInt(-resolution, resolution*2),
				rdptY = getRandomInt(-resolution, resolution*2)
		} else if (getRandomInt(0, 2)) {
			rdptX += getRandomInt(-50, 50)
			rdptY += getRandomInt(-50, 50)
		}

		var rdpow = getRandomInt(0, 5),
			radius = getRandomInt(10, resolution/2),
			again = getRandomInt (0, 2)

		switch (getRandomInt(0, 4)) {
			case 0:
				circles(this, rdptX, rdptY, rdpow, radius)
				stream.write("circles at X = " + rdptX + " Y = " + rdptY + " radius = " + radius + "\n")
				break;
			case 1:
				sinlines(this, rdptX, rdptY, rdpow, radius)
				stream.write("sinlines at X = " + rdptX + " Y = " + rdptY + " radius = " + radius + "\n")
				break;
			case 2:
				swirl(this, rdptX, rdptY, rdpow, radius)
				stream.write("swirl at X = " + rdptX + " Y = " + rdptY + " radius = " + radius + "\n")
				break;
			case 3:
				tangrad(this, rdptX, rdptY, rdpow, radius)
				stream.write("tangrad at X = " + rdptX + " Y = " + rdptY + " radius = " + radius + "\n")
				break;
		}

		// testfilter(this, rdptX, rdptY, rdpow, radius)

		image.write( "outp" + i + ".png" );
	
	}

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
		this.bitmap.data[ idx + 3 ] = 255
	});

	image.write("outpfinal.png")
});


function circles(image, rdPtX, rdPtY, rdPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (resolution - 1), 
				ypercent = y / (resolution - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * (dist ([rdPtX, rdPtY], [x, y]) / radius ) )
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * (dist ([rdPtX, rdPtY], [x, y]) / radius ) )
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * (dist ([rdPtX, rdPtY], [x, y]) / radius ) )
			this.bitmap.data[ idx + 3 ] = 255
			
	});
}


function sinlines(image, rdPtX, rdPtY, rdPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (resolution - 1), 
				ypercent = y / (resolution - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] + 127 + 0.5 * colA[0] * Math.sin(xpercent + ypercent))
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 0 ] + 127 + 0.5 * colA[1] * Math.sin(xpercent + ypercent))
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 0 ] + 127 + 0.5 * colA[2] * Math.sin(xpercent + ypercent))
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function swirl(image, rdPtX, rdPtY, rdPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (resolution - 1), 
				ypercent = y / (resolution - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * (1 / dist ([rdPtX, rdPtY], [x, y]) * radius ) )
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * (1 / dist ([rdPtX, rdPtY], [x, y]) * radius ) )
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * (1 / dist ([rdPtX, rdPtY], [x, y]) * radius ) )
			this.bitmap.data[ idx + 3 ] = 255
			
	});
}


function tangrad(image, rdPtX, rdPtY, rdPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	// rdptX = 0
	// rdptY = 0

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (resolution - 1), 
				ypercent = y / (resolution - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * Math.tan(xpercent) - colB[0] * Math.tan(ypercent))
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * Math.tan(xpercent) - colB[1] * Math.tan(ypercent))
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * Math.tan(xpercent) - colB[2] * Math.tan(ypercent))
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function gradient(image, rdPtX, rdPtY, rdPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (resolution - 1), 
				ypercent = y / (resolution - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - (xpercent * colA[0] + (1 - xpercent) * colB[0]))
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - (xpercent * colA[1] + (1 - xpercent) * colB[1]))
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - (xpercent * colA[2] + (1 - xpercent) * colB[2]))
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function testfilter(image, rdPtX, rdPtY, rdPow, radius) {
	var colA = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 200)], colB = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)]

	// rdptX = 0
	// rdptY = 0

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {      

			var xpercent = x / (resolution - 1), 
				ypercent = y / (resolution - 1)

			this.bitmap.data[ idx + 0 ] = Math.abs(this.bitmap.data[ idx + 0 ] - colA[0] * Math.tan(xpercent / ypercent) )
			this.bitmap.data[ idx + 1 ] = Math.abs(this.bitmap.data[ idx + 1 ] - colA[1] * Math.tan(xpercent / ypercent) )
			this.bitmap.data[ idx + 2 ] = Math.abs(this.bitmap.data[ idx + 2 ] - colA[2] * Math.tan(xpercent / ypercent) )
			this.bitmap.data[ idx + 3 ] = 255
	});
}


function dist(ptA, ptB) {
	return Math.hypot(ptA[0] - ptB[0], ptA[1] - ptB[1])
}


stream.write("end \n")