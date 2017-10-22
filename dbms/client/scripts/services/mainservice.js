(function(){
    angular.module('banking').factory("MainService",MainService);
    MainService.$inject=['$http'];
    function MainService($http){
        var service={};
        service.register=register;
        service.loginsubmit=loginsubmit;
        service.logoutuser=logoutuser;
        service.verifyusers=verifyusers;
        service.balance=balance;
        return service;
        function register(data){
            return $http.post('http://localhost:3000/register',data).then(successfunction,failurefunction);
        }
        function loginsubmit(data){
            return $http.post('http://localhost:3000/login',data).then(successfunction,failurefunction);
        }
        function balance(data){
            return $http.post('http://localhost:3000/balance',data).then(successfunction,failurefunction);
        }
        function logoutuser(data){
            return $http.post('http://localhost:3000/logout',data).then(successfunction,failurefunction);
        }
        function verifyusers(data) {
            return $http.post('http://localhost:3000/verify',data).then(successfunction,failurefunction);
        }
       /* function registerdetails(data){
            return $http.post('http://localhost:3000/details',data).then(successfunction,failurefunction);
        }*/
        function successfunction(data){
            console.log("API call success");
            return data;
        }
        function failurefunction(err){
            console.log(err);
            return err;
        }
    }
})();