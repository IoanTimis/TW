$(document).ready(function(){
    var modal = $('#Modal');
    var form = $('#Form');
    var csrf_token = $('input[name=csrf_token]').val();

    $(form).on('submit', function(e){
        e.preventDefault();
        var url = form.attr('action');
        var method = form.attr('method');

        var name = form.find('input[name=name]').val();
        var email = form.find('input[name=email]').val();

        $.ajax({
            url: url,
            method: method,
            data: {
				csrf_token: csrf_token,
                name: name,
                email: email,
            },
            success: function(response){
                let line = $(`tr[data-id=${response.id}]`);
				//TODO: schimba aceasta medota de selectie a elementelor pt ca este prea sensibila
                line.find('td:eq(1) span').text(response.name);
                line.find('td:eq(2) span').text(response.email);
                alert('User editat cu succes');
                modal.modal('hide');
            }
        });
    });

    $('.btn-info').on('click', function(){
        let id = $(this).data('id');
        let name = $(this).closest('tr').find('td:eq(1) span').text();
        let email = $(this).closest('tr').find('td:eq(2) span').text();

        form.attr('action', `/admin/user/update/${id}`);
        form.attr('method', 'PUT');

        form.find('input[name=name]').val(name);
        form.find('input[name=email]').val(email);

        modal.modal('show');
    });

    $('.btn-danger').on('click', function(){
        let id = $(this).data('id');
        let tr = $(this).closest('tr');

        $.ajax({
            url: `/admin/user/delete/${id}`,
            method: 'DELETE',
			data: {
				csrf_token: csrf_token
			},
            success: function(response){
                tr.remove();
            }
        });
    });
});
