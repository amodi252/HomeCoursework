var imgs = [];

init();

function init () {
    var boardInfo = ['motivateamazebegreat/inspirational-quotes',
                     'joabauer/inspiring-quotes',
                     'sayingimages/motivational-quotes'
    ];
    boardInfo.forEach(function(source) {
         getImages(source);
    });
    console.log(imgs);
}

$('.grid').masonry({
  // options
  itemSelector: '.grid-item',
  //columnWidth: 160;
});
function getImages (source) {
    $.ajax({
     type: "GET",
     dataType: "jsonp",
     url: "https://api.pinterest.com/v3/pidgets/boards/" + source +"/pins/",
     success: function(inp) {
       for (var i = 0; i < 50; i++) {
         var a = inp.data.pins[i].images["237x"].url;
         a = a.replace('/237x/','/564x/');
         imgs.push([a, inp.data.pins[i].description]);
        }
     }
    });
}
