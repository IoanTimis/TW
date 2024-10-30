$(document).ready(function() {
    
    $('.buyBtn').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/account/BoughtProduct',
            type: 'post',
            data: {
                    name: $(this).parent().find('strong').html(),
                    price: $(this).parent().find('span').html()
             },
            success: function(response) {
                console.log(response);
                alert('Produs Cumparat cu succes!');
            }, 
            error: function(error) {
                console.log(error);
                alert('Produsul nu a putut fi cumparat!');
            }
        });
    });

    //TODO validari front si backend
    var $form = $('#registerForm');

    $form.on('submit', function(e) {
        if($form.find('input[name="password"]').val().length < 6) {
            alert('Parola trebuie sa fie de minim 6 caractere!');
            return false;
        }
        if($form.find('input[name="password"]').val() !== $form.find('input[name="passwordConfirm"]').val()) {
            alert('Parolele nu coincid!');
            return false;
        } else {
            return true;
        }
    });
});

//---------------------- END OF SCRIPT.JS ----------------------//
$(document).ready(function() {
    // Products -----------------------------------------------------------------------------------------------------
    $(".addForm").on('submit', function(e) {
        e.preventDefault();

        var form = $(this);
        var url = form.attr('action');
        var type = form.attr('method');
        var data = form.serialize();
        
        $.ajax({
            url: url,
            type: type,
            data: {
                name: $(this).find('input[name="name"]').val(),
                price: $(this).find('input[name="price"]').val()
            },
            success: function(response) {
                var html = 
                `<li class="liProduct">
                    <strong>${response.name}</strong>,
                    price: <span>${response.price}</span>
                    <button class="btn editBtn" data-toggle="modal" data-target="#editModal" data-id="${response.id}">Edit</button>
                    <button class="btn deleteBtn" data-id="${response.id}">Delete</button>
                </li>`;
                $('#ulProducts').append(html);
                console.log(response);
            }, 
            error: function(error) {
                console.log(error);
            }
        });
    });

    $(".editForm").on('submit', function(e) {
        e.preventDefault();
    
        var form = $(this);
        var url = form.attr('action');
        var type = form.attr('method');
        var data = form.serialize();
        
        $.ajax({
            url: url + '/' + $(this).find('input[name="id"]').val(),
            type: type,
            data: {
                name: $(this).find('input[name="name"]').val(),
                price: $(this).find('input[name="price"]').val()
            },
            success: function(response) {
                $(`#ulProducts li button[data-id=${response.id}]`).parent().find('strong').html(response.name);
                $(`#ulProducts li button[data-id=${response.id}]`).parent().find('span').html(response.price);
                console.log(response);
            }, 
            error: function(error) {
                console.log(error);
            }
        });
    });


    $('#ulProducts').on('click', '.deleteBtn', function() {
        var id = $(this).data('id');
        var li = $(this).parent();
        
        $.ajax({
            url: '/vendor/delete-product' + '/' + id,
            type: 'delete',
            data: { id: id },
            success: function(response) {
                li.remove();
                console.log(response);
            }, 
            error: function(error) {
                console.log(error);
            }
        });
    });

    

    $('#ulProducts').on('click', '.deleteByAdminBtn', function() {
        var id = $(this).data('id');
        var li = $(this).parent();
        
        $.ajax({
            url: '/admin/products' + '/' + id,
            type: 'delete',
            data: {},
            success: function(response) {
                li.remove();
                console.log(response);
            }, 
            error: function(error) {
                console.log(error);
            }
        });
    });

    $('#ulProducts').on('click', '.editBtn', function() {
        var id = $(this).data('id');
        
        $('#editModal').find('.editForm input[name="id"]').val(id);
        $('#editModal').find('.editForm input[name="name"]').val($(this).parent().find('strong').html());
        $('#editModal').find('.editForm input[name="price"]').val($(this).parent().find('span').html());
    });

    // Users -----------------------------------------------------------------------------------------------------
    $(".editUserForm").on('submit', function(e) {
        e.preventDefault();
        console.log(attr = $(this).attr('action'));

        attr
        var form = $(this);
        var url = form.attr('action');
        var type = form.attr('method');
        var data = form.serialize();
        
        $.ajax({
            url: url + '/' + $(this).find('input[name="id"]').val(),
            type: type,
            data: {
                name: $(this).find('input[name="name"]').val(),
                email: $(this).find('input[name="email"]').val()
            },
            success: function(response) {
                $(`#ulUsers li button[data-id=${response.id}]`).parent().find('strong').html(response.name);
                $(`#ulUsers li button[data-id=${response.id}]`).parent().find('span').html(response.email);
                console.log(response);
            }, 
            error: function(error) {
                console.log(error);
            }
        });
    });
        
    $('#ulUsers').on('click', '.editBtn', function() {
        var id = $(this).data('id');
        
        $('#editUserModal').find('.editUserForm input[name="id"]').val(id);
        $('#editUserModal').find('.editUserForm input[name="name"]').val($(this).parent().find('strong').html());
        $('#editUserModal').find('.editUserForm input[name="email"]').val($(this).parent().find('span').html());
    });

    $('#ulUsers').on('click', '.deleteBtn', function() {
        var id = $(this).data('id');
        var li = $(this).parent();
        
        $.ajax({
            url: '/admin/users' + '/' + id,
            type: 'delete',
            data: {},
            success: function(response) {
                li.remove();
                console.log(response);
            }, 
            error: function(error) {
                console.log(error);
            }
        });
    });

    // Orders -----------------------------------------------------------------------------------------------------
    $('#ulSearchProducts').on('click', '.buyBtn', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/account/success',
            type: 'post',
            data: {
                    name: $(this).parent().find('strong').html(),
                    price: $(this).parent().find('span').html()
             },
            success: function(response) {
                console.log(response);
                alert('Produs Cumparat cu succes!');
            }, 
            error: function(error) {
                console.log(error);
                alert('Produsul nu a putut fi cumparat!');
            }
        });
    });

});

