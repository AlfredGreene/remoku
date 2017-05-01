if (!Array.unique) Array.prototype.unique = function() {
	    var o = {}, i, l = this.length, r = [];
	    for(i=0; i<l;i+=1) o[this[i]] = this[i];
	    for(i in o) r.push(o[i]);
	    return r;
	    };

function dbg(it) {
	if (console.log) console.log(it);
	else alert (it);	
}

function stopFindRokus() {
    if (window.stop) {
        window.stop();
    }
    else if (document.execCommand) {
        document.execCommand("Stop", false);
    }   
}

//Use following javascript function to get domain name from URL.
//Example url: http://192.168.1.3:8060/query/icon/11
//Example return: 192.168.1.3
function getDomainFromUrl(url) {
	return url.match(/:\/\/(.[^/]+)\:/)[1];
}

function updateSelect() {
	rokuSelect.options = [];
	scannedRokus  = scannedRokus.unique();
	for (roku in scannedRokus) {
		rokuSelect.options[roku] = new Option(scannedRokus[roku], scannedRokus[roku]);
	}
}

function loadedImage() {
	var URL = this.src;
	scannedRokus.push(getDomainFromUrl(URL));
	updateSelect();
	foundRokus++;
	if (foundRokus == rokuCount) {
		stopFindRokus();
		scanButton.innerHTML="Scan";
		foundRokus = 0;
		}
}

function findRokus() {
	setRokuCount();
	if(!scanning){
		this.innerHTML="Stop";
		scanning = true;
		var images = [];
		for (i = 1; i < 255; i++) {
			images[i] = new Image();
			var URL = "http://" + myNetwork + "." + i + ":8060/query/icon/11";
			images[i].onload = loadedImage;
			images[i].src = URL;
		}
	}
	else{
		scanning = false;
		this.innerHTML="Scan";
		stopFindRokus();
	}
}
function setMyNetwork() {
	myNetwork = [octet1.value,octet2.value,octet3.value].join(".");
	localStorage.setItem('myNetwork', myNetwork);
}

function setRokuCount() {
	rokuCount = numField.value;
	localStorage.setItem('rokuCount', rokuCount);
}

//Create/Initialize globals
var rokuSelect;
var myNetwork;
var octet1;
var octet2;
var octet3;
var scanButton;
var scanning = false;
var foundRokus = 0;
var rokus = [];
var rokuCount;
var numField;
var scannedRokus = [];
var manualRokus = [];

window.onload = function () {
//GUI Initilization	
	rokuSelect = document.getElementById("rokus");
	octet1 = document.getElementById('octet1');
	octet2 = document.getElementById('octet2');
	octet3 = document.getElementById('octet3');
	octet1.onchange = setMyNetwork;
	octet2.onchange = setMyNetwork;
	octet3.onchange = setMyNetwork;
	myNetwork = localStorage.getItem('myNetwork') ? localStorage.getItem('myNetwork') : "192.168.1";
	var octets = myNetwork.split(".");
	octet1.value=octets[0];
	octet2.value=octets[1];
	octet3.value=octets[2];

	rokuCount = localStorage.getItem('rokuNum') ? localStorage.getItem('rokuNum') : "1";
	numField = document.getElementById('num');
	numField.value = rokuCount;
	numField.onchange = setRokuCount;
	scanButton = document.getElementById('scanforroku');
	scanButton.onclick = findRokus;
	
}