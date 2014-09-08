/**
 * Created by GauravKesarwani on 8/20/2014.
 */

 function change(){
    alert("image changed");
    var val = $('#uploadpimg1').val();
   // alert(document.getElementById('uploadpimg1').value);

    var res = val.split("\\");
    res = 'imgs/' + res[res.length-1];
    alert(res);
   // alert(res[res.length -1]);
   $("#pimg1").attr('src',res);
}

var prodApp;
prodApp = angular.module('prodApp', ['ngStorage','ngRoute']);

/*
prodApp.config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('newPrefix');
}]);
*/

prodApp.controller("prodController",['$scope', '$localStorage',  function($scope, $localStorage) {
    var allprods =[];
 //   $localStorage.plist =[]
    $scope.upload = function () {
        // alert($('#uploadpimg1').value);
        $("#uploadpimg1").trigger('click');
    }

    /* $scope.change = function() {
     alert('value changed');
     }*/

    $scope.save = function () {

        var prod = {}
        prod.name =  $scope.myform.pname;
        prod.price = $scope.myform.pprice;
        prod.desc = $scope.myform.pdesc;

        var mypic = document.getElementById("pimg1");
        //alert(mypic)

        var imgCanvas = document.createElement("canvas");
        var imgContext = imgCanvas.getContext("2d");

        imgCanvas.width = mypic.width;
        imgCanvas.height = mypic.height;

        imgContext.drawImage(mypic,0,0,mypic.width,mypic.height);
        // Get canvas contents as a data URL
        var imgAsDataURL = new Image();
        imgAsDataURL = imgCanvas.toDataURL("imgs/png");
        //alert(imgAsDataURL);
        // Save image into localStorage
        try {
            prod.mypic = imgAsDataURL;
        }
        catch (e) {
            console.log("Storage failed: " + e);
        }
        allprods = $localStorage.plist;
        allprods.push(prod);
        $localStorage.plist = allprods;

    }

    $scope.check = function() {
        alert('working')
    }
}]);

prodApp.controller("allprodController",['$scope','$localStorage',function($scope,$localStorage) {
    $scope.allprods = $localStorage.plist;

}])

prodApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.
        when('/allprods', {
        templateUrl: 'allprods.html',
        controller: 'allprodController'
        }).
        when('/prod', {
            templateUrl: 'prod.html',
            controller: 'prodController'
        }).
        otherwise({
            redirectTo: '/prod'
        });
}])