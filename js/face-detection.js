//console.log(faceapi.nets)

async function loadImageFromUpload() {
    const imgFile = $('#queryImgUploadInput').get(0).files[0]
    const img = await faceapi.bufferToImage(imgFile)
    $('#inputImg').get(0).src = img.src
    //updateResults()
    detectFace()
}



function getCurrentFaceDetectionNet() {
    return faceapi.nets.ssdMobilenetv1
}
function isFaceDetectionModelLoaded() {
    return getCurrentFaceDetectionNet().isLoaded
}

const modelPath = 'models';
async function loadModels(e) {
    console.log("c2")
    $('.loading').show()
    Promise.all([
        await faceapi.loadSsdMobilenetv1Model(modelPath), //be cafreful not to delete ","
        await faceapi.loadFaceLandmarkModel(modelPath),
        //faceapi.loadFaceLandmarkTinyModel(modelPath), //tiny = true 
    ]).then(function () {
        $('.loading').hide()
        console.log(getCurrentFaceDetectionNet())
        console.log(isFaceDetectionModelLoaded())
        if (isFaceDetectionModelLoaded())
            detectFace()
    })
}



var results
async function detectFace(e) {
    const input = document.getElementById('inputImg')
    const canvas = $('#overlay').get(0)
    results = await faceapi.detectAllFaces(input).withFaceLandmarks()
    // Tinylandmark: results = await faceapi.detectAllFaces(input).withFaceLandmarks(true)
    console.log(results)
    console.log("c3")
    drawLotto()
    faceapi.matchDimensions(canvas, input)
    const resizedResults = faceapi.resizeResults(results, input)
    console.log(resizedResults)
    faceapi.draw.drawDetections(canvas, resizedResults)
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults)
}

function drawLotto() {
    var length = results[0].landmarks.relativePositions.length;
    console.log(length);
    var step = parseInt(results[0].landmarks.relativePositions.length / 12);
    console.log(step);
    var i;
    var j = 0;
    var k;
    var ll;
    var samenumflag = 0;
    var lottonum = new Array(6);
    console.log(lottonum);
    for (i = 0; i < length; i += step) {
        samenumflag = 0;
        console.log("i=" + i + ", j=" + j);
        // console.log(i);
        // console.log(results[0].landmarks.relativePositions[i].x);
        // console.log(results[0].landmarks.relativePositions[i].y);
        var xplusy = parseInt((results[0].landmarks.relativePositions[i].x + results[0].landmarks.relativePositions[i].y) * 200 % 45);
        console.log(xplusy);

        if (xplusy == 0)
            continue;


        for (k = 0; k < j; k++) {
            if (lottonum[k] == xplusy) {
                console.log("find the same number at " + k, xplusy);
                samenumflag = 1;
            }
        }

        if (samenumflag == 0) {
            lottonum[j] = xplusy;
            j++;
        }

        if (j > 5)
            break;

        // var strnum = xplusy.toString();
        // console.log(strnum);
        // console.log(strnum[0]);
    }

    if (j > 5) {

        for (ll = 0; ll < 6; ll++) {
            console.log(lottonum[ll]);
        }

    } else {
        console.log("few numbers");
        for (ll = j; ll < 6; ll++) {
            lottonum[ll] = 45 - ll;
            console.log(lottonum[ll]);
        }
    }

    lottonum.sort(function (a, b) { // 오름차순
        return a - b;
        // 1, 2, 3, 4, 10, 11
    });

    // document.getElementById("print_lottonum").innerHTML = lottonum.toString();

    document.getElementById("span1_id").innerHTML = lottonum[0].toString();
    document.getElementById("span2_id").innerHTML = lottonum[1].toString();
    document.getElementById("span3_id").innerHTML = lottonum[2].toString();
    document.getElementById("span4_id").innerHTML = lottonum[3].toString();
    document.getElementById("span5_id").innerHTML = lottonum[4].toString();
    document.getElementById("span6_id").innerHTML = lottonum[5].toString();


}

$(document).ready(function () {
    console.log("c1")
    loadModels()
})
