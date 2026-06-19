function load_student_fromxml(dataset_path, bodystudents) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dataset_path, true);
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
            var tag_students = xmlDoc.getElementsByTagName("student");
            
            bodystudents.innerHTML = "";

            for (var i = 0; i < tag_students.length; i++) {
                var value_tag_id = tag_students[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
                var value_tag_name = tag_students[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
                var value_tag_birthday = tag_students[i].getElementsByTagName("birthday")[0].childNodes[0].nodeValue;
                var value_tag_gender = tag_students[i].getElementsByTagName("gender")[0].childNodes[0].nodeValue;

                var tr = document.createElement("tr");
                var td_id = document.createElement("td");
                td_id.innerHTML = value_tag_id;
                var td_name = document.createElement("td");
                td_name.innerHTML = value_tag_name;
                var td_birthday = document.createElement("td");
                td_birthday.innerHTML = value_tag_birthday;
                var td_gender = document.createElement("td");
                td_gender.innerHTML = value_tag_gender;

                tr.appendChild(td_id);
                tr.appendChild(td_name);
                tr.appendChild(td_birthday);
                tr.appendChild(td_gender);

                (function(id, name, bday, gender) {
                    tr.addEventListener("click", function() {
                        var url = 'student_detail.html?id=' + encodeURIComponent(id) +
                                '&name=' + encodeURIComponent(name) +
                                '&birthday=' + encodeURIComponent(bday) +
                                '&gender=' + encodeURIComponent(gender);
                        window.open(url, '_blank');
                    });
                })(value_tag_id, value_tag_name, value_tag_birthday, value_tag_gender);
                bodystudents.appendChild(tr);
            }
        } else if (xhr.readyState == 4) {
            console.error("Không thể tải file XML. Lỗi số: " + xhr.status);
        }
    };
}

function sortTable(n) {
    var table = document.getElementById("student_table");
    var tbody = table.tBodies[0]; // lấy tbody đầu tiên
    var rows = tbody.rows; // chỉ lấy các hàng trong tbody
    var switching = true;
    var dir = "asc";
    var switchcount = 0;

    while (switching) {
        switching = false;
        for (var i = 0; i < (rows.length - 1); i++) {
            var shouldSwitch = false;
            var x = rows[i].getElementsByTagName("TD")[n];
            var y = rows[i + 1].getElementsByTagName("TD")[n];
            // so sánh
            var cmp = 0;
            if (n === 0) {
                var numX = parseInt(x.innerHTML);
                var numY = parseInt(y.innerHTML);
                cmp = (numX > numY) ? 1 : (numX < numY ? -1 : 0);
            } else {
                var strX = x.innerHTML.toLowerCase();
                var strY = y.innerHTML.toLowerCase();
                cmp = (strX > strY) ? 1 : (strX < strY ? -1 : 0);
            }
            if ((dir == "asc" && cmp > 0) || (dir == "desc" && cmp < 0)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            // hoán đổi hai hàng
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var student_body = document.getElementById("student_body");
    
    load_student_fromxml("dataset/dataset.xml", student_body);
    
    var headers = document.querySelectorAll(".column-header");
    headers.forEach(function(header, index) {
        header.addEventListener("click", function() {
            sortTable(index); 
        });
    });
});