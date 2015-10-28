//var baseUrl = "http://patrickpu.meteor.com";
var baseUrl = "http://localhost:3000";
var time_format = 'YYYY-MM-DD HH:mm:ss';
var max_length = 500;
var limit = 5;

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $state) {

    $scope.$on('$ionicView.enter', function(e) {
      refresh();
    });
    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadData();
    });

    $scope.refresh = refresh;
    $scope.$state = $state;
    $scope.loadData = load;

    $scope.moreData = function(){
      return true;
    }
    $scope.formatTime = function(timeStr){
      return moment(timeStr).format(time_format);
    }

    function refresh(){
      $scope.pagination = {
        curTime: moment().valueOf(),
        offset: 0,
        limit: 10
      }

      $http({
        method: 'POST',
        url: baseUrl + '/post',
        data: serializeData($scope.pagination),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(result){
        console.log('Success: ', result);
        $scope.posts = result.data;
      }).finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
        $scope.canLoad = true;
      });
    }

    function load(){
      if ($scope.pagination) {
        console.log($scope.pagination);
        $scope.pagination.offset += $scope.pagination.limit;

        $http({
          method: 'POST',
          url: baseUrl + '/post',
          data: serializeData($scope.pagination),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(result){
          console.log('Success: ', result);
          if (result.data.length === 0){
            $scope.canLoad = false;
            console.log('no more data to load');
          }
          $scope.posts.concat(result.data);
        }).finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.loadStarted = false;
        });
      }else{

      }
    }

    $scope.loadMore = function() {
      load();
      //console.log('loading more..');
      //$scope.loadStarted = false;
      //if (!$scope.loadStarted){
      //  $scope.loadStarted = true;
      //  load();
      //}
      //$scope.items.push({ id: $scope.items.length});
      //
      //if ( $scope.items.length == 99 ) {
      //  $scope.canLoad = true;
      //}
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    //$scope.items = [];

  })

.controller('ComposeCtrl', function($scope, $http, $state, $stateParams){
    createNewPost();

    $scope.maxlength = max_length;
    $scope.curLength = function(){
      if ($scope.newPost.message){
        var message = $scope.newPost.message;
        var newLines = $scope.newPost.message.match(/(\r\n|\n|\r)/g);
        var extraLength =  newLines ? newLines.length : 0;
        return $scope.newPost.message.length + extraLength;
      }else{
        return 0;
      }
    }
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
        createNewPost();
        $state.transitionTo('tab.dash', null, {reload: true, notify:true});
      })
    }

    function createNewPost(){
      $scope.newPost = {
        name: "Patrick"
      };
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
