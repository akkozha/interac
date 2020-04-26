var playMode = "mix";

var markers = new Array(); // all markers
var openMarker = null;

var MarkersPositions = AppClient.getParameters("m#pos");
var MarkersContent   = AppClient.getParameters("m#lsg");
var splitMode        = AppClient.getParameters("splitMode").isEqual(AppClient.getTranslation("Split2"));
///////////////////////////////////////////////////////////////////////////////
// Some counters for Media elements
///////////////////////////////////////////////////////////////////////////////
var videoCardLetters = new Array();
var audioCardLetters = new Array();
///////////////////////////////////////////////////////////////////////////////
function getLetterForNumber(i){
 var s = "";
 while(i > 0){ s += String.fromCharCode(64+i%26); i = i - 26; } 
 return s;
}
///////////////////////////////////////////////////////////////////////////////
function getRandomLetterFromList(type){
  var r = 0;
  if(type == "audio") {
    r = AppClient.random(audioCardLetters.length);
    return audioCardLetters.splice(r,1);
  }
  if(type == "video") {
    r = AppClient.random(videoCardLetters.length);
    return videoCardLetters.splice(r,1);
  }
}
////////////////////////////////////////////////////////////////////////////////

AppClient.onInit = function(){
   
  var baseImageURL = AppClient.getParameter("baseimage");
  if(baseImageURL === "") baseImageURL = "empty.png";
  
  var i;
 
  // count media cards for random letters (Audio A, Audio B, Audio C)
  // we want to shuffel them in order to make it not so easy
  // we have to count all parameters before creating cards
  // we can random choose from LetterArray for each card later
  var audioCardCounter = 1;
  var videoCardCounter = 1;
  
  for(i = 0; i < MarkersPositions.length; i++){
    if(MarkersPositions[i].value === "") continue;
    if(MarkersContent[i].value === "") continue;
    if(MarkersContent[i].media == "speech" || 
       MarkersContent[i].media == "audio") audioCardLetters.push(getLetterForNumber(audioCardCounter++));
    if(MarkersContent[i].media == "video") videoCardLetters.push(getLetterForNumber(videoCardCounter++));
  }

  for(i = 0; i < MarkersPositions.length; i++){
    if(MarkersPositions[i].value === "") continue;
    if(MarkersContent[i].value === "") continue;
    var marker = addMarker(MarkersPositions[i].value,MarkersPositions[i].list.index);
    marker.content = MarkersContent[i];
  }
  
  // create cards for all markers
  for(i = 0; i < markers.length; i++){
    markers[i].card = addCard(markers[i].content);
    markers[i].card.marker = markers[i];
  }
  // sort cards alphabetical
  markers.sort(function(a,b) {
    return (a.card.innerHTML.toLowerCase() < b.card.innerHTML.toLowerCase() ? -1 :
           (a.card.innerHTML.toLowerCase() > b.card.innerHTML.toLowerCase() ? 1 : 0)); });

  for(i = 0; i < markers.length; i++)
    $("#cards").append(markers[i].card.htmlElement); // add the card html Element to the #cards container
  
  // find all matching markers - special case: there might be equal cards in other pairs
  for(i = 0; i < markers.length; i++){
    markers[i].matchingMarkers = new Array();
    for(var z = 0; z < markers.length; z++){
      if(markers[i].content.isEqual(markers[z].content))
         markers[i].matchingMarkers.push(markers[z]);
    }
  }
  $(window).on('resize', resizeWindow);

  var img = new Image() ;
  img.onload = function() {
    $('#baseimg').attr("src",baseImageURL);
    resizeWindow();
    setTimeout(function(){
      resizeWindow();
      document.getElementById("markerLayer").style.visibility = "visible";
    },200); // IE Cache problem    
  };
  img.onerror = function(){
    baseImageURL = "empty.png";
    $('#baseimg').attr("src",baseImageURL);
    resizeWindow();
    setTimeout(function(){
      resizeWindow();
      document.getElementById("markerLayer").style.visibility = "visible";
    },200); // IE Cache problem    

  };
  img.src = baseImageURL;

  $('#zoom').on("click",function(){  $("#solutionPanel").fadeOut("fast"); });

  if(markers.length > 0)
    $("#content").append('<div id="checksolutionBtnPanel"><div id="checkSolutionBtn" onclick="AppClient.checkSolution()">'+
                     '<i class="glyphicon glyphicon-check"></i></div></div>');   
    else
    AppClient.setSolved();

  //fillItems();
};

///////////////////////////////////////////////////////////////////////////////
var lastWindowSizeW = -1;
var lastWindowSizeH = -1;
///////////////////////////////////////////////////////////////////////////////
// scale cards and position of cards when window size is changing
///////////////////////////////////////////////////////////////////////////////
function resizeWindow(){
 document.getElementById('markerLayer').style.width = document.getElementById('baseimg').clientWidth+"px";
 document.getElementById('markerLayer').style.height = document.getElementById('baseimg').clientHeight+"px";
 document.getElementById('markerLayer').style.left = document.getElementById('baseimg').offsetLeft+"px";
 document.getElementById('markerLayer').style.top = document.getElementById('baseimg').offsetTop+"px";
  
  
 if($('#solutionPanel').is(":visible") ){
  $(".card").each(function(){ 
   // resize card font size: 
   var resizeText = $('.resizeText', $(this));
   if(resizeText.length > 0){
     var fontSize = 1.8;
     resizeText.css('font-size', fontSize+"em");
     resizeText.css('line-height', "normal");
     var maxWidth = $(this).width();
     var maxHeight = $(this).height();
     var textHeight;
     var textWidth;
     fontSize = 1.6;
     do {
        resizeText.css('font-size', fontSize+"em");
        textWidth = resizeText.width();
        textHeight = resizeText.height();
        fontSize = fontSize - 0.1;
     } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 0.3);
   }
  });  
 }
 
}
///////////////////////////////////////////////////////////////////////////////
// add a new card to list
///////////////////////////////////////////////////////////////////////////////
function addCard(parameter){ 
 // each card has a card object containing some properties
 var card = new Object(); 
 card.parameter = parameter;

 // build some inner html content for each card based on its type 
 if(parameter.media == "text"){
  card.innerHTML = '<div class="verticalCenterBox"><div class="verticalCenterBoxInner"><span unselectable="on" class="resizeText">'+AppClient.linkifyText(parameter.value)+'</span></div></div>';
 }
 if(parameter.media == "image"){
  card.innerHTML = '<div class="verticalCenterBox"><div class="verticalCenterBoxInner"><img src="'+parameter.value+'" alt=""/></div></div>';
 } 
 if(parameter.media == "speech"){
  card.innerHTML = '<div class="verticalCenterBox"><div class="verticalCenterBoxInner"><div class="playMediaBtn"><span class="glyphicon glyphicon-headphones"></span> '+
                   'Audio '+ getRandomLetterFromList("audio")+'</div></div></div>';
 } 
 if(parameter.media == "audio"){
  card.innerHTML = '<div class="verticalCenterBox"><div class="verticalCenterBoxInner"><div class="playMediaBtn"><span class="glyphicon glyphicon-headphones"></span> '+
                   'Audio '+ getRandomLetterFromList("audio")+'</div></div></div>'; 
 }
 if(parameter.media == "video"){
  card.innerHTML = '<div class="playMediaBtn"><span class="glyphicon glyphicon-film"></span> '+
                   'Video '+ getRandomLetterFromList("video")+'</div><img class="videoThumb" src="'+parameter.thumbURL+'" style="padding-bottom:20px" alt=""/>';
 }
 
 // build the card html element with pin, tape and hint if available
 var html = $('<div class="card" id="card'+card.parameter.list.index+'">'+
              (card.parameter.hint !== "" ?
                '<span class="hintbtn hintbtn_'+card.parameter.media+' popovers"'+ 
                ' data-container="#cards" data-toggle="popover" data-placement="auto"'+
                ' data-content="'+AppClient.linkifyText(card.parameter.hint).replace(/"/g,'&quot;')+'">'+
                '<span class="glyphicon glyphicon-info-sign infoicon"></span></span>'
               : '')+
              card.innerHTML+
              '</div>');
 card.htmlElement = html; // this is the html Element for this card
 html.data("card",card);  // we also add the card object to the html Element, 
                          // so we can use it in event handlers later
 if(card.parameter.hintTTS == '1')
   $('.hintbtn',html).on('click mouseover touchend',function(){ 
     AppClient.textToSpeechStop(); 
     AppClient.textToSpeech(card.parameter.hint); 
   });

 card.selectIt = function(event){
   onSolutionSelected(card);
 };

 // make card clickable
 card.htmlElement.on("click", onCardClick);
 
 // make hint popover hoverable and touchable
 $('.popovers',card.htmlElement).popover({trigger:"hover",
      placement: function (context, source) {
       return (card.htmlElement.position().top < 100 ? "bottom" : "auto");
      }
  })
  .on('touchstart mousedown', function(e) {
     stopEvent(e);
     $(this).popover('toggle');
  });

 return card;
}
///////////////////////////////////////////////////////////////////////////////
// card was clicked / touched
///////////////////////////////////////////////////////////////////////////////
function onCardClick(e){
 // card clicked, show lightbox if necessary 
 stopEvent(e);
  
 var card = $(e.currentTarget).data("card");
 var dialogButtons = '<div class="closeBtn largeButton" data-dismiss="modal">'+AppClient.getTranslation("back").toUpperCase()+ '</div><div class="selectBtn largeButton" data-dismiss="modal">'+AppClient.getTranslation("select").toUpperCase()+ '</div>';
  
 if(card.parameter.media == "text"){
   // text has no lightbox, do nothing
   card.selectIt();
 }
     
 if(card.parameter.media == "image"){
  // only open lightbox, if image is twice as large as the card
  var img = new Image();
  img.src = card.parameter.value;
    
  if(img.width > card.htmlElement.width()*2 || img.height > card.htmlElement.height()*2){
   createModalDialogFrame(dialogButtons+'<div id="modalContentInner" style="margin-bottom:40px"></div>',
    function() {
     // on show
     $('#modalContentInner').html('<img data-dismiss="modal" class="img-responsive" '+
                                  'style="margin: 0 auto;" src="'+card.parameter.value+'" alt=""/>');
    }
   ).modal("show");
   $('.selectBtn').on("click",card.selectIt);
  }else{
   card.selectIt();
  }
 }  

 if(card.parameter.media == "speech"){
  createModalDialogFrame(card.innerHTML+dialogButtons+'<div id="modalContentInner" style="margin-bottom:40px"></div>',
   function(){ 
    card.parameter.loadPlayer("modalContentInner",true); 
    $("#modalContentInner a").addClass("speechPlayBtn");
   }, function(){ AppClient.textToSpeechStop();}
  ).modal("show");
  $('.selectBtn').on("click",card.selectIt);
 }

 if(card.parameter.media == "audio"){
  createModalDialogFrame(card.innerHTML+dialogButtons+'<div id="modalContentInner" style="margin-bottom:40px"></div>',
   function(){ card.parameter.loadPlayer("modalContentInner",true); }
  ).modal("show");
  $('.selectBtn').on("click",card.selectIt);
 }

 if(card.parameter.media == "video"){
   createModalDialogFrame(card.innerHTML+dialogButtons+'<div id="modalContentInner" style="margin-bottom:40px"></div>',
   function(){
    $("#modalContentInner").height(
      Math.min($("#modalContentInner").width() / 4 * 3 +30,$(window).height()*0.7));
    card.parameter.loadPlayer("modalContentInner",true);
   }
  ).modal("show");
  $('.selectBtn').on("click",card.selectIt);
 }     
}

////////////////////////////////////////////////////////////////////////////////

function addMarker(pos,id) {
  var marker = new Object();
  var a = pos.split(";");
  marker.ID = id;
  marker.x = parseFloat(a[0]);
  marker.y = parseFloat(a[1]);
  if(a.length >2 && a[2] != "")
    marker.color = a[2];  else
    marker.color = "red"; // red, blue ...
   
  marker.currentSolution = null;
  marker.orgMarkerURL = 'marker_icon_'+marker.color+'_small.png';
  marker.html = $('<div id="marker'+id+'" class="marker" style="background-image:url('+marker.orgMarkerURL+');left:'+marker.x+'%;top:'+marker.y+'%;"></div>');
  $('#markerLayer').append(marker.html);
  $('#marker'+id).on("click",function(){
    showSolutionPanel(marker);
    resizeWindow();
  });
  marker.setImage = function(url){ $('#marker'+id).css("background-image",'url('+url+')'); };
  markers.push(marker);
  return marker;
}

////////////////////////////////////////////////////////////////////////////////

function showSolutionPanel(marker) {
  $("#solutionPanel").fadeIn("fast");
  openMarker = marker;
  $(".card").removeClass("usedItem highlight").show();
  
  $(".card").each(function(){
    var card = $(this).data("card");
    if(splitMode) {
      // split mode only show matching color cards
      if(marker.color != card.marker.color) card.htmlElement.hide();
    }
  });
  
  for(var i=0; i < markers.length; i++){
    if(markers[i].currentSolution !== null) 
       markers[i].currentSolution.htmlElement.addClass("usedItem");
  }
  
  if(marker.currentSolution !== null){
     marker.currentSolution.htmlElement.addClass("highlight");
  }

  var zoomFactor = 1.5;
  $("#zoom").html('<img src="'+document.getElementById('baseimg').src+'" id="zoomImg" width="'+zoomFactor*document.getElementById('baseimg').clientWidth+'px" /><img src="'+openMarker.orgMarkerURL+'" id="solutionMarker" width="'+zoomFactor*24+'px" /><div class="zoomBack">'+AppClient.getTranslation("back")+'</div>');
	
  $("#zoomImg").css({"margin-top":(zoomFactor*(-Math.floor(openMarker.y*document.getElementById('baseimg').clientHeight/100)-24)+document.getElementById("zoom").clientHeight/2)+"px",
                     "margin-left": (zoomFactor*(-Math.floor(openMarker.x*document.getElementById('baseimg').clientWidth/100)-12)+document.getElementById("zoom").clientWidth/2)+"px"});

	document.getElementById("solutionMarker").style.marginTop = document.getElementById("zoom").clientHeight/2-(zoomFactor*24)+"px";
	document.getElementById("solutionMarker").style.marginLeft = document.getElementById("zoom").clientWidth/2-(zoomFactor*12)+"px";

}

////////////////////////////////////////////////////////////////////////////////

function onSolutionSelected(card){
 openMarker.currentSolution = card;
  
 var d = document.getElementById("marker"+openMarker.ID);
 var r = "";
 if(card.parameter.media == "text") {
  var s = card.parameter.value;
  if(s.length > 30) 
   r = s.substr(0,30)+"..."; else r = s;
 }else{
  r = card.innerHTML; 
 }
  
 d.innerHTML = '<div id="marker'+openMarker.ID+'_inner" class="marker_inner '+(parseInt(openMarker.x) > 70 ? 'right':'left')+'">'+r+'</div>';
  
 $("#marker"+openMarker.ID).css("background-color", "transparent");
 $("#solutionPanel").fadeOut("fast");
}

////////////////////////////////////////////////////////////////////////////////

function checkSolution() {
  var solutionOk = true;
  var wrong = 0;
  for (var i = 0; i < markers.length; i++){
    var isOK = false;
    if(markers[i].currentSolution)
      for (var z = 0; z < markers[i].currentSolution.marker.matchingMarkers.length; z++){
        if(markers[i].currentSolution.marker.matchingMarkers[z] == markers[i]) isOK = true;
      }
    
    if(isOK) {
      document.getElementById("marker"+markers[i].ID).style.zIndex = 1;      
      var d = document.getElementById("marker"+markers[i].ID+"_inner");
      if(d) d.style.backgroundColor = '#AAFFAA'; 
    }else{
      document.getElementById("marker"+markers[i].ID).style.zIndex = 2;      
      var d = document.getElementById("marker"+markers[i].ID+"_inner");
      if(d) {
        d.style.backgroundColor = '#FFAAAA'; 
      } else {
        document.getElementById("marker"+markers[i].ID).style.backgroundColor = '#FF3333';  
      }
      solutionOk = false;
      wrong++;  
    }
  }

  AppClient.setChecked(solutionOk ? 1 : 0,wrong);

  // tell LearningApps this app was solved
  if(solutionOk) AppClient.setSolved();
  
  // user found the correct solution? if feedback is not already displayed show it
  if(solutionOk && $("#feedback").length === 0){
    var f = AppClient.getParameters("feedback").value;
    if(trim(f) !== "")
    $("body").append(
      '<div id="feedback" '+(f.length < 50 ? 'style="text-align:center"':'')+'>'+AppClient.linkifyText(f)+
       '<br><br><div style="text-align:center">'+
        '<button style="font-size:120%" onclick="$(\'#feedback\').remove()">OK</button>'+
      '</div>');
  }

}

