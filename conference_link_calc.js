// for innovaphone JavaScript Runtime for App Service

var conf = {
    version: toUint8Array(0, 1),
    flags: toUint8Array(0, 1),
    roomNumberLength: toUint8Array(2, 1),
    roomNumber: toUint8Array(1, 4),
    meetingId: toUint8Array(1, 4),
    startTimestamp: toUint8Array(1679310000, 4),
    endTimestamp: toUint8Array(1710950400, 4),
    channels: toUint8Array(5, 2),
    mKey: Encoding.stringToBin("NSDSOSqS") // m-key property from config line of the Conference PBX Object
};


var confValues = [];
Object.keys(conf).forEach(function (key) { confValues.push(conf[key]) });

var hashInputBytes = mergeUint8Arrays(confValues);
log("Input for MD5 Digest: " + Encoding.binToHex(hashInputBytes));

var digest = Crypto.hash("MD5").update(hashInputBytes).final();
log("MD5 Digest: " + digest);

var creationTimestamp = toUint8Array(1679310000, 4);
confValues.pop(); // remove last element (mKey)
confValues.push(creationTimestamp); // add creationTimestamp instead
confValues.push(Encoding.hexToBin(digest)); // add MD5 hash from previous step

var base64InputBytes = mergeUint8Arrays(confValues);
log("Input for Base64 Encoding: " + Encoding.binToHex(base64InputBytes));

var result = Duktape.enc('base64', base64InputBytes);
log("Base64 String: " + result);


// helper functions

// convert decimal to Uint8Array of specific length with padding
function toUint8Array(decimal, arrayLength) {
    var binaryString = decimal.toString(2);  // Convert decimal to binary string
    var binaryStringLength = binaryString.length;
    var paddingLength = 8 * arrayLength - binaryStringLength;

    // Pad binary string with leading zeroes if necessary
    if (paddingLength > 0) {
        binaryString = new Array(paddingLength + 1).join('0') + binaryString;
    }

    var uint8Array = new Uint8Array(arrayLength);

    for (var i = 0; i < arrayLength; i++) {
        uint8Array[i] = parseInt(binaryString.slice(i * 8, (i + 1) * 8), 2);
    }

    return uint8Array;
}

function mergeUint8Arrays(arrays) {
    var totalLength = arrays.reduce(function (acc, value) {
        return acc + value.length;
    }, 0);

    if (arrays.length === 0) return null;

    var result = new Uint8Array(totalLength);

    var length = 0;
    for (var i = 0; i < arrays.length; i++) {
        result.set(arrays[i], length);
        length += arrays[i].length;
    }

    return result;
}