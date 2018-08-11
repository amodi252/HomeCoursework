$('#new-todo-form').submit(function(e){
	e.preventDefault();
	newTodoText = $('#new').text();;
	$('#new').focus().text('');
	if (newTodoText === '') return;
	$('#new-todo-form input').val(newTodoText)
	var todoItem = $(this).serialize();
	$.post('/todos', todoItem, function(data){
		$('#todo-list').append(
			`
			<li class="list-group-item">
				<table class="table table-hover">
					<tr>
						<td><input type="checkbox"></td>
						<td class="textTd">
							<div contenteditable="true" class="lead">${data.text}</div>
							<div class="pull-right">
								<form class="edit-item-form" action="/todos/${data._id}" method="POST">
									<input required="true" type="hidden" name="todo[text]" value="${data.text}">
									<button id="updateBtn" class="btn btn-sm btn-warning edit-button">Edit</button>
								</form>
								<form class="delete-item-form" method="POST" action="/todos/${data._id}">
									<button type="submit" class="btn btn-sm btn-danger">Delete</button>
								</form>
							</div>
						</td>
					</tr>
				</table>
			</li>
			`
		);
	});
});

$('#todo-list').on('click','.textTd', function(){
	$(this).children('.pull-right').show();
	$(this).children('.lead').attr('contenteditable','true').focus();
});

$('#todo-list').on('submit','.edit-item-form', function(e){
	e.preventDefault();
	$leadItem = $(this).parent().hide().siblings('.lead').blur();
	$inputItem = $(this).children('input');

	if ($leadItem.text() === $inputItem.val()) {
		return;
	}

	$inputItem.val($leadItem.text());
	var todoItem = $(this).serialize();
	var actionUrl = $(this).attr('action');
	$originalItem = $(this).parent('.list-group-item');

	$.ajax({
		url: actionUrl,
		data: todoItem,
		type: 'PUT',
		originalItem: $originalItem,

		// success: function(data){
		// 	this.originalItem.html(
		// 	`
		// 	<form action="/todos/${data._id}" method="POST" class="edit-item-form">
		// 		<div class="form-group">
		// 			<label for="${data._id}">Item Text</label>
		// 			<input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
		// 		</div>
		// 		<button class="btn btn-primary">Update Item</button>
		// 	</form>
		// 	<span class="lead">
		// 		${data.text}
		// 	</span>
		// 	<div class="pull-right">
		// 		<button class="btn btn-sm btn-warning edit-button">Edit</button>
		// 		<form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
		// 			<button type="submit" class="btn btn-sm btn-danger">Delete</button>
		// 		</form>
		// 	</div>
		// 	<div class="clearfix"></div>
		// 	`
		// 	)
		// }
	});

});

$('#todo-list').on('submit', '.delete-item-form', function(e) {
   e.preventDefault();
   var confirmResponse = confirm('Are you sure?');
   if (confirmResponse) {
   	var actionUrl = $(this).attr('action');
   	$itemToDelete = $(this).closest('.list-group-item');
   	$.ajax({
   		url:actionUrl,
   		type: 'DELETE',
   		itemToDelete: $itemToDelete,
   		success: function(data) {
   			this.itemToDelete.remove();
   		}
   	});
   } else {
   	$(this).find('button').blur();
   }
});

//keybindings
$('.list-group').keypress(function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
        $(e.target).siblings('.selector').children('.chosenForm').submit();

	  	  $('.pull-right:visible').each(function() {
	  		  $(this).children('.chosenForm').submit();
	  	  });
    }
});

$(document).keyup(function(e) {
  if (e.keyCode === 27) {
	  $('.pull-right:visible').each(function() {
		  $(this).toggle().siblings('.lead').text($(this).children('.chosenForm').children('input').val());
	  });
  }
});

$('#todo-list').on('keydown', '.lead', function(e){
	if (e.which === 9) {
		$(e.target).siblings('.pull-right').children('.chosenForm').submit()
		var $next = $(e.target).closest('.list-group-item').next('.list-group-item').find('.lead').click().get(0);

		if (typeof $next === "undefined") return;
		setCursorToEnd($next);
	} else if ((e.ctrlKey || e.metaKey) && (e.keyCode === 46)) {
		$(e.target).siblings('.pull-right').children('.delete-item-form').submit()
	}
});


function setCursorToEnd(ele)
  {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(ele, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    ele.focus();
  }
