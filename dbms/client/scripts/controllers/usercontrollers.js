(function(){
    angular.module('banking').controller("Usercontrollers",Usercontrollers);
    Usercontrollers.$inject=['$state','MainService','$cookieStore','$window'];
    function Usercontrollers($state,MainService,$cookieStore,$window){
        var ctrl= this;
        ctrl.currentClass = false;
        ctrl.showsendbutton=false;
        ctrl.showsend=function () {

            ctrl.showsendbutton=!ctrl.showsendbutton;
        }
        ctrl.clickfunc=function()
        {
            console.log("SUCCESS");
        };
        ctrl.addactive=function(){
            ctrl.currentClass=!ctrl.currentClass;
        };
        ctrl.removeactive=function(){
            ctrl.currentClass=false;
        };
        ctrl.showbalance=function () {
            ctrl.showsendbutton=!ctrl.showsendbutton;
            var fromemail=$cookieStore.get("email");
            var json={
              data:fromemail
            };
            MainService.balance(json).then(function (res) {
                if(res.status==200) {
                    console.log(res);
                    ctrl.balance = res.data;
                }
                else
                {
                    alert("Error in Database or query");
                }
            });
        };
        ctrl.verifyuser=function () {
            var fromemail=$cookieStore.get("email");
            var json={
                femail:fromemail,
                email:ctrl.touser,
                amt:ctrl.toamount
            };
          MainService.verifyusers(json).then(function (response) {
             if(response.status==200){
                 alert("MONEY TRANSFERRED");
             }
             else if(response.status==401)
             {
                 alert("INSUFFICIENT BALANCE");
             }
             else if(response.status==402)
             {
                 alert("Receptant is not available");
             }
             else
                 alert("Transaction error");
          });
        };
        ctrl.logindata=function () {
            var data1 ={
                username : ctrl.username,
                password : ctrl.pass
            };
            console.log(data1);
            MainService.loginsubmit(data1).then(function(response){
                if(response.status==200){
                    $cookieStore.put("email",response.data.data);
                    var data=$cookieStore.get("email");
                    alert("Logged in!!!");
                    $state.go('Homepage');
                }
                else if(response.status==402)
                {
                    alert("User does not exists");
                }
                else if(response.status==401)
                {
                    alert("Password is incorrect");
                }
            });
        };
        ctrl.registerdata=function()
        {
            var data={
                name : ctrl.username,
                password :ctrl.password
            };
            MainService.register(data).then(function(response){
              if(response.status==200){
                  alert('Registeration succesful');
                $state.go('Userreg');
              }
              else if(response.status==401) {
                  alert("User already exists");
              }
              else
                  alert("Error in data");
            });
        };

    }
/*
        ctrl.detailsub=function() {
            var datas= {
                name: ctrl.name,
                age: ctrl.age,
                address: ctrl.address,
                country: ctrl.country,
                gender: ctrl.gender,
                email: ctrl.email,
                phone: ctrl.phone
            };
            console.log("TeST");
				MainService.registerdetails(datas).then(function (response) {
				console.log(response);
				$state.go('Homepage');
            });
            }
*/
})();
