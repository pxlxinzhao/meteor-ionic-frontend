//var baseUrl = "http://patrickpu.meteor.com";
var baseUrl = "http://localhost:3000";

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $state) {
    refresh();

    $scope.refresh = refresh;
    $scope.$state = $state;

    function refresh(){
      $http.get(baseUrl + "/post")
        .success(function(data) {
          console.log(data);
          $scope.posts = data;
        }).finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });;
    }
  })

.controller('ComposeCtrl', function($scope, $http, $state, $stateParams){
    $scope.newPost = {
      name: "Patrick"
    };
    $scope.post = function(){
      $scope.newPost.createdTime = new Date().toISOString();
      console.log($scope.newPost);
      $http({
        method: 'POST',
        url: baseUrl + '/post/create',
        data: serializeData($scope.newPost),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(data){
        console.log('Success: ', data);
        $state.transitionTo('tab.dash', null, {reload: true, notify:true});
      })
    }
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



function serializeData( data ) {
  // If this is not an object, defer to native stringification.
  if ( ! angular.isObject( data ) ) {
    return( ( data == null ) ? "" : data.toString() );
  }
  var buffer = [];
  // Serialize each key in the object.
  for ( var name in data ) {
    if ( ! data.hasOwnProperty( name ) ) {
      continue;
    }
    var value = data[ name ];
    buffer.push(
      encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
    );
  }
  // Serialize the buffer and clean it up for transportation.
  var source = buffer.join( "&" ).replace( /%20/g, "+" );
  return( source );
}
