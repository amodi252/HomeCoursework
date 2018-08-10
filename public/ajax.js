$('#new-todo-form').submit(function(e){
	e.preventDefault();
	$('#new-todo-form input').val($('#new-todo-form .lead').text())
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
		$('#new-todo-form .form-control').val('').focus();
	});
});

$('#todo-list').on('click','.textTd', function(){
	$(this).children('.pull-right').show();
	$(this).children('.lead').attr('contenteditable','true');
	$(this).children('.lead').focus();
});

$('#todo-list').on('submit','.edit-item-form', function(e){
	console.log("I'M TRIGGERED 1");
	e.preventDefault();
    var value = $(this).parent().siblings('.lead').text();
	// var input = $("<input />", { 'name' : "todo[text]",
    //                                   'value' : value ,
    //                                   'type' : "hidden" });
    // $(this).append(input);
	$('.edit-item-form input').val(value);
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
	$(this).parent().toggle();
	$(this).parent().siblings('.lead').blur()
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
