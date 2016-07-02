angular.module('bivlioApp').controller('ExamsController', function ($scope, Customer, ExamsService, AuthService, $state, $stateParams ) {
    $scope.customer = Customer.customer;
    $scope.error;

    $scope.takeExam = function(body1){
      var user = AuthService.getUser();
      var examId = $stateParams.examId;
      var body = {
        "examId": examId,
        "customerId": user.id
      }
      console.log(body);
      ExamsService.takeExam(body).then(function(data) {
        $scope.exam = data;
      }, function(error){
        $scope.error = error;
      });
    }

    $scope.endExam = function(body1) {
      var user = AuthService.getUser();
      var examId = $stateParams.examId;
      var body = {
        "examId": examId,
        "customer": user.id
      }
      ExamsService.endExam(body).then(function(data) {
        console.log(data);
        $state.go("exam_result", { "examId": examId});
      }, function(error){
        $scope.error = error;
      });
    }

    $scope.getExam = function(body1) {
      var user = AuthService.getUser();
      var examId = $stateParams.examId;
      var body = {
        "examId": examId,
        "customer": user.id
      }
      console.log(body);
      ExamsService.getExam(body).then(function(data) {
        //console.log(data);
        $scope.examResult = data;
        //$scope.circle = ((data.percent * 158)/100);
        $scope.circle = ((158 * 158)/100);
      }, function(error){
        $scope.error = error;
      });
    }

})
