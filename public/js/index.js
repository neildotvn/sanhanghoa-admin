function deleteNoti(id) {
    $.ajax({
        url: "/notifications/" + id,
        type: "DELETE",
        crossDomain: true,
        success: function(result) {
            alert("Xoá thông báo thành công!")
            setInterval('refreshPage()', 200);
        }
    });
}

function pushNoti(id) {
    $.ajax({
        url: "/notifications/" + id + "/push",
        type: "POST",
        crossDomain: true,
        success: function(result) {
            alert("Đẩy thông báo thành công!")
            setInterval('refreshPage()', 200);
        }
    });
}

$(document).ready(function() {
    $("button").click(function() {
        // $(this).hide();
    });
});

function refreshPage() {
    location.reload(true);
}
