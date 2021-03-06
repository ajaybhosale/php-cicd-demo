var recordGridColumn = 0;
var nonSorting = [2, 3, 4];

$(document).ready(function () {
    var records;
    var url = siteUrl + "/admin/acluserroles";
    var urlRecordList = siteUrl + "admin/acluserroles/getList";
    var recordsColumn = [
        {"data": "user_id"},
        {"data": "role_id"},
        {"data": "view", "bSortable": false},
        {"data": "edit", "bSortable": false},
        {"data": "delete", "bSortable": false}
    ];

    //display modal form for record editing
    $(document).on('click', '.open-modal', function () {
        var val = $(this).attr('eid');
        if ('undefined' != typeof (val) && '' != val)
        {
            $.get(url + "/" + val + "/edit", function (data) {
                //success data
                $('#id').val(data.id);
                $('#user_id').val(data.user_id);
                $('#role_id').val(data.role_id);

                $('#btn-save').val("update");
                $('#myModal').modal('show');
            })
        }
        else
        {
            $('#btn-save').val("add");
            $('#myModal').modal('show');

        }
    });

    //display modal form for creating new task
    $(document).on('click', '#btnAdd', function () {
        console.log('on click');
        $('#btn-save').val("add");
        $('#frmAcluserroles').trigger("reset");
        $('#myModal').modal('show');
    });
    //Display detail view in popup
    $(document).on('click', '#btnView', function () {
        var id = $(this).attr('vid');
        $.ajax({
            type: 'GET',
            url: url + '/show/' + id,
            data: {id: id},
            dataType: 'json',
            success: function (data) {
                if (data.errors)
                {
                    $('div#message').html('<div class="alert alert-error"><a aria-label="close" data-dismiss="alert" class="close" href="#">×</a><strong>Error!</strong> While retrieveing record');
                }
                else
                {
                    $('div#modalDetail').find('#user_id').html(data.user_id);
                    $('div#modalDetail').find('#role_id').html(data.role_id);

                    $('#modalDetail').modal('show');
                }
            },
            error: function (data) {
                console.log('Error:', data);
                $('#modalDetail').modal('hide');
            }
        });

    });
    //create new task / update existing task
    $("#btn-save").click(function (e) {
        if ($('form#frmAcluserroles').valid()) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                }
            })
            e.preventDefault();
            var formData = {
                id: $('#id').val(),
                user_id: $('#user_id').val(),
                role_id: $('#role_id').val(),
            }
            //used to determine the http verb to use [add=POST], [update=PUT]
            var state = $('#btn-save').val();
            var type = "POST"; //for creating new resource
            var id = $('#id').val();
            ;
            var my_url = url;
            var msg = 'added';
            if (state == "update") {
                type = "PUT"; //for updating existing resource
                my_url += '/' + id;
                msg = 'updated';
            } else if (state == "add") {
                my_url += '/create';
            }
            $.ajax({
                type: type,
                url: my_url,
                data: formData,
                dataType: 'json',
                success: function (data) {
                    if (data.errors)
                    {
                        $.each(data.errors, function (k, v) {
                            $(document).find('#' + k).after('<span class="help-block">' + v + '<strong></strong></span>');
                            $(document).find('#' + k).parent('div').addClass('has-error');
                        });
                    }
                    else
                    {
                        $('#userrolesGrid').DataTable().ajax.reload(); //to refresh datatables
                        $("#myModal .close").click();
                        BootstrapDialog.show({message: 'Record ' + msg + ' successfully!'});
                    }
                },
                error: function (data) {
                    console.log('Error:', data);
                }
            });
        }
    });

    $.fn.updateRecords = function () {

        $('#userrolesGrid tbody').on('click', '.clsDelete', function () {

            var recordId = $(this).attr('did');

            BootstrapDialog.confirm({
                title: 'WARNING',
                message: 'Are you sure you want to delete this record?',
                type: BootstrapDialog.TYPE_DANGER,
                closable: true,
                draggable: true,
                btnCancelLabel: 'Cancel',
                btnOKLabel: 'Ok',
                callback: function (result) {
                    if (result) {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                            }
                        })

                        $.ajax({
                            type: "DELETE",
                            url: url + '/' + recordId,
                            success: function (data) {
                                $('#userrolesGrid').DataTable().ajax.reload(); //to refresh datatables

                            },
                            error: function (data) {
                                console.log('Error:', data);
                            }
                        });
                        BootstrapDialog.show({message: 'Record deleted successfully!'});
                    }
                }
            });
        });
    }

    //initialise datatables
    $('#userrolesGrid').DataTable({
        responsive: true,
        "order": [[0, "asc"]],
        "autoWidth": false,
        "processing": true,
        "serverSide": true,
        "stateSave": true,
        "ajax": urlRecordList,
        "columns": recordsColumn,
        "initComplete": function (settings, j) {
            $.fn.updateRecords();
        },
        "columnDefs": [{
                "targets": [2, 3, 4], // Column which need to update. Index start from zero
                "render": function (data, type, row, meta) {
                    if (meta.col == 2) {
                        data = "<a id='btnView' class='inline-link clsView glyphicon glyphicon-eye-open' href='#' vid='" + row.id + "' title='View'></a>";
                    }
                    if (meta.col == 3) {
                        data = "<a class='inline-link clsEdit glyphicon glyphicon-pencil open-modal' href='#' eid='" + row.id + "' title='Edit'></a>";
                    }
                    if (meta.col == 4) {
                        data = "<a class='inline-link clsDelete glyphicon glyphicon-trash' href='#' did='" + row.id + "' title='Delete'></a>";
                    }
                    return data;
                }
            }]
    });



});
