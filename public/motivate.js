$('#button').click(function (){
    console.log("I'm in");
        $('.grid').masonry({
          // options
          itemSelector: '.grid-item',
          columnWidth: 0
        });
});
