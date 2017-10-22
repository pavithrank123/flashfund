(function(){
    angular.module('banking').controller("Homecontrollers",Homecontrollers);
    Homecontrollers.$inject=['$state','MainService','$window','$cookieStore'];
    function Homecontrollers($state,MainService,$window,$cookieStore){
        var ctrl= this;
        ctrl.Username=false;
        ctrl.checkUsername=function()
        {
            var cookiedata=false;
            cookiedata=$cookieStore.get("email");
            if(cookiedata)
            {
                ctrl.Username=cookiedata;
                return true;
            }
            else{
                ctrl.Username=false;
                return false;
            }
        };
        ctrl.registerstate=function()
        {
            console.log("Traversing to Registeration");
            $state.go('Userreg');
        };
        ctrl.ministate=function()
        {
            console.log("Traversing to Ministatement");
            $state.go('Mini')
        };
        ctrl.accounts=function()
        {
            console.log("Traversing to accounts");
            $state.go('Accounts')
        };
        ctrl.about=function()
        {
            console.log("Traversing to aboutus");
            $state.go('About')
        };
        ctrl.logout=function()
        {
            var token=$cookieStore.get("email");
            console.log(token);
            var jsondata={
                emailid : token
            };
            MainService.logoutuser(jsondata).then(function(response){
                if(response.status==200)
                {
                    alert("Signout Sucess");
                    $cookieStore.remove("email");
                    $state.go('Landing_page');
                }else if (response.status==402||response.status==401){
                    alert("Login before signing out");
                }
                else
                {
                    alert("Already Signed out");
                    $state.go('Landing_page');
                }
            });
        }
    }
})();