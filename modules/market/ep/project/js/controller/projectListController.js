angular.module('app.market.ep.project')
    .controller('ProjectListController', ['$scope', '$ionicModal', '$ionicPopup', '$stateParams', '$state', 'ProjectService', '$filter',
        function ($scope, $ionicModal, $ionicPopup, $stateParams, $state, projectService, $filter) {
            $ionicModal.fromTemplateUrl('query-type.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryTypeUp = modal;
            });

            $scope.openQueryTypeUp = function () {
                $scope.fillDataFlag = true;
                $scope.modalQueryTypeUp.show();
            };

            $ionicModal.fromTemplateUrl('query-type.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalQueryTypeLeft = modal;
            });

            $scope.openQueryTypeLeft = function () {
                $scope.fillDataFlag = false;
                $scope.modalQueryTypeLeft.show();
            };

            $scope.hideQueryType = function (org) {
                $scope.modalQueryTypeLeft.hide();
                $scope.modalQueryTypeUp.hide();
                if (org) {
                    $scope.condition.org.orgName = org.name;
                    if ($scope.fillDataFlag) {
                        $scope.reloadData();
                    }
                }
            };


            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });

            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
            };


            $ionicModal.fromTemplateUrl('project-property.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.projectProperty = modal;
            });

            $scope.openProjectProperty = function () {
                if (!$scope.projectProperties) {
                    projectService.getProjectProperties(function (data) {
                        $scope.projectProperties = data;
                        $scope.projectProperty.show();
                    });
                } else {
                    $scope.projectProperty.show();
                }
            };

            $ionicModal.fromTemplateUrl('manager.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.manager = modal;
            });

            $scope.openManager = function () {
                $scope.manager.show();
            };

            $ionicModal.fromTemplateUrl('technical-director.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.technicalDirector = modal;
            });

            $scope.openTechnicalDirector = function () {
                $scope.technicalDirector.show();
            };
            $scope.openIsComplete = function () {
                $scope.isComplete = true;
            };
            $scope.close = function () {
                $scope.isComplete = false;
            };


            //竣工 开工时间选择
            $scope.startTime1 = projectService.getDatePickerTime(function (date) {
                $scope.condition.startTime.min = $filter('date')(date, 'yyyy-MM-dd');
                $scope.startTime2.startDate = date;
                $scope.startTimerPopup.close();
            });

            $scope.startTime2 = projectService.getDatePickerTime(function (date) {
                $scope.condition.startTime.max = $filter('date')(date, 'yyyy-MM-dd');
                $scope.startTime1.endDate = date;
                $scope.startTimerPopup.close();
            });
            //
            $scope.endTime1 = projectService.getDatePickerTime(function (date) {
                $scope.condition.endTime.min = $filter('date')(date, 'yyyy-MM-dd');
                $scope.endTime2.startDate = date;
                $scope.startTimerPopup.close();
            });
            $scope.endTime2 = projectService.getDatePickerTime(function (date) {
                $scope.condition.endTime.max = $filter('date')(date, 'yyyy-MM-dd');
                $scope.endTime1.endDate = date;
                $scope.startTimerPopup.close();
            });

            $scope.openTime = function (url) {
                $scope.startTimerPopup = $ionicPopup.show({
                    templateUrl: url,
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });

                $scope.startTimerPopup.then(function (res) {

                });
            };

            //刷新
            $scope.refreshListData = function () {
                projectService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                })
            };
            $scope.hasNextPage = true;

            //返回时,清除搜索条件
            $scope.back = function () {
                projectService.resetCondition();
                projectService.resetCachedData();
                $state.go('market-management');
            };
            //分页加载
            $scope.loadListData = function () {
                projectService.loadProjectList(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
            $scope.fillData = function () {
                $scope.projectList = projectService.getProjectList();
                $scope.hasNextPage = projectService.hasNextPage();
            };

            $scope.reloadData = function () {
                projectService.reloadData(function () {
                    $scope.fillData();
                })
            };

            //查看项目详细
            $scope.viewDetail = function (id) {
                $state.go('market/ep/project/project-detail', {dataId: id})
            };
            //分公司和集团列表
            projectService.getSubCompany(
                function (data) {
                    $scope.companyList = data;
                }
            );
            //筛选条件
            $scope.condition = projectService.getCondition();

            //人员列表
            projectService.getEmps(function (data) {
                $scope.emps = data;
            });

            //选择技术负责人
            $scope.selectDirector = function (emp) {
                if (emp) {
                    $scope.condition.director.name = emp.realName;
                    $scope.condition.director.id = emp.id;
                } else {
                    $scope.condition.director.name = '不限';
                    $scope.condition.director.id = 0;
                }
                $scope.technicalDirector.hide();
            };
            //选择项目经理
            $scope.selectManager = function (emp) {
                if (emp) {
                    $scope.condition.manager.name = emp.realName;
                    $scope.condition.manager.id = emp.id;
                } else {
                    $scope.condition.manager.name = '不限';
                    $scope.condition.manager.id = 0;
                }
                $scope.manager.hide();
            };
            //承包形式
            $ionicModal.fromTemplateUrl('contract-form.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.contractForm = modal;
            });

            $scope.openContractForm = function () {
                if (!$scope.contractModes) {
                    projectService.getContractMode(function (data) {
                        $scope.contractModes = data;
                        $scope.contractForm.show();
                    });
                } else {
                    $scope.contractForm.show();
                }
            };

            $ionicModal.fromTemplateUrl('contract-form-detail.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.contractFormDetail = modal;
            });
            $scope.selectContractModeA = function (mode) {
                $scope.condition.contractMode.Aid = mode.id;
                if (mode.subs.length > 0) {
                    $scope.contractModesB = mode.subs;
                    $scope.contractFormDetail.show();
                    $scope.condition.contractMode.AName = mode.name;
                } else {
                    $scope.contractForm.hide();
                    $scope.condition.contractMode.name = mode.name;
                }
            };

            $scope.selectContractModeB = function (mode) {
                $scope.condition.contractMode.name = mode.name;
                $scope.contractFormDetail.hide();
                $scope.contractForm.hide();
            };

            //项目性质
            $scope.selectProperty = function (property) {
                $scope.condition.property.name = property.name;
                $scope.projectProperty.hide();
            };

            //资金来源
            $ionicModal.fromTemplateUrl('funds-provided.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.fundsProvided = modal;
            });

            $scope.openFundsProvided = function () {
                if (!$scope.fundingSources) {
                    projectService.getFundingSources(function (data) {
                        $scope.fundingSources = data;
                        $scope.fundsProvided.show();
                    });
                } else {
                    $scope.fundsProvided.show();
                }
            };
            $scope.selectFundSource = function (property) {
                $scope.condition.fundingSources.name = property.name;
                $scope.fundsProvided.hide();
            };
            //结构形式
            $ionicModal.fromTemplateUrl('structural.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.structural = modal;
            });

            $scope.openStructural = function () {
                if (!$scope.structuralForms) {
                    projectService.getStructuralForm(function (data) {
                        $scope.structuralForms = data;
                        $scope.structural.show();
                    });
                } else {
                    $scope.structural.show();
                }
            };

            $ionicModal.fromTemplateUrl('structural-detail.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.structuralDetail = modal;
            });
            $scope.selectStructuralFormA = function (mode) {
                $scope.condition.structuralForm.Aid = mode.id;
                if (mode.subs.length > 0) {
                    $scope.structuralFormsB = mode.subs;
                    $scope.structuralDetail.show();
                    $scope.condition.structuralForm.AName = mode.name;
                } else {
                    $scope.structural.hide();
                    $scope.condition.structuralForm.name = mode.name;
                }
            };

            $scope.selectStructuralFormB = function (mode) {
                $scope.condition.structuralForm.name = mode.name;
                $scope.structuralDetail.hide();
                $scope.structural.hide();
            };

            //建筑类型
            $ionicModal.fromTemplateUrl('build-type.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.buildType = modal;
            });

            $scope.openBuildType = function () {
                if (!$scope.buildingTypes) {
                    projectService.getBuildingType(function (data) {
                        $scope.buildingTypes = data;
                        $scope.buildType.show();
                    })
                } else {
                    $scope.buildType.show();
                }
            };

            $ionicModal.fromTemplateUrl('build-type-detail.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.buildTypeDetail = modal;
            });
            $scope.openBuildTypeDetail = function () {
                $scope.buildTypeDetail.show();
            };
            $ionicModal.fromTemplateUrl('build-type-detail-detail.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.buildTypeDetailDetail = modal;
            });
            $scope.selectBuildingTypeA = function (buildType) {
                $scope.condition.buildingType.Aid = buildType.id;
                if (buildType.subs.length > 0) {
                    $scope.buildingTypesB = buildType.subs;
                    $scope.buildTypeDetail.show();
                    $scope.condition.buildingType.AName = buildType.name;
                } else {
                    $scope.buildType.hide();
                    $scope.condition.buildingType.name = buildType.name;
                }
            };
            $scope.selectBuildingTypeB = function (buildType) {
                $scope.condition.buildingType.Bid = buildType.id;
                $scope.condition.buildingType.BName = buildType.name;
                if (buildType.subs.length > 0) {
                    $scope.buildingTypesC = buildType.subs;
                    $scope.buildTypeDetailDetail.show();
                } else {
                    $scope.buildType.hide();
                    $scope.buildTypeDetail.hide();
                    $scope.condition.buildingType.name = buildType.name;
                }
            };
            $scope.selectBuildingTypeC = function (buildType) {
                $scope.condition.buildingType.Cid = buildType.id;
                $scope.buildType.hide();
                $scope.buildTypeDetail.hide();
                $scope.buildTypeDetailDetail.hide();
                $scope.condition.buildingType.name = buildType.name;
            };

            //查询
            $scope.doPrjSearch = function () {
                $scope.reloadData();
                $scope.modalQueryMore.hide();
            };

            //清空所有条件
            $scope.resetCondition = function () {
                $scope.condition = projectService.resetCondition();
            };

            //省数据
            $ionicModal.fromTemplateUrl('province.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalProvince = modal;
            });

            $scope.openProvince = function () {
                if ($scope.condition.provinces.length == 0) {
                    projectService.getAreas(function (data) {
                        $scope.condition.provinces = data;
                        $scope.modalProvince.show();

                    }, [{field: 'level', value: 2, operator: '=', relation: ''}])
                } else {
                    $scope.modalProvince.show();
                }
            };

            $ionicModal.fromTemplateUrl('city.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalCity = modal;
            });

            $scope.selectProvince = function (obj) {
                $scope.condition.provinceText = projectService.getProvinceText($scope.condition.provinces);
                if (obj.checked) {
                    projectService.getAreas(function (data) {
                        data.unshift({id: 0, name: '全部', checked: false});
                        $scope.province = obj;
                        $scope.cities = data;
                        $scope.modalCity.show();
                    }, [{field: 'pId', value: obj.id, operator: '=', relation: ''}]);
                } else {
                    var index = projectService.getIndex($scope.condition.provinces, obj.id, 'id');
                    $scope.condition.provinces[index].cityText = '';
                    projectService.clearCityData($scope.condition.cities, obj.id);
                }
            };

            $scope.selectCity = function () {
                projectService.clearCityData($scope.condition.cities, $scope.cities[0].pId, function () {
                    //判断是否选择了全部
                    var checkAllFlag = false;
                    for (var i = 0; i < $scope.cities.length; i++) {
                        var city = $scope.cities[i];
                        if (city.checked && city.id == 0) {
                            checkAllFlag = true;
                        }
                    }
                    var cities = [];
                    for (var j = 0; j < $scope.cities.length; j++) {
                        var flag = checkAllFlag ? $scope.cities[j].id > 0 : $scope.cities[j].checked;
                        if (flag) {
                            $scope.condition.cities.push($scope.cities[j].id);
                            cities.push({id: $scope.cities[j].id, name: $scope.cities[j].name})
                        }
                    }
                    var text = projectService.getCityText(cities);
                    var index = projectService.getIndex($scope.condition.provinces, $scope.cities[1].pId, 'id');
                    $scope.condition.provinces[index].cityText = text;
                    $scope.modalCity.hide();
                });
            }
        }]);
