function toggleDepartment(categoryId) {
    var department = document.getElementById(categoryId);
    var department_plus = document.getElementById('plus_sign_' + categoryId);
    var department_minus = document.getElementById('minus_sign_' + categoryId);
    department.style.display = (department.style.display != 'none' ? 'none' : '');
    department_plus.style.display = (department_plus.style.display != 'none' ? 'none' : 'inline');
    department_minus.style.display = (department_minus.style.display != 'none' ? 'none' : 'inline');
}

$(function(){
    if ("placeholder" in document.createElement("input")){
    }else{
        $.getScript('/drlite/scripts/jquery.placeholder.js');
    }
});