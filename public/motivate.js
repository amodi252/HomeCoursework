var imgs = [];

init();
var exam = [];
var allItems;
function init () {
    var boardInfo = ['motivateamazebegreat/inspirational-quotes',
                     'joabauer/inspiring-quotes',
                     'sayingimages/motivational-quotes'
    ];

    var promises = [];
    boardInfo.forEach(source => {
        promises.push(getImages(source));
    });
    Promise.all(promises).then(function() {
        return getRandom();
    }, function(err){
        console.log("huh " + err);
    }).then(function() {
        $(window).on("load", function () {
            allItems = $(".item");
            $.each(allItems, function(i,item){

                console.log($(item));
                resizeInstance($(item));
            });
        });
        // allItems.forEach(function(item) {
        //   imagesLoaded(item, resizeInstance);
        // });
    });
}

function getImages (source, callback) {
    return new Promise(function(res,rej) {
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: "https://api.pinterest.com/v3/pidgets/boards/" + source + "/pins/",
            success: function(inp) {
                for (var i = 0; i < inp.data.pins.length; i++) {
                    var a = inp.data.pins[i].images["237x"].url;
                    a = a.replace('/237x/','/564x/');
                    imgs.push([a, inp.data.pins[i].description]);
                    res(true);
                }
            }
        });
    });
}

function getRandom () {
    for (var i = 0; i < 10; i++) {
        var rand = Math.floor(Math.random() * imgs.length);

        $('.grid').append(
            `<div class="item photo">
                <div class="content">
                    <img class="photothumb" src="${imgs[rand][0]}" alt="${imgs[rand][1]}">
                </div>
            </div>`
        )
        imgs.splice(rand,1);
    }
}

window.onload = resizeAllGridItems();
$(window).on("resize", resizeAllGridItems);


function resizeInstance(instance){
	item = instance.first();
    resizeGridItem(item);
}

function resizeAllGridItems(){
    // allItems = $(".item");
    // allItems.forEach(function(item) {
    //   imagesLoaded(item, resizeInstance);
    // });

    allItems = $(".item");
    $.each(allItems, function(i,item){
        console.log(instance);
        resizeInstance($(item));
    });
}

function resizeGridItem(item){
  $grid = $(".grid").first();
  rowHeight = parseInt($grid.css('grid-auto-rows'));
  rowGap = parseInt($grid.css('grid-row-gap'));
  rowSpan = Math.ceil((item.children('.content').get(0).getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.css('gridRowEnd', 'span '+rowSpan);
}
