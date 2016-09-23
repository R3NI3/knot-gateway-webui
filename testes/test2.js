function ListaDevicesController($scope) {
	$scope.devices = [
		{uuid: 'Leite', token: 20, status: false},
		{uuid: 'Cerveja', token: 12, status: false}
	];


	$scope.adicionaDevice = function () {
		$scope.devices.push({uuid: $scope.device.uuid,
					token: $scope.device.token
					status: false});
		$scope.device.uuid = $scope.device.token = '';
	};
}
