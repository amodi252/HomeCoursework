var imgs = [];

init();
var exam = [];
function init () {
    var boardInfo = ['motivateamazebegreat/inspirational-quotes',
                     'joabauer/inspiring-quotes',
                     'sayingimages/motivational-quotes'
    ];

    boardInfo.forEach((source, index) => {
        getImages(source, () => {
            if (index === boardInfo.length - 1) {
                getRandom();
            }
        });
    });
}
$(window).on('load', function (){
    // $('.grid').masonry({
    //   // options
    //   itemSelector: '.grid-item',
    //   percentPosition: true,
    //   columnWidth: 1
    // });
});
function getImages (source, callback) {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "https://api.pinterest.com/v3/pidgets/boards/" + source + "/pins/",
        success: function(inp) {
            for (var i = 0; i < 50; i++) {
                var a = inp.data.pins[i].images["237x"].url;
                a = a.replace('/237x/','/564x/');
                imgs.push([a, inp.data.pins[i].description]);
            }
            callback();
        }
    });
}

function getRandom () {
    for (var i = 0; i < 10; i++) {
        var rand = Math.floor(Math.random() * imgs.length);

        $('.grid').append(
            `<div class="grid-item">
                <img src="${imgs[rand][0]}" alt="${imgs[rand][1]}">
            </div>`
        )
        imgs.splice(rand,1);
    }
}
