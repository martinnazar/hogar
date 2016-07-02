angular.module('bivlioApp').controller('CustomerController', function ($scope, Customer, CustomerService, AuthService, ExamsService) {
    $scope.customer = Customer.customer;
    $scope.error;
    $scope.errorForm;
    $scope.hideForm = null;

    //$scope.login = Customer.login;
    //$scope.register = Customer.register;
    $scope.toggleObject = {coursosAlumno: -1};
    $scope.toggleObject = {libros: -1};
    $scope.toggleObject = {coursosProfesor: -1};
    $scope.toggleObject = {customers: -1};

    $scope.register = function(userForm){

      $scope.errorForm = "";
      if($scope.registerForm.$valid){
        CustomerService.register(userForm).then(function(data){
          AuthService.register(data);
          Customer.id = data.customer.id;
          Customer.username = data.customer.username;
          Customer.name = data.customer.name;
          Customer.nickname = data.customer.nickname;
          Customer.gender = data.customer.gender;
          Customer.email = data.customer.email;
          Customer.country = data.customer.country;
          Customer.legajo = data.customer.bivlio[0].legajo;
          Customer.institucion = data.customer.bivlio[0].institucion;
          Customer.curso = data.customer.bivlio[0].curso;
          $scope.hideForm = 1;
        }, function(error){
          $scope.error = error;
        });

      }else {
        $scope.errorForm = "Complete todos los campos";
      }

    }

    $scope.logon = function(userForm){

      if($scope.loginForm.$valid){
        CustomerService.login(userForm).then(function(data) {
          AuthService.afterAuth(data);
          Customer.access_token = data.access_token;
          Customer.id_token = data.id_token;

          //LA API ME VA A DEVOLVER ESTO??
          Customer.id = data.customer.id;
          Customer.username = data.customer.username;
          Customer.name = data.customer.name;
          Customer.nickname = data.customer.nickname;
          Customer.gender = data.customer.gender;
          Customer.email = data.customer.email;
          Customer.country = data.customer.country;
          Customer.legajo = data.customer.bivlio[0].legajo;
          Customer.institucion = data.customer.bivlio[0].institucion;
          Customer.curso = data.customer.bivlio[0].curso;

        }, function(error){
          $scope.error = error;
        });

      }else {
        $scope.errorForm = "Complete todos los campos";
      }

    }

    $scope.account_student = function(){
      $scope.user = AuthService.getUser();
      ExamsService.getExams($scope.user.id).then(function(data){
        $scope.micuenta = data.cursos;
        //$scope.circle = ((data.percent * 158)/100);
        $scope.circle = ((158 * 158)/100);

      }, function(error){
        $scope.error = error;
      });
    }

    $scope.account_teacher = function(){

      $scope.user = AuthService.getUser();
      ExamsService.getCurso($scope.user.id).then(function(data){
        $scope.cursos = data.cursos;

      }, function(error){
        $scope.error = error;
      });

    }

    $scope.changepassword = function(){
      $scope.errorForm = "";
      if($scope.changepasswordForm.$valid){
        var body = {
          "contraena": $scope.passwordForm.contraena,
          "repetircontraena": $scope.passwordForm.repetircontraena,
          "repetirnuevacontraena": $scope.passwordForm.repetirnuevacontraena
        }

        CustomerService.changePassword(body).then(function(data){

          $scope.hideForm = 1;

        }, function(error){
          $scope.error = error;
        });

      }else {
        $scope.errorForm = "Complete todos los campos";
      }
    }

})
