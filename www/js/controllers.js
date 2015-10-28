var baseUrl = "http://patrickpu.meteor.com";
//var baseUrl = "http://localhost:3000";

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
    refresh();

    $scope.refresh = refresh();

    function refresh(){
      $http.get(baseUrl + "/post")
        .success(function(data) {
          console.log(data);
          $scope.posts = data;
        });
    }
  })

.controller('ComposeCtrl', function($scope){

  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
