//REMOKU
//A. Cassidy Napoli
//Copyright 2011 
//Licensed: NEW BSD

////////////////////////
//BEGIN HELPER FUNCTIONS

if (!Array.unique) Array.prototype.unique = function() {
	    var o = {}, i, l = this.length, r = [];
	    for(i=0; i<l;i+=1) o[this[i]] = this[i];
	    for(i in o) r.push(o[i]);
	    return r;
};

function isBadBrowser(){
	//Blacklisted browsers claim to support localStorage, but don't follow spec
	
	//Fluid claims to support localStorage, but clears it when app is quit
	if (navigator.userAgent.indexOf('FluidApp')!=-1) return true;
	
	//Older browsers might not have localStorage support
	if (!localStorage.getItem) return true;
	
	//otherwise localStorage will be used
	return false;
}

function is_touch_device() {  
	if ("ontouchstart" in document.documentElement){
		return true;
	} else {
		return false;
	}		
//   try {  
//     document.createEvent("TouchEvent");  
//     return true;  
//   } catch (e) {  
//     return false;  
//   }  
}

function getConfig(name){
	if (useCookies){
		return readCookie(name);
	} else {
		return localStorage.getItem(name);
	}
}
	
function setConfig(name, value){
	if (useCookies){
		createCookie(name, value);
	} else {
		localStorage.setItem(name, value);
	}

}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function dbg(log){
	if (console.log) console.log(log);
	//else alert (log);
	dbgOut.innerHTML += log + "<br><br>";	
}

function ver(log){
	if (console.log) console.log(log);
	//else alert (log);
	ver = document.getElementById("ver");
	ver.innerHTML = log;	
}

//function: include(array, obj)

//include([1,2,3,4], 3); // true
//include([1,2,3,4], 6); // undefined
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}


/* function name: getElementByClass
* purpose: gets all elements based off of a class
* input: String, String (optional)
* output: none
* http://www.actiononline.biz/web/code/how-to-getelementsbyclass-in-javascript-the-code/
*/
function getElementsByClass(theClass, classType)
{
	//pulls the elements based off of their tag
	//if one is not specified, it will pull everything
	var allHTMLTags=document.getElementsByTagName((classType?classType:'*'));

	//temp array that is going to grab our elements
	var returnerArray = new Array();

	//go through the main array of elements
	for (var i=0; i<allHTMLTags.length; i++)
	{
		//if the element is within the class we want
		//we will add it to our array
		if (allHTMLTags[i].className==theClass)
		{
		returnerArray.push(allHTMLTags[i]);
		}
	}

	//send the array back to the calling function
	return returnerArray;
}

function preventMove(event){
	event.preventDefault();
}

function stopFindRokus() {
    if (window.stop) {
        window.stop();
    }
    else if (document.execCommand) {
        document.execCommand("Stop", false);
    }
    clearTimeout(timeouts);
    for (i = 1;i < 255; i++){
	    images[i] = new Image;
	    images[i].onload=null;
	    images[i].onerror=null;
	    images[i].src="";
	    }
}
//Use following javascript function to get domain from URL.
//Example url: http://192.168.1.3:8060/query/icon/11
//Example return: 192.168.1.3
function getDomainFromUrl(url) {
	return url.match(/:\/\/(.[^/]+)\:/)[1];
}

//END HELPER FUNCTIONS
//////////////////////



///////////////////////////
//BEGIN DISCOVERY FUNCTIONS

function updateSelect() {
	while (rokuSelect.length>0){
		rokuSelect.remove(rokuSelect.length -1);
	}
	remotesPopup.innerHTML="";
	var remoteUl = document.createElement("ul");
	var remoteLis = [];
	rokus  = scannedRokus.concat(manualRokus).unique();
	
	for (i=0;i<rokus.length;i++) {
		if(rokus[i]!=null){
			if(rokus.length==1){
				rokuAddress=rokus[i];
				setConfig('rokuAddress', rokuAddress);
			}
			var rokuSelected = rokuAddress==rokus[i] ? true : false;
			rokuSelect.options[i] = new Option(rokus[i], rokus[i], rokuSelected, rokuSelected);
			remoteLis[i] = document.createElement("li");
			remoteLis[i].innerHTML = rokus[i];
			if(rokuSelected)remoteLis[i].setAttribute("class","selected");
			remoteLis[i].id="remote"+ [i];
			remoteLis[i].onclick = function(){
				remotesPopup.setAttribute("class","hidden");
				var rokuId = (this.id).substring(6);
				rokuAddress=rokus[rokuId];
				setConfig('rokuAddress', rokuAddress);	
				updateSelect();
			}	
			remoteUl.appendChild(remoteLis[i]);
		}
	}
	remotesPopup.appendChild(remoteUl);
	if(rokuAddress==undefined || rokuAddress=="")rokuAddress=rokus[0];
}

function addRoku(){
	manualRokus.push(manualInput.value);
	manualRokus = manualRokus.unique();
	setConfig('manualRokus', manualRokus.join(","));
	buildManualRokusMenu();
	updateSelect();
	return false;
}

function removeRoku(){
	try{
		var removedRoku = manualSelect[manualSelect.selectedIndex].value;
	}
	catch(err){
		//dbg(err);
	}
	//dbg(removedRoku);
	for (i = 0; i<manualRokus.length;i++){
		if(removedRoku==manualRokus[i])manualRokus.splice(i,1);
		}
	manualRokus = manualRokus.unique();
	setConfig('manualRokus', manualRokus.join(","));
	buildManualRokusMenu();
	updateSelect();
	return false;
}

function buildManualRokusMenu(){
	while (manualSelect.length>0){
		manualSelect.remove(manualSelect.length - 1);
	}
	manualRokus = manualRokus.unique();
	for (i = 0; i<manualRokus.length; i++){
		var rokuSelected = rokuAddress==manualRokus[i] ? true : false;
		//alert(manualRokus[i]);
		manualSelect.options[i] = new Option(manualRokus[i], manualRokus[i], rokuSelected);
	}
	if (manualRokus.length>0) manualSelect.disabled = false;
	else manualSelect.disabled = true;
}


function loadedImage() {
	var URL = this.src;
	scannedRokus.push(getDomainFromUrl(URL));
	ipCount++;
	//dbg("ipCount: " + ipCount);
	if(scannedRokus.length<=rokuCount){
		if(ipPos<255){
			ipPos++;
			images[ipPos].src = URLS[ipPos];
			timeouts = setTimeout('cancelImage('+ ipPos +');', 500);	
		}
		setConfig('scannedRokus', scannedRokus.join(","));
		scanResults.innerHTML = "Scanning " + (254-ipCount) +  " addresses. " + scannedRokus.length + " Rokus found.";
		updateSelect();
	}
	if (scannedRokus.length>=rokuCount || ipCount>=254 || ipPos>=254) {
		scanButton.innerHTML="Scan";
		ipCount=0;
		ipPos = 0;
		scanning = false;
		scanResults.setAttribute("class","hidden");
		stopFindRokus();
		clearTimeout(timeouts);
		}
}

function imageError(){
	ipCount++;
	scanResults.innerHTML = "Scanning " + (254-ipCount) +  " addresses. " + scannedRokus.length + " Rokus found.";
	//dbg("ipCount: " + ipCount);
	if(ipCount>=254){
		scanButton.innerHTML="Scan";
		scanning = false;
		ipCount = 0;
		ipPos = 0;
		
		clearTimeout(timeouts);
		stopFindRokus();
		if (scannedRokus.length<1)scanResults.innerHTML = "No Rokus Found. Check your network settings.";
		if (scannedRokus.length<1)dbg("No Rokus Found. Check your network settings.");
	} else if(ipPos<255) {
		ipPos++;
		images[ipPos].src = URLS[ipPos];
		timeouts = setTimeout('cancelImage('+ ipPos +');', 500);	
	}
}

function cancelImage(i) {
	//dbg('cancelImage:'+i);
	images[i].onload=null;
	images[i].onerror=null;
	//images[i].src=null;
//	imageError();
	ipCount++;
	ipPos++;
	//dbg('ipPos:'+ipPos);
	scanResults.innerHTML = "Scanning " + (254-ipCount) +  " addresses. " + scannedRokus.length + " Rokus found.";
	if(ipCount>=254){
		scanButton.innerHTML="Scan";
		scanning = false;
		ipCount = 0;
		ipPos = 0;
		
		clearTimeout(timeouts);
		stopFindRokus();
		if (scannedRokus.length<1)scanResults.innerHTML = "No Rokus Found. Check your network settings.";
		if (scannedRokus.length<1)dbg("No Rokus Found. Check your network settings.");
	}else {
		//dbg(URLS[ipPos]);
		if(scanning)images[ipPos].src=URLS[ipPos];
		if(scanning)timeouts = setTimeout('cancelImage('+ ipPos +');', 500);
	}
}	
	
	
function findRokus() {
	scannedRokus = new Array;
	setConfig('scannedRokus',scannedRokus.join(","));
	setRokuCount();
	updateSelect();
	if(!scanning){
		this.innerHTML="Stop";
		scanResults.setAttribute("class", "visible");
		scanResults.innerHTML = "Scanning " + (254-ipCount) +  " addresses. " + scannedRokus.length + " Rokus found.";
		scanning = true;
		for (i = 1; i < 255; i++) {
			images[i-1] = new Image();
			URLS[i-1] = "http://" + myNetwork + "." + i + ":8060/query/icon/11";
			images[i-1].id = "ip-" + i;
			images[i-1].onload = loadedImage;
			images[i-1].onerror = imageError;
			
		}
		ipPos = 0;
		images[ipPos].src = URLS[ipPos];
		timeouts = setTimeout('cancelImage('+ ipPos +');', 500);
	}
	else{
		scanning = false;
		this.innerHTML="Scan";
		scanResults.setAttribute("class", "hidden");
		ipPos = 255;
		ipCount = 0;
		stopFindRokus();
	}
}

function setMyNetwork() {
	myNetwork = [octet1.value,octet2.value,octet3.value].join(".");
	setConfig('myNetwork', myNetwork);
}

function setRokuCount() {
	rokuCount = numField.value;
	setConfig('rokuCount', rokuCount);
}

function setRokuAddress(){
	this.options[this.selectedIndex].setAttribute("class","selected");
	rokuAddress = this.options[this.selectedIndex].value;
	try{
		var apps = JSON.parse(localStorage.getItem(rokuAddress + '-apps'))
	}catch(err){
		apps = [];	
	}
	if(apps)_rmAppsCB(apps);
	setConfig('rokuAddress', rokuAddress);
	}

function firstSetup(){
	for(i=0;i<screenArray.length;i++){
		screenArray[i].setAttribute("class", "hidden");
		}
	firstSetupScreen.setAttribute("class", "visible");
	//var setup = confirm("It looks like you haven't used Remoku before. Would you like to begin by scanning for Rokus?");
	//if(setup){
	//	rokuCount = prompt ("Ok, how many Rokus do you own?", "1");
	//	myAddress = prompt ("Thanks, last question. What is the network base address. If you're not sure, try the suggested network", "192.168.1");
	//	alert  ("Great, now press ok and your network will be scanned for Rokus.");
	//	numField.value = rokuCount;
	//	findRokus();
 	//}
}

//END DISCOVERY FUNCTIONS
/////////////////////////

////////////////////
//BEGIN ROKU SPECIFIC CODE


/* function name: rokupost
*  purpose: send a post request to a roku via a hidden form
*  input: String, String
*  output: none
*/
function rokupost(action, param){
	var rokupost = document.getElementById('rokupost');
	rokupost.setAttribute("action", "http://" + rokuAddress + ":8060/" + action + "/" + param);
	rokupost.submit();
	return false;
}

//macros
// Rev Play Fwd InstantReplay Info Down Left Select Right Up Back Home

// Bit rate override screen: Home 5x, Rewind 3x, FastForward 2x
// Home,Home,Home,Home,Home,Rev,Rev,Rev,Fwd,Fwd

// Dump Core: Home 5x, Up, Rewind 2x
// Home,Home,Home,Home,Home,Up,Rev,Rev

// Channel Version Info: Home 3x, Up 2x, Left, Right, Left, Right, Left
// Home,Home,Home,Up,Up,Left,Right,Left,Right,Left

// Developer Settings Page: Home 3x, Up 2x, Right, Left, Right, Left, Right
// Home,Home,Home,Up,Up,Right,Left,Right,Left,Right

function sendSequence(cmds){
	if (cmds.length>0){
		rokupost("keypress", cmds.shift() );
		setTimeout(function(){sendSequence(cmds);}, 750);
	}
}

function macroDevScreen(){
	var cmds = "Home,Home,Home,Up,Up,Right,Left,Right,Left,Right".split(",");
	sendSequence(cmds);
	}

function macroDumpCore(){
	var cmds = "Home,Home,Home,Home,Home,Up,Rev,Rev,Fwd,Fwd".split(",");
	sendSequence(cmds);
	}

function macroBRO(){
	var cmds = "Home,Home,Home,Home,Home,Rev,Rev,Rev,Fwd,Fwd".split(",");
	sendSequence(cmds);
	}

function macroChannelVersions(){
	var cmds = "Home,Home,Home,Up,Up,Left,Right,Left,Right,Left".split(",");
	sendSequence(cmds);
	}


//ECP APPS
function launchShoutCast(){
	var rokupost = document.getElementById('rokupost');
	//params = launchKey.value + "=" + encodeURIComponent(launchValue.value);
	params = "name=" + escape(shoutCastNameInput.value) + "&url=" + escape(shoutCastUrlInput.value).split("/").join("%2F");
	rokupost.setAttribute("action", "http://" + rokuAddress + ":8060/launch/2115?" + params );
	rokupost.submit();
	return false;
	}


function launchRemokuWithParams(){
	var rokupost = document.getElementById('rokupost');
	params = launchKey.value + "=" + encodeURIComponent(launchValue.value);
	rokupost.setAttribute("action", "http://" + rokuAddress + ":8060/launch/dev?" + params );
	rokupost.submit();
	return false;
	}

function rokulaunch(id){
	rokupost("launch",id);
	}


function rokuDeleteOrBlur(evt){
	if (!evt)evt = window.event;//IE doesn't pass events as parameters like other browsers
	if (evt.keyCode == 8){
		rokupost("keypress","Backspace");
	}
	else if (evt.keyCode == 27){
		this.blur();
	}
	else if(evt.keyCode==13){
		if (document.getElementById("textentry").value==""){
			rokutext.setAttribute("action", "http://" + rokuAddress + ":8060/" + "keypress" + "/" + "Enter");
			rokutext.submit();
			this.blur();
		}
	}
}	

// function rokuDeleteorBlur(evt){
// 	if (!evt)evt = window.event;//IE doesn't pass events as parameters like other browsers
// 	if (evt.keyCode == 8){
// 		rokupost("keypress","Backspace");
// 	}
// 	else if (evt.keyCode == 27){
// 		this.blur();
// 	}
// 	else {
// 		rokuText();
// 	}
// }	


function delayNextQuery(){
	setTimeout('rokuText()',200);
	}
	
function rokuText(){
	var rokutext =  document.getElementById('rokutext');
	var text = document.getElementById("textentry").value;
//	dbg(text);
	if(text){
		var letter = text.slice(0,1);
		text = text.slice(1);
		//Handle the few characters Roku needs encoded beyond escape();
		if(letter=="/"){ 
//			dbg(letter);
			letter = "%2f";
//			dbg("  " + letter);
			rokutext.setAttribute("action", "http://" + rokuAddress + ":8060/" + "keypress" + "/" + "LIT_" + letter);
		} else if(letter=="@"){ 
//			dbg(letter);
			letter = "%40";
//			dbg("  " + letter);
			rokutext.setAttribute("action", "http://" + rokuAddress + ":8060/" + "keypress" + "/" + "LIT_" + letter);
		} else if(letter=="+"){ 
//			dbg(letter);
			letter = "%2b";
//			dbg("  " + letter);
			rokutext.setAttribute("action", "http://" + rokuAddress + ":8060/" + "keypress" + "/" + "LIT_" + letter);
		} else {
//			dbg(letter);
//			dbg("  " + escape(letter));
			rokutext.setAttribute("action", "http://" + rokuAddress + ":8060/" + "keypress" + "/" + "LIT_" + encodeURIComponent(letter));
		}
		rokutext.submit();
		document.getElementById("textentry").value = text
		}
	}	
	
function delayLoadIcons(){
	if(appidarray.length>0) var appid = appidarray.shift();
	if(appid)document.getElementById("app"+appid).src = 'http://' + rokuAddress +':8060/query/icon/' + appid;	
	}


function loadRokuImages(){
	if (appidarray.length>0) setTimeout('delayLoadIcons()',50);
	}

		
function _rmAppsCB(apps){
	if(localStorage.setItem){
		localStorage.setItem(rokuAddress + '-apps', JSON.stringify(apps));
	}
	var list = "";
	var applist = document.getElementById("applist");
    appidarray = new Array();
    for (i=0;i<apps.length;i++){
	    var li = document.createElement("li");
	    
	    var link = document.createElement("a");
	    link.setAttribute('href','#'+apps[i].id);
	    link.setAttribute('onclick','rokulaunch("' + apps[i].id + '")');
	    link.innerHTML = apps[i].name;
	    
	    var img = document.createElement("img");
	    img.setAttribute('onload','loadRokuImages()');
		img.setAttribute('class','icons');
		img.setAttribute('Id','app' + apps[i].id);
		
		appidarray.push( apps[i].id);
		
		link.appendChild(img);
		li.appendChild(link);
		applist.appendChild(li);
		//dbg (apps[i].name);
	}

// 	for (app in apps){
// 		var htmlitem = "<li><a href='#" + apps[app].id + "' onclick='rokulaunch(" + apps[app].id + ");'>" +
// 		"<img class='icons' id='app" + apps[app].id + "' onload='loadRokuImages()' > " + 
// 		apps[app].name + "</a></li>"; 
// 		list += htmlitem;
// 		appidarray.push( apps[app].id);
// 	}
	//applist.innerHTML = list;
	appid = appidarray.shift();
	if(appid!=null)document.getElementById("app"+appid).src = 'http://' + rokuAddress +':8060/query/icon/' + appid;
		
}
	
function rokuApps(){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://"+ rokuAddress +":88/apps.js";
	document.body.appendChild(script);
}

function launchRemoku(){
	rokulaunch("dev");
	}

	
	
function getBuild(){
	if (window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				var response = xmlhttp.responseText;
				response = response.split("\n");
				var channel = response[2].substr(1);
				var build = "Build date: " + response[3].substr(1);
				ver("Remoku<br>" + channel + "<br>" + build);
				}
			}
		xmlhttp.open("GET","cache.manifest",true);
		xmlhttp.send();
	}
}	
	
//END ROKU SPECIFIC CODE
////////////////////////

function wipeSettings(){
	setConfig("rokuAddress","");
	setConfig("scannedRokus", "");
	setConfig("manualRokus", "");
	setConfig("rokuCount", "");
	//setConfig("apps", "");
	if (localStorage.clear) localStorage.clear();
}
//////////////
//GUI BINDINGS
function btnDown(){
	//dbg("mousedown");
	lastBtn = this.id;
	//add graphical feed back here
	rokupost("keydown",this.id);
}
function btnUp(){
	//dbg("mouseup");
	rokupost("keyup",lastBtn);
}
function btnTouchDown(){
	//dbg("touchstart");
	lastBtn = this.id;
	//add graphical feed back here
	rokupost("keydown",this.id);
}
function btnTouchUp(){
	//dbg("touchend");
	rokupost("keyup",lastBtn);
}
function rmousedownRemoteBtn(e){
	var activeBtn = this.id;
	if (activeBtn=="navremote"){
		var rightclick;
		if (!e) var e = window.event;
		if (e.which) rightclick = (e.which == 3);
		else if (e.button) rightclick = (e.button == 2);
		if(rightclick)showRemotes();
		//dbg('Rightclick: ' + rightclick); // true or false
		//return false;
	}
}

function activateButton(e){
	var activeBtn = this.id;
	firstSetupScreen.setAttribute("class", "hidden");
		for(i=0;i<navArray.length;i++){
			if (activeBtn == navArray[i].id){
				navArray[i].setAttribute("class", "active nav");
				screenArray[i].setAttribute("class", "visible");
			} else {
				screenArray[i].setAttribute("class", "hidden");
				navArray[i].setAttribute("class", "nav");
			}
		}
	setTimeout(hideURLbar, 100);
	//dbg("activatedButton");
	//return false;
}

function textModeOff(){keyboardMode=false;}
function textModeOn() {keyboardMode=true; }

function handleArrowKeyDown(evt) {
    evt = (evt) ? evt : ((window.event) ? event : null);
    if (evt && keyboardMode &&  firstDown) {
	    firstDown = false;
        switch (evt.keyCode) {
            case 37:
                //dbg("left");
                rokupost("keydown","Left");
                break;    
            case 38:
                //dbg("up");
                rokupost("keydown","Up");
                break;    
            case 39:
                //dbg("right");
                rokupost("keydown","Right");
                break;    
            case 40:
                //dbg("down");
                rokupost("keydown","Down");
                break;    
            case 13:
                //dbg("Enter");
                rokupost("keydown","Select");
                break;    
            case 36:
                //dbg("Home");
                rokupost("keydown","Home");
                break;    
            case 72:
                //dbg("Home");
                rokupost("keydown","Home");
                break;    
            case 82:
                //dbg("Return");
                rokupost("keydown","Back");
                break;    
            case 27:
                //dbg("Return");
                rokupost("keydown","Back");
                break;    
            case 90:
                //dbg("Replay");
                rokupost("keydown","InstantReplay");
                break;    
            case 73:
                //dbg("Info");
                rokupost("keydown","Info");
                break;    
            case 32:
                //dbg("Play");
                rokupost("keydown","Play");
                break;    
            case 188:
                //dbg("Rev");
                rokupost("keydown","Rev");
                break;    
            case 190:
                //dbg("Fwd");
                rokupost("keydown","Fwd");
                break;    
         }
    }
}

function handleArrowKeyUp(evt) {
	firstDown = true;
    evt = (evt) ? evt : ((window.event) ? event : null);
    if (evt && keyboardMode) {
        switch (evt.keyCode) {
            case 37:
                //dbg("left");
                rokupost("keyup","Left");
                break;    
            case 38:
                //dbg("up");
                rokupost("keyup","Up");
                break;    
            case 39:
                //dbg("right");
                rokupost("keyup","Right");
                break;    
            case 40:
                //dbg("down");
                rokupost("keyup","Down");
                break;    
            case 13:
                //dbg("Enter");
                rokupost("keyup","Select");
                break;    
            case 36:
                //dbg("Home");
                rokupost("keyup","Home");
                break;    
            case 72:
                //dbg("Home");
                rokupost("keyup","Home");
                break;    
            case 82:
                //dbg("Return");
                rokupost("keyup","Back");
                break;    
            case 27:
                //dbg("Return");
                rokupost("keyup","Back");
                break;    
            case 90:
                //dbg("Replay");
                rokupost("keyup","InstantReplay");
                break;    
            case 32:
                //dbg("Play");
                rokupost("keyup","Play");
                break;    
            case 188:
                //dbg("Rev");
                rokupost("keyup","Rev");
                break;    
            case 190:
                //dbg("Fwd");
                rokupost("keyup","Fwd");
                break;    
         }
    }
}

function touchshowRemotes(){
	remotesPopupTimer = setTimeout("showRemotes()",500);
	//dbg("touch timer started");
	//return false;
}

function showRemotesAfterDelay(){
	remotesPopupTimer = setTimeout("showRemotes()",500);
	//return false;
	}
	
function showRemotes(){
	remotesPopup.setAttribute("class", "visible");
	remotesPopupTimer = null;
}

		
function canceltouchshowRemotes(){
	if (remotesPopupTimer){
		clearTimeout(remotesPopupTimer);
		activeBtn = "navremote";
		for(i=0;i<navArray.length;i++){
			if (activeBtn == navArray[i].id){
				navArray[i].setAttribute("class", "active nav");
				screenArray[i].setAttribute("class", "visible");
			} else {
				screenArray[i].setAttribute("class", "hidden");
				navArray[i].setAttribute("class", "nav");
			}
		}
	setTimeout(hideURLbar, 100);
	//dbg("touchtimer canceled");
	} 
}
//END GUI BINDINGS
//////////////////

//////////////////////
//BEGIN INITIALIZATION

var rokuSelect;
var myNetwork;
var octet1;
var octet2;
var octet3;
var scanButton;
var removeButton;
var addButton;
var scanning = false;
var foundRokus = 0;
var rokuAddress;
var rokus = [];
var rokuCount;
var ipCount = 0;
var numField;
var manualInput;
var manualSelect;

var scannedRokus = [];
var manualRokus = [];
var images = [];
var timeouts;
var URLS = [];
var ipPos;
var dbgOut;

var remoteButtons;
var rokupostframe = document.createElement("iframe");
var rokutextframe = document.createElement("iframe");
var rokuscanframe = document.createElement("iframe");
var rokupostform = document.createElement("form");
var rokutextform = document.createElement("form");

var trasmitText = "";

var appidarray = [];

var loadAppsButton;
var startAppsButton;
var scanForRokuButton;
var addRokuButton;
var scanResults;

var launchButton;
var launchValue;
var launchKey;

var shoutCastNameInput;
var shoutCastUrlInput;
var shoutCastLaunchButton;

var navRemote;
var navGoodies
var navApps;
var navConfig;
var navAbout;
var navArray = new Array();

var remoteScreen;
var configScreen;
var goodiesScreen;
var appsScreen;
var aboutScreen;
var firstSetupScreen;
var screenArray = new Array(); 

var useCookies = false;
var keyboardMode;
var firstDown = true;

var remotesPopupTimer;
var remotesPopup;
var clearTimer;
var longtouch;

var remote0;

// Check if a new cache is available on page load.
if(window.addEventListener){
window.addEventListener('load', function(e) {

  if(window.applicationCache){ 
	window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of Remoku is available. Load it now?')) {
        window.location.reload();
      }
    } else {
      // Manifest hasn't changed. Nothing new to serve.
    }
  }, false);
 }
}, false);
}


window.onload = function(){
	window.scrollTo(0, 1);
	dbgOut = document.getElementById("dbgOut");
	getBuild();
	dbg(navigator.userAgent);
	if(isBadBrowser()){
		useCookies = true;
		dbg("Browser lacks localStorage support, falling back to cookies. Channel lists cannot be saved.");
	} else {
		dbg("Browser has localStorage support. Channel lists will be saved.");
	}

	wipeSettingsButton = document.getElementById("wipesettings");
	wipeSettingsButton.onclick = wipeSettings;
	
	rokuSelect = document.getElementById("rokus");
	rokuSelect.onchange = setRokuAddress;
	
	scannedRokus = getConfig('scannedRokus') ? getConfig('scannedRokus').split(",") : [];
	keyboardMode = getConfig('keyboardMode') ? getConfig('keyboardMode') : true;
	octet1 = document.getElementById('octet1');
	octet2 = document.getElementById('octet2');
	octet3 = document.getElementById('octet3');
	octet1.onchange = setMyNetwork;
	octet2.onchange = setMyNetwork;
	octet3.onchange = setMyNetwork;
	
	myNetwork = getConfig('myNetwork') ? getConfig('myNetwork') : "192.168.1";
	var octets = myNetwork.split(".");
	octet1.value=octets[0];
	octet2.value=octets[1];
	octet3.value=octets[2];

	rokuCount = getConfig('rokuCount') ? getConfig('rokuCount') : "1";
	numField = document.getElementById('num');
	numField.value = rokuCount;
	numField.onchange = setRokuCount;
	
	scanButton = document.getElementById('scanforroku');
	scanButton.onclick = findRokus;
	
	scanResults = document.getElementById('scanresults');
	
	rokuAddress = getConfig('rokuAddress');
	manualInput = document.getElementById('maddress');
	manualSelect = document.getElementById('manualrokus');
	manualRokus = getConfig('manualRokus') ? getConfig('manualRokus').split(",") : [];
	removeButton = document.getElementById('removeroku');
	removeButton.onclick = removeRoku;
	addButton = document.getElementById('addroku');
	addButton.onclick = addRoku;
	remotesPopup = document.getElementById("remotespopup");

	if(manualRokus.length>0) buildManualRokusMenu();
	updateSelect();
	try{
		var apps = JSON.parse(localStorage.getItem(rokuAddress + '-apps'))
	}catch(err){
		apps = [];	
	}
	
	rokupostframe.name="rokuresponse"
	rokupostframe.id="rokuresponse";
	rokupostframe.style.visibility="hidden";
	rokupostframe.style.display="none";
	rokupostframe = document.body.appendChild(rokupostframe);

	rokutextframe.name="rokutextresponse"
	rokutextframe.id="rokutextresponse";
	rokutextframe.style.visibility="hidden";
	rokutextframe.style.display="none";
	rokutextframe.onload = delayNextQuery;
	rokutextframe = document.body.appendChild(rokutextframe);
	
	rokupostform.style.visibility="hidden";
	rokupostform.style.display="none";
	rokupostform.id="rokupost";
	rokupostform.method="post";
	rokupostform.target="rokuresponse";
	rokupostform = document.body.appendChild(rokupostform);
	
	rokutextform.style.visibility="hidden";
	rokutextform.style.display="none";
	rokutextform.id="rokutext";
	rokutextform.method="post";
	rokutextform.target="rokutextresponse";
	rokutextform = document.body.appendChild(rokutextform);
	
	
	remoteButtons = getElementsByClass("link");
	for(var i=0; i<remoteButtons.length; i++){
		if (is_touch_device()){
			remoteButtons[i].ontouchstart = btnTouchDown;
			remoteButtons[i].ontouchend = btnTouchUp;
		} else {
			remoteButtons[i].onmousedown = btnDown;
			remoteButtons[i].onmouseup = btnUp;
		}
	}
	
	var intViewportHeight = window.innerHeight;
	//dbg(intViewportHeight);
	screens = document.getElementById("remote");
	if(intViewportHeight<419){
		intViewportHeight+=40
		screens.style.height = intViewportHeight+"px";
		remoteTable = document.getElementById("remotetable");
		remoteTable.style.marginBottom = 40+"px";
	}
	remoteScreen = document.getElementById("remote");
	goodiesScreen = document.getElementById("goodies");
	appsScreen = document.getElementById("apps");
	configScreen = document.getElementById("config");
	aboutScreen =  document.getElementById("about");
	firstSetupScreen = document.getElementById("firstsetup");
	screenArray = [remoteScreen,goodiesScreen,appsScreen,configScreen,aboutScreen];
	
	navRemote = document.getElementById("navremote");
	navRemoteImg = document.getElementById("navremoteimg");
	navGoodies = document.getElementById("navgoodies");
	navApps   = document.getElementById("navapps");
	navConfig = document.getElementById("navconfig");
	navAbout = document.getElementById("navabout");
    navArray = [navRemote,navGoodies,navApps,navConfig,navAbout];
    
	if(is_touch_device()){
		dbg("Touch Device Detected");
		navRemoteImg.ontouchstart = touchshowRemotes; //function(e){dbg("navremoteimgtouchstart");};
		//navRemote.ontouchstart = function(e){dbg("remotetouchstart");e.preventDefault();};
		//navRemote.addEventListener("touchstart",touchshowRemotes,false);
		//navRemote.ontouchmove = touchshowRemotes;
		navRemoteImg.ontouchend = canceltouchshowRemotes; //function(e){dbg("remotetouchend");};
	} else {
		navRemote.onclick = activateButton;
		navRemote.onmousedown = rmousedownRemoteBtn;
		navRemote.onmouseup = function(){return false;};
		navRemote.oncontextmenu = function(){return false;};
	}
	//navRemote.ontouchend = canceltouchshowRemotes;
	
	navApps.onclick = activateButton;
	navConfig.onclick = activateButton;
	navGoodies.onclick = activateButton;
	navAbout.onclick = activateButton;
	
	sendTextBtn = document.getElementById("sendtext");
	sendTextBtn.onclick = rokuText;
	
	loadAppsButton = document.getElementById("loadapps");
	loadAppsButton.onclick = rokuApps;

	startAppsButton = document.getElementById("startremoku");
	startAppsButton .onclick = launchRemoku;
	if(!rokuAddress) {
		 firstSetup();
	 }
	 
	launchButton = document.getElementById("lparamdo");
	launchValue = document.getElementById("lvalue");
	launchKey = document.getElementById("lkey");
	launchButton.onclick = launchRemokuWithParams;
	
	shoutCastNameInput = document.getElementById("sc_name");
	shoutCastUrlInput = document.getElementById("sc_url");
	shoutCastLaunchButton = document.getElementById("sc_launch");
	shoutCastLaunchButton.onclick = launchShoutCast;
	
	MacroDevButton = document.getElementById("dev_macro");
	MacroDevButton.onclick = macroDevScreen;
	
	MacroCoreButton = document.getElementById("cor_macro");
	MacroCoreButton.onclick = macroDumpCore;
	
	MacroBroButton = document.getElementById("bro_macro");
	MacroBroButton.onclick = macroBRO;
	
	MacroVerButton = document.getElementById("ver_macro");
	MacroVerButton.onclick = macroChannelVersions;

	
	
	
	
	
	textEntryInput = document.getElementById("textentry");
	textEntryInput.onkeyup = rokuDeleteOrBlur;
	textEntryInput.onkeypress = rokuText;
	
	textEntryInput.onfocus = textModeOff;
	textEntryInput.onblur = textModeOn;
	textEntryInput.enter = rokuText;
	
	document.onkeyup = handleArrowKeyUp;
	document.onkeydown = handleArrowKeyDown;
	if(apps)_rmAppsCB(apps);

}

//Hide iPhone URL bar
if(window.addEventListener) window.addEventListener("load", function(){setTimeout(hideURLbar, 100);}, false);
function hideURLbar(){
    window.scrollTo(0, 1);
	}

//END INITIALIZATION
////////////////////
