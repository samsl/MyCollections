angular.module('sam', ['ui.router','ngFileUpload'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('games', {
  url: '/games',
  templateUrl: '/games.html',
  controller: 'GameController'
})
  .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('details', {
  url: '/games/:id',
  templateUrl: '/games/description.html',
  controller: 'GameDescriptionController'
});
   
  
  $urlRouterProvider.otherwise('home');
}])
.controller('MainCtrl',function($scope){

})
.controller('GameController',['$scope', 'Upload', '$http',
	function($scope, Upload, $http) {
	
	$http.get('/api/games').then(function successCallback(response){			
			$scope.games = response.data;
			console.log(response.data);
		},function errorCallback(response){
			
			console.log('Error: ' + response.data);
		});

		$scope.newGame = function(file){
/*
			$http.post('/api/games', $scope.formData)
		.then(function successCallback(response){			
			$scope.games = response.data;
			console.log(response.data);
		},function errorCallback(response){
			
			console.log('Error: ' + response.data);
		}); */
			$scope.formData['file']=file
			file.upload = Upload.upload({
				url: '/api/games',
				method: 'POST',
				data: $scope.formData
			});
			file.upload.then(function (response) {
     			 
       			file.result = true;
       			$scope.games = response.data;
     			
   			}, function (response) {
    			  if (response.status > 0)
      				  $scope.errorMsg = response.status + ': ' + response.data;
   			}, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
     			 file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});

		
/*
		$scope.deleteTodo = function(id){
			$http.delete('/api/todos/' + id)
			.success(function(data){
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data){
				console.log('Error: ' + data)
			});
		};
*/
		
}
$scope.sortBy = function(event){
	$scope.by=event;
}
}])
.controller('GameDescriptionController',['$scope','Upload','$http','$stateParams',function($scope, Upload, $http,$stateParams){
	game_id = $stateParams.id
	$http.get('/api/games/'+game_id).then(function successCallback(response){			
			$scope.gameDescription = response.data;
			console.log(response.data);
		},function errorCallback(response){
			
			console.log('Error: ' + response.data);
		});


}])