(function(){
	'use strict';

	angular.module('blog', ['ngRoute', 'blog.controllers','blog.services','blog.templates']);

	function config($locationProvider, $routeProvider){
		$locationProvider.html5Mode(true);

		$routeProvider
			.when('/',{
				templateUrl: '/views/post-list.html',
				controller: 'PostListCtrl',
				controllerAs: 'postList'
			})
			.when('/post/:postId',{
				templateUrl: '/views/post-detail.html',
				controller: 'PostDetailCtrl',
				controllerAs: 'postDetail'
			}).
			when('/new',{
				templateUrl: '/views/post-create.html',
				controller: 'PostCreateCtrl',
				controllerAs: 'postCreate'
			});
	}

	angular
		.module('blog')
		.config(config);
})();
