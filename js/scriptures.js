/* global window */
/* jslint browser: true */
const Scriptures = (function (){
<<<<<<< HEAD
    "use strict";
    //constants
    const SCRIPTURE_URL = "http://scriptures.byu.edu/mapscrip/mapgetscrip.php";
    const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*)\)/;
    const MAX_RETRY_DELAY = 5000;
    // private variables
    let books = {};
    let volumes = [];

    let labels = [];
    let retryDelay = 500;
    let markerLocations = [];
    // AIzaSyBVrFz6pyVtooI7emyrRWUDVi3tcCJMysY
    // private method declarations
    let addMarker;
    let breadcrumbs;
    let clearMarkers;
    let ajax;
    let bookChapterValid;
    let cacheBooks;
    let init;
    let iflocationfree;
    let navigateBook;
    let navigateChapter;
    let navigateHome;
    let onHashChanged;
    let encodedScriptureUrlParameters;
    let getScriptureCallback;
    let getScriptureFailed;
    let hash;
    let previousChapter;
    let nextChapter;
    let previousNextChapterBtn;
    let titleForBookChapter;
    let showLocation;
    let zoomOneLocation;
    let showAllMarkers;
    let setupMarkers;
    let decodeScriptureUrlParameters;
=======
 "use strict";
//constants
const SCRIPTURE_URL = "http://scriptures.byu.edu/mapscrip/mapgetscrip.php";
const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*)\)/;
const MAX_RETRY_DELAY = 5000;
// private variables
let books = {};
let volumes = [];

let labels = [];
let retryDelay = 500;
let markerLocations = [];
// AIzaSyBVrFz6pyVtooI7emyrRWUDVi3tcCJMysY
// private method declarations
let addMarker;
let breadcrumbs;
let clearMarkers;
let ajax;
let bookChapterValid;
let cacheBooks;
let init;
let iflocationfree;
let navigateBook;
let navigateChapter;
let navigateHome;
let onHashChanged;
let encodedScriptureUrlParameters;
let getScriptureCallback;
let getScriptureFailed;
let hash;
let previousChapter;
let nextChapter;
let previousNextChapterBtn;
let titleForBookChapter;
let showLocation;
let zoomOneLocation;
let showAllMarkers;
let setupMarkers;
let decodeScriptureUrlParameters;

>>>>>>> b77e073c73de3268c40647363291bbcb2dd49170
// private methods
	addMarker = function (placename, latitude, longitude, altitude){
		//TODO: check if already a marker exists here
		// if so merge the placename
        console.log("addMarker")
		if (window.google === undefined){
    		let retryId = window.setTimeout(addMarker, retryDelay);
    		retryDelay += retryDelay;

    		if (retryDelay > MAX_RETRY_DELAY){
    			window.clearTimeout(retryId);
    		}
    		return;
    	}
        let uniqueMarkerLocation = iflocationfree(latitude, longitude);

        if (uniqueMarkerLocation === true){
            let marker = new google.maps.Marker({
                position: {lat: latitude, lng: longitude},
                map: map,
                label: placename,
                zoom: 0,
                animation: google.maps.Animation.DROP
            });
            gmMarkers.push(marker);
            // console.log(gmMarkers);
        }
	};

	clearMarkers = function(){
        markerLocations = [];
		gmMarkers.forEach(function (marker){
			marker.setMap(null);
		});
		gmMarkers = [];
	};


    ajax = function (url, successCallback, failureCallback, skipParse){
        let request = new XMLHttpRequest();
        request.open("GET", url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
            // Success!
            let data;
            if (skipParse){
            	data = request.responseText;
            } else {
            	data= JSON.parse(request.responseText);
            }
            
            if (typeof successCallback === "function"){
                successCallback(data);
            }else{
                if (typeof failureCallback === "function"){
                    failureCallback(data);
                }
            }
            } else {
                failureCallback(request);
                // We reached our target server, but it returned an error
            }
        };
        request.onerror = failureCallback;
        request.send();
    };

    bookChapterValid = function(bookId, chapter){
    	let book = books[bookId];
    	if (book === undefined || chapter < 0 || chapter > book.numChapters){
    		return false;
    	}
    	if (chapter === 0 && book.numChapters>0){
    		return false;
    	}
    	return true;
    };

    cacheBooks = function (callback){
        volumes.forEach( volume => {
            let volumeBooks = [];
            let bookId = volume.minBookId;
            while (bookId <= volume.maxBookId){
                volumeBooks.push(books[bookId]); //javascript is ok taking integers when expecting string
                bookId += 1;
            }
            volume.books = volumeBooks; //didn't exist, initializing it here
        });
        // volumes = volumes.forEach( volume => volume.books = books.filter( book => book.bookId <= volume.maxBookId && book.bookId >= volume.minBookId) );
        if (typeof callback === "function"){
            callback();
        }
    };

    encodedScriptureUrlParameters = function(bookId, chapter, verses, isJst){
    	let options = "";
    	if (bookId != undefined && chapter != undefined){
    		if (verses != undefined){
    			optiopns += verses;
    		}
    		if (isJst != undefined && isJst){
    			optiopns += "&jst=JST";
    		}
    		return SCRIPTURE_URL + "?book=" + bookId + "&chap=" + chapter + "&verses" + options;
    	}
    };

    breadcrumbs = function(volume, book, chapter){
        let crumbs;
        if (volume === undefined){
            crumbs = "<ul><li>The Scriptures</li>";
        } else {
            crumbs = "<ul><li><a href=\"javascript:void(0);\" " +
                    "onclick=\"Scriptures.hash()\">The Scriptures</a></li>";
            if (book === undefined){
                crumbs += "<li>" + volumes[volume].fullName + "</li>";
            }  else {
                console.log("ffffffff")
                console.log(volumes)
                crumbs += "<li><a href=\"javascript:void(0);\" " +
                        "onclick=\"Scriptures.hash(" + volume + ")\">" +
                        volumes[volume].fullName + "</a></li>";

                // crumbs += "<li><a href=\"javascript:void(0);\" " +
                //         "onclick=\"Scriptures.hash(" + volume + ")\"> 444444 </a></li>";

                if (chapter === undefined || chapter <= 0) {
                    crumbs += "<li>" +books[book].tocName + "</li>";
                } else {
                    crumbs += "<li><a href=\"javascript:void(0);\" " +
                            "onclick=\"Scriptures.hash(0," + book + ")\">" +
                            books[book].tocName + "</a></li>";
                    crumbs += "<li>" + chapter + "</li>";
                }
            }
        }
        return crumbs + "</ul>";
    };

    hash = function(volumeId, bookId, chapter){
        let newHash = "";
        if (volumeId !== undefined){
            newHash += volumeId;
            if (bookId !==undefined){
                newHash += ":" +bookId;
                if (chapter !== undefined){
                    newHash += ":" +chapter;
                }
            }
        }
        location.hash = newHash;
    };

    previousNextChapterBtn = function() {
        let ids = location.hash.substring(1).split(":");
        let bookId = Number(ids[1]);
        let chapter = Number(ids[2]);
        let volumeId = ids[0];
        let preNavHtml = "<div id=\"navbtnblock\">";
        let previousChapterInfo = previousChapter(bookId,chapter);
        if (previousChapterInfo !== undefined){
            let previousBookId = previousChapterInfo[0];
            let previousChapterId = previousChapterInfo[1];
            let previousChapterName = previousChapterInfo[2];
            let prevousChapterHash = "#" + volumeId + ":" + previousBookId + ":" + previousChapterId;
<<<<<<< HEAD
            let prevousBtnHtml = "<a class=\"btn\" id=\"previousChapterBtn\" onclick=\"javascript:slideChapters()\" href=" + prevousChapterHash + ">" + previousChapterName +"</a>";
=======
            let prevousBtnHtml = "<a class=\"btn\" id=\"previousChapterBtn\" href=" + prevousChapterHash + ">" + previousChapterName +"</a>";
>>>>>>> b77e073c73de3268c40647363291bbcb2dd49170
            preNavHtml += prevousBtnHtml;
            
        } 

        let nextChapterInfo = nextChapter(bookId, chapter);
        if (nextChapterInfo !== undefined){
            let nextBookId = nextChapterInfo[0];
            let nextChapterId = nextChapterInfo[1];
            let nextChapterName = nextChapterInfo[2];
            let nextChapterHash = "#" + volumeId + ":" + nextBookId + ":" + nextChapterId;
<<<<<<< HEAD
            let nextBtnHtml = "<a class=\"btn\" id=\"nextChapterBtn\" onclick=\"javascript:slideChapters()\" href=" + nextChapterHash + ">" + nextChapterName + "</a>";
=======
            let nextBtnHtml = "<a class=\"btn\" id=\"nextChapterBtn\" href=" + nextChapterHash + ">" + nextChapterName + "</a>";
>>>>>>> b77e073c73de3268c40647363291bbcb2dd49170
            preNavHtml += nextBtnHtml;
            
        }
        preNavHtml += "</div>";
        document.getElementById("scriptures").innerHTML = preNavHtml;

        if (previousChapterInfo !== undefined) {
            document.getElementById("previousChapterBtn").addEventListener("click", function(){
                navigateChapter(previousChapterInfo[0],previousChapterInfo[1]);
            });
        }
        if (nextChapterInfo !== undefined){
            document.getElementById("nextChapterBtn").addEventListener("click", function(){
                navigateChapter(nextChapterInfo[0],nextChapterInfo[1]);
            });
        }
<<<<<<< HEAD
    };

    
    
=======
        
    };

>>>>>>> b77e073c73de3268c40647363291bbcb2dd49170
    getScriptureCallback = function(chapterHtml){  
        previousNextChapterBtn();
        document.getElementById("scriptures").innerHTML += chapterHtml;
    	setupMarkers();
    };

    getScriptureFailed = function(){
    	console.log("warning: scripture request from server failed");
    };

    iflocationfree = function(latitude, longitude){
        for (let i = 0, l = markerLocations.length; i < l; i++) {
            if (markerLocations[i][0] === latitude && markerLocations[i][1] === longitude) {
                return false;
            }
        }
        markerLocations.push([latitude, longitude]);   
        return true;
    }

	init = function (callback){
    	let booksLoaded = false;
        let volumesLoaded = false;
        ajax("http://scriptures.byu.edu/mapscrip/model/books.php",
            function (data) {
                books = data;
                booksLoaded = true;
                if (booksLoaded){
                    cacheBooks(callback);
                }
            });

        ajax("http://scriptures.byu.edu/mapscrip/model/volumes.php",
            function (data) {
                volumes = data;
                volumesLoaded = true;
                if (volumesLoaded){
                    cacheBooks(callback);
                }
            }
        );
    };

    navigateBook = function(bookId){
        let ids = location.hash.substring(1).split(":");
        let volumeId = ids[0];
        let allChapters = "<div id=\"scripnav\">";
        let chapterQuantity = books[bookId].numChapters;
        if (! chapterQuantity) {
            navigateChapter(bookId, 0);
        } else if (chapterQuantity === 1){
            navigateChapter(bookId, 1);
        } else{
            allChapters += "<div class = \"volume\"><h5>" + 
                books[bookId].fullName + "</h5></div><div id=\"chpbx\">";
            for (let i=1; i<chapterQuantity+1; i++){
                allChapters += "<a class=\"btn chapter\" id=" + i + " href=\"#" + 
                volumeId + ":" + bookId + ":" + i + "\"" + ">" + i + "</a>";
            }
        }
        allChapters += "</div></div>";
        document.getElementById("scriptures").innerHTML = allChapters;
        document.getElementById("crumb").innerHTML = breadcrumbs(volumeId, bookId);
    };

    navigateChapter = function(bookId, chapter){
        let ids = location.hash.substring(1).split(":");
        let volumeId = ids[0];
    	if (bookId != undefined){

    		ajax(encodedScriptureUrlParameters(bookId, chapter),
    			getScriptureCallback,
    			getScriptureFailed,
    			true);
    	}
        document.getElementById("crumb").innerHTML = breadcrumbs(volumeId, bookId, chapter);
    };

    navigateHome = function(volumeId){
        let displayedVolume;
    	let navContents = "<div id=\"scripnav\">";
    	volumes.forEach(function (volume){

    		if (volumeId === undefined || volume.id === volumeId){
    			navContents += "<div class=\"volume\"><a name=\"v\" + volume.id + /><h5>" + 
    			volume.fullName + "</h5></div><div class = \"books\">";

    			volume.books.forEach(function (book){
    				navContents += "<a class=\"btn\" id=\"" + book.id + "\" href=\"#" + 
    				volume.id + ":" + book.id + "\">" + book.gridName + "</a>";
    			});

    			navContents += "</div>";

                if (volume.id ===volumeId){
                    displayedVolume = volumeId;
                }
    		}
    	})
    	navContents += "<br /><br /></div>";
<<<<<<< HEAD

=======
>>>>>>> b77e073c73de3268c40647363291bbcb2dd49170
    	document.getElementById("scriptures").innerHTML = navContents;
        document.getElementById("crumb").innerHTML = breadcrumbs(displayedVolume);
    };

    nextChapter = function(bookId, chapter){
    	let book = books[bookId];
    	if (book !== undefined){
    		if (chapter < book.numChapters){
    			return [bookId, chapter + 1, titleForBookChapter(book, chapter + 1)];
    		}
    		let nextBook = books[bookId+1];
    		if (nextBook !== undefined){
    			let nextChapterValue = 0;
    			if (nextBook.numChapters>0){
    				nextChapterValue = 1;
    			}
    			return [nextBook.id, nextChapterValue, titleForBookChapter(nextBook, nextChapterValue)];
    		}
    	}
    };

    previousChapter = function(bookId, chapter){
    	let book = books[bookId];
    	if (book !== undefined){
    		if (chapter > 1) {
    			return [bookId, chapter-1, titleForBookChapter(book, chapter-1)];
    		}
    		let previousBook = books[bookId-1];
    		if (previousBook !== undefined){
    			let preivousChapterValue = previousBook.numChapters;
    			return [previousBook.id, preivousChapterValue, titleForBookChapter(previousBook, preivousChapterValue)];
    		}
    	}
    };

    setupMarkers = function(){
        if (window.google === undefined){
            let retryId = window.setTimeout(setupMarkers, retryDelay);
            retryDelay += retryDelay;

            if (retryDelay > MAX_RETRY_DELAY){
                window.clearTimeout(retryId);
            }
            return;
        }
    	
    	if (gmMarkers.length>0){
    		clearMarkers();
    	}
    	let matches;
        let markerCount = document.querySelectorAll("a[onclick^=\"showLocation(\"]").length;
        
    	document.querySelectorAll("a[onclick^=\"showLocation(\"]")
			.forEach(function(element){
			let value = element.getAttribute("onclick");

			matches = LAT_LON_PARSER.exec(value);
			if (matches){
                //zoom to that marker if there's only one marker
				let placename = matches[2];
				let latitude = Number(matches[3]);
				let longitude = Number(matches[4]);
                let altitude = Number(matches[9]);
				let flag = matches[11].substring(1);
				flag = flag.substring(0, flag.length - 1);
				if (flag !== ""){
					placename += " " + flag;
				}
                if (markerCount === 1){
                    zoomOneLocation(latitude, longitude, altitude);
                }
				addMarker(placename, latitude, longitude); 
            }
    	});
        // zoon to all markers if multiple are shown
        if (markerCount>1){
            showAllMarkers();
        }
        
    };

    titleForBookChapter = function(book, chapter){
    	return book.tocName + (chapter > 0
    		? " " + chapter
    		: ""); // if else statement
    };

    showLocation = function(geotagId, placename, latitude, longitude, 
        viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading){
        zoomOneLocation(viewLatitude, viewLongitude, viewAltitude);

    };

    zoomOneLocation = function(latitude, longitude, altitude){
        map.setCenter({lat:latitude, lng:longitude});
        map.setZoom(altitude/400)
    };

    showAllMarkers = function (){
        let bounds = new google.maps.LatLngBounds();
        for (let i = 0; i< markerLocations.length; i++) {
            bounds.extend({lat:markerLocations[i][0], lng:markerLocations[i][1]});
        }
        map.fitBounds(bounds);
    }

    onHashChanged = function (){
    	let bookId;
    	let chapter;
    	let ids = [];
    	let volumeId;
    	if (location.hash != "" && location.hash.length >1){ 
    		// Remove leading # and split the string on colon delimiters
    		ids = location.hash.substring(1).split(":");
    	}
    	if (ids.length === 1){
    		//display single volumes table of contents
    		volumeId = Number(ids[0]);
    		if (volumeId < volumes[0].id || volumeId > volumes[volumes.length-1].id){
    			navigateHome();
    		}else{
    			navigateHome(volumeId);
    		}
    	}
    	else if (ids.length === 2) {
    		//display books with chapters
    		bookId = Number(ids[1]);
    		if (books[bookId] === undefined){
    			navigateHome();
    		}else{
    			navigateBook(bookId);
    		}
    	}else {
    		//display chapter contents
    		bookId = Number(ids[1]);
    		chapter = Number(ids[2]);

    		if (!bookChapterValid(bookId, chapter)){
    			navigateHome();
    		}else {
    			navigateChapter(bookId, chapter);
    		}
    	}
    };

    return {
        hash: hash,
        init: init,
         showLocation(geotagId, placename, latitude, longitude, 
        viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading){
            showLocation(geotagId, placename, latitude, longitude, 
        viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading);
        },

        onHashChanged(){ 
        	onHashChanged(); // onHashChanged: onHashChanged;
        }
    };

}());

let showLocation;
showLocation = function(geotagId, placename, latitude, longitude, 
        viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading){
    console.log("new location")
    Scriptures.showLocation(geotagId, placename, latitude, longitude, 
        viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading);
<<<<<<< HEAD
}

let slideChapters;
slideChapters = function(){

    $("#scriptures").show("slide", { direction: "left" }, 3000);


}
=======
}
>>>>>>> b77e073c73de3268c40647363291bbcb2dd49170
