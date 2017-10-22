(function(){
	'use strict';
	var states= [
	{
		name: 'Homepage',
		state:
		{
			url:'/',
			templateUrl: '../views/homepage.html',
			data : {
				text:"HOME",
				visible:false
			}
		}
	},
	{
		name: 'Accounts',
		state:
		{
			url:'/accounts',
			templateUrl: '../views/account.html',
			data : {
				text:"ACCOUNTS PAGE",
				visible:false
			}
		}
	},
	{
		name: 'Userreg',
		state:
		{
			url:'/user',
			templateUrl: '../views/register.html',
			data : {
				text:"User register page",
				visible:false
			}
		}
	},
	{
		name: 'Mini',
		state:
		{
			url:'/ministatement',
			templateUrl: '../views/ministatement.html',
			data : {
				text:"Mini statement page",
				visible:false
			}
		}
	},
	{
		name: 'About',
		state:
		{
			url:'/send',
			templateUrl: '../views/aboutus.html',
			data : {
				text:"About us",
				visible:false
			}
		}
	}

	];
	var app = angular.module('banking',[
		'ui.router',
		'ngCookies'])
	.config(function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise('/');
		angular.forEach(states,function(state){
         $stateProvider.state(state.name,state.state);

		});

	});
})();