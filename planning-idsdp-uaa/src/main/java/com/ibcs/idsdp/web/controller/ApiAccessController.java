package com.ibcs.idsdp.web.controller;


import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.ApiAccessConstants;
import com.ibcs.idsdp.constants.ApiConstants;
import com.ibcs.idsdp.exceptions.RoleNotFoundException;
import com.ibcs.idsdp.model.domain.Module;
import com.ibcs.idsdp.model.domain.*;
import com.ibcs.idsdp.model.repositories.ApiEndpointsRepository;
import com.ibcs.idsdp.services.*;
import com.ibcs.idsdp.web.dto.request.ApiPermissionRequest;
import com.ibcs.idsdp.web.dto.request.ApiSetupRequest;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import com.ibcs.idsdp.web.dto.response.ComponentResponse;
import com.ibcs.idsdp.web.dto.response.ModuleResponse;
import com.ibcs.idsdp.web.dto.response.PermissionResponse;
import com.ibcs.idsdp.web.dto.response.SubModuleResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static com.ibcs.idsdp.constants.ApiConstants.*;
import static com.ibcs.idsdp.constants.RoleApiConstants.APPLY_FILTER;

@AllArgsConstructor
@ApiController
public class ApiAccessController {

    ApiEndpointsRepository apiEndpointsRepo;
    PermissionService permissionService;
    RolePermissionService rolePermissionService;
    ComponentService componentService;
    ModuleService moduleService;
    SubModuleService subModuleService;
    UserRolePermissionService userRolePermissionService;

    /**
     * For saving ApiPermissionAccess
     * @param apiSetupRequest
     * @return
     */
//    @PostMapping("/api/api-endpoint")
    @PostMapping(ApiAccessConstants.API_ACCESS_ENDPOINT)
    public ResponseEntity<String> saveApiPermissionAccess(@RequestBody ApiSetupRequest apiSetupRequest) {

        ApiEndpoints apiEndpoints = new ApiEndpoints();
        BeanUtils.copyProperties(apiSetupRequest, apiEndpoints);
        apiEndpoints.setMethodType(apiSetupRequest.getMethodType());
        apiEndpoints.setEndpointUrl(new Urls(apiSetupRequest.getEndpointUrl().get("id")));
        Permission permission = new Permission();
        permission.setId(apiSetupRequest.getPermission().get("id"));
        apiEndpoints.setPermission(permission);
        apiEndpoints.setSubModule(new SubModule(apiSetupRequest.getSubModule().get("id")));
        apiEndpoints.setIsDelete(false);
        apiEndpointsRepo.save(apiEndpoints);
        return new ResponseEntity("200", HttpStatus.OK);
    }

    /**
     * For editing ApiPermissionAccess
     * @param id
     * @param apiSetupRequest
     * @return
     */
//    @PutMapping("/api/api-endpoint/{id}")
    @PutMapping(ApiAccessConstants.API_ACCESS_ENDPOINT + ApiConstants.ID_PATH_VAR)
    public ResponseEntity<String> editApiPermissionAccess(@PathVariable(ID) long id, @RequestBody ApiSetupRequest apiSetupRequest) {

        ApiEndpoints apiEndpoints = new ApiEndpoints();
        apiEndpoints.setId(id);
        BeanUtils.copyProperties(apiSetupRequest, apiEndpoints);
        apiEndpoints.setMethodType(apiSetupRequest.getMethodType());
        apiEndpoints.setEndpointUrl(new Urls(apiSetupRequest.getEndpointUrl().get("id")));
        Permission permission = new Permission();
        permission.setId(apiSetupRequest.getPermission().get("id"));
        apiEndpoints.setPermission(permission);
        apiEndpoints.setSubModule(new SubModule(apiSetupRequest.getSubModule().get("id")));
        apiEndpoints.setIsDelete(false);
        apiEndpointsRepo.save(apiEndpoints);
        return new ResponseEntity("200", HttpStatus.OK);
    }

    /**
     * For Deleting api endpoint (softDelete)
     * @param id
     * @return
     */
//    @DeleteMapping("/api/api-endpoint/{id}")
    @DeleteMapping(ApiAccessConstants.API_ACCESS_ENDPOINT + ApiConstants.ID_PATH_VAR)
    public ResponseEntity<String> softDelete(@PathVariable(ID) Long id) {
        Optional<ApiEndpoints> optionalRole = apiEndpointsRepo.findByIdAndIsDelete(id, false);

        if (!optionalRole.isPresent()) {
            throw new RoleNotFoundException("API Not Found");
        }
        ApiEndpoints api = optionalRole.get();
        api.setIsDelete(true);

        apiEndpointsRepo.save(api);

        return new ResponseEntity("200", HttpStatus.OK);
    }

    /**
     * For getting ApiListByPageable
     * @param page
     * @param size
     * @return
     */
//    @GetMapping("/api/apiPageable")
    @GetMapping(ApiAccessConstants.API_ACCESS_PAGEABLE_ENDPOINT)
    public Page<ApiEndpoints> getApiListByPageable(@RequestParam(name = "page", defaultValue = "0") int page,
                                            @RequestParam(name = "size", defaultValue = "5") int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ApiEndpoints> pageResult = apiEndpointsRepo.findAllByIsDelete(false, pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    /**
     * For applying Filter
     * @param request
     * @return
     */
    @PostMapping(value = ApiAccessConstants.APPLY_FILTER)
    public ResponseEntity<Page<ApiEndpoints>> applyFilter(@RequestBody SearchWithPageableRequest request) {
        return new ResponseEntity(apiEndpointsRepo.findAllByValue(request.getValue().toLowerCase(), PageRequest.of(request.getPage(), request.getSize())), HttpStatus.OK);
    }

    /**
     * For Getting api endpoints
     * @return ApiEndpoints List
     */
//    @GetMapping("/api/api-endpoints")
    @GetMapping(ApiAccessConstants.API_ACCESS_ENDPOINTS)
    public ResponseEntity<List<ApiEndpoints>> getAllApiEndpoints() {
        System.out.println("get");
        List<ApiEndpoints> apiEndpointsList = apiEndpointsRepo.findAll();
        return new ResponseEntity<List<ApiEndpoints>>(apiEndpointsList, HttpStatus.OK);
    }

    /**
     * For getting ApiEndpoint
     * @param id
     * @return
     */
    @GetMapping(ApiAccessConstants.API_ACCESS_ENDPOINT + ApiConstants.ID_PATH_VAR)
    public ResponseEntity<ApiEndpoints> getApiEndpoint(@PathVariable("id") Long id) {
        ApiEndpoints apiEndpoints = apiEndpointsRepo.findById(id).get();
        return new ResponseEntity<ApiEndpoints>(apiEndpoints, HttpStatus.OK);
    }

    /*@GetMapping("/api/api-access-byrole/{role_id}/{moduleList}")
    public ResponseEntity<List<ApiAccessResponse>> getAllApiAccessByRole(@PathVariable("role_id") int roleId,@PathVariable("moduleList") String[] moduleIds){
        List<RolePermission> rolePermissionList = rolePermissionService.getByRoleId(roleId);
        List<ApiEndpoints> apiEndpointsList = new ArrayList<>();
        List<Module> moduleList = new ArrayList<>();
        List<ApiAccessResponse> apiAccessResponseList = new ArrayList<>();

        rolePermissionList.stream().map(rolePermission -> {
            return permissionService.getPermission(rolePermission.getPermissionId());
        }).collect(Collectors.toList()).stream().forEach(permission -> {
            apiEndpointsList.addAll(apiEndpointsRepo.findAllByPermission(permission));
        });



        apiEndpointsList.stream().forEach(apiEndpoints -> {
            ApiAccessResponse apiAccessResponse = new ApiAccessResponse();
            apiAccessResponse.setApiEndpoints(apiEndpoints);
            apiAccessResponse.setModule(apiEndpoints.getSubModule().getModule());
            apiAccessResponseList.add(apiAccessResponse);

        });

        return new ResponseEntity<List<ApiAccessResponse>>(apiAccessResponseList,HttpStatus.OK);
    }*/

    /**
     * For Getting api access byrole
     * @param id
     * @return
     */
//    @GetMapping("/api/api-access-byrole/{role_id}")
    @GetMapping(ApiAccessConstants.API_BY_ROLE + "/{role_id}")
    public ResponseEntity<List<ComponentResponse>> getAllEndpointsByModule(@PathVariable("role_id") int id) {

        List<RolePermission> rolePermissionList = rolePermissionService.findAllByRoleIdAndActive(id, true);
        List<ApiEndpoints> apiEndpointsList = new ArrayList<>();

        rolePermissionList.stream().map(rolePermission -> {
            return permissionService.getPermission(rolePermission.getPermissionId());
        }).collect(Collectors.toList()).stream().forEach(permission -> {
            apiEndpointsList.addAll(apiEndpointsRepo.findAllByPermission(permission));
        });


        List<Component> componentList = componentService.getAllComponents();
        List<ComponentResponse> componentResponseList = new ArrayList<>();
        componentList.stream().forEach(component -> {
            ComponentResponse componentResponse = new ComponentResponse();
            componentResponse.setComponent(component);
            List<Module> moduleList = moduleService.getAllModuleByComponent(component);
            List<ModuleResponse> moduleResponseList = new ArrayList<>();


            for (int i = 0; i < moduleList.size(); i++) {
                ModuleResponse moduleResponse = new ModuleResponse();
                BeanUtils.copyProperties(moduleList.get(i), moduleResponse);
                List<SubModule> subModuleList = subModuleService.getSubModuleByModule(moduleList.get(i));
                List<SubModuleResponse> subModuleResponseList = new ArrayList<>();

                subModuleList.forEach(subModule -> {
                    SubModuleResponse subModuleResponse = new SubModuleResponse();
                    BeanUtils.copyProperties(subModule, subModuleResponse);
                    List<ApiEndpoints> apiEndpointsResponseList = new ArrayList<>();
                    apiEndpointsResponseList.addAll(apiEndpointsRepo.findAllBySubModule(subModule));
                    Map<Permission, RolePermission> rolePermissionMap = new HashMap<Permission, RolePermission>();
                    Set<PermissionResponse> permissionSet = apiEndpointsResponseList.stream().map(apiEndpoints -> {
                        Permission permission = apiEndpoints.getPermission();
                        PermissionResponse permissionResponse = new PermissionResponse();
                        BeanUtils.copyProperties(permission, permissionResponse);
                        Optional<RolePermission> rolePermission = rolePermissionList.stream().filter(rp -> {
                            return permission.getId() == rp.getPermissionId();
                        }).findFirst();
                        if (rolePermission.isPresent())
                            permissionResponse.setStatus(true);
                        return permissionResponse;
                    }).collect(Collectors.toSet());


                    //subModuleResponse.setPermissionRoleMap(rolePermissionMap);

                    subModuleResponse.setPermissionList(permissionSet);
                    subModuleResponseList.add(subModuleResponse);

                });
                moduleResponse.setSubModuleList(subModuleResponseList);
                componentResponse.setModuleList(moduleResponseList);
                moduleResponseList.add(moduleResponse);
            }
            componentResponseList.add(componentResponse);
        });
        return new ResponseEntity<List<ComponentResponse>>(componentResponseList, HttpStatus.OK);
    }

    /**
     * For Getting  api access byuser byrole
     * @param userId
     * @param roleId
     * @return
     */
//    @GetMapping("/api/api-access-byuser-byrole/{user_id}/{role_id}")
    @GetMapping(ApiAccessConstants.API_BY_USER_BY_ROLE + "/{user_id}/{role_id}")
    public ResponseEntity<List<ComponentResponse>> getAllEndpointsByModuleAndUser(@PathVariable("user_id") int userId, @PathVariable("role_id") int roleId) {
        List<RolePermission> rolePermissionList = rolePermissionService.findAllByRoleIdAndActive(roleId, true);
        List<UserRolePermission> userRolePermissionList = userRolePermissionService.getUserRolePermissionByUserAndRole(userId, roleId);
        List<ApiEndpoints> apiEndpointsList = new ArrayList<>();

        rolePermissionList.stream().map(rolePermission -> {
            return permissionService.getPermission(rolePermission.getPermissionId());
        }).collect(Collectors.toList()).stream().forEach(permission -> {
            apiEndpointsList.addAll(apiEndpointsRepo.findAllByPermission(permission));
        });


        List<Component> componentList = componentService.getAllComponents();
        List<ComponentResponse> componentResponseList = new ArrayList<>();
        componentList.stream().forEach(component -> {
            ComponentResponse componentResponse = new ComponentResponse();
            componentResponse.setComponent(component);
            List<Module> moduleList = moduleService.getAllModuleByComponent(component);
            List<ModuleResponse> moduleResponseList = new ArrayList<>();


            for (int i = 0; i < moduleList.size(); i++) {
                ModuleResponse moduleResponse = new ModuleResponse();
                BeanUtils.copyProperties(moduleList.get(i), moduleResponse);
                List<SubModule> subModuleList = subModuleService.getSubModuleByModule(moduleList.get(i));
                List<SubModuleResponse> subModuleResponseList = new ArrayList<>();

                subModuleList.forEach(subModule -> {
                    SubModuleResponse subModuleResponse = new SubModuleResponse();
                    BeanUtils.copyProperties(subModule, subModuleResponse);
                    List<ApiEndpoints> apiEndpointsResponseList = new ArrayList<>();
                    apiEndpointsResponseList.addAll(apiEndpointsRepo.findAllBySubModule(subModule));
                    Map<Permission, RolePermission> rolePermissionMap = new HashMap<Permission, RolePermission>();
                    Set<PermissionResponse> permissionSet = apiEndpointsResponseList.stream().map(apiEndpoints -> {
                        Permission permission = apiEndpoints.getPermission();
                        PermissionResponse permissionResponse = new PermissionResponse();
                        BeanUtils.copyProperties(permission, permissionResponse);
                        Optional<RolePermission> rolePermission = rolePermissionList.stream().filter(rp -> {
                            return permission.getId() == rp.getPermissionId();
                        }).findFirst();
                        if (rolePermission.isPresent())
                            permissionResponse.setStatus(true);
                        Optional<UserRolePermission> userRolePermission = userRolePermissionList.stream().filter(urp -> {
                            return permission.getId() == urp.getPermissionId();
                        }).findFirst();
                        if (userRolePermission.isPresent())
                            permissionResponse.setStatus(true);
                        return permissionResponse;
                    }).collect(Collectors.toSet());


                    //subModuleResponse.setPermissionRoleMap(rolePermissionMap);

                    subModuleResponse.setPermissionList(permissionSet);
                    subModuleResponseList.add(subModuleResponse);

                });
                moduleResponse.setSubModuleList(subModuleResponseList);
                componentResponse.setModuleList(moduleResponseList);
                moduleResponseList.add(moduleResponse);
            }
            componentResponseList.add(componentResponse);
        });
        return new ResponseEntity<List<ComponentResponse>>(componentResponseList, HttpStatus.OK);
    }

    /**
     * For saving RolePermission
     * @param apiPermissionRequest
     * @return
     */
//    @PostMapping("/api/api-access-byrole")
    @PostMapping(ApiAccessConstants.API_BY_ROLE)
    public ResponseEntity<HttpStatus> saveRolePermission(@RequestBody ApiPermissionRequest apiPermissionRequest) {
        List<RolePermission> rolePermissionList = new ArrayList<RolePermission>();
        List<RolePermission> rolePermissionDeleteList = new ArrayList<RolePermission>();
        List<ComponentResponse> componentResponseList = apiPermissionRequest.getComponentResponse();
        componentResponseList.forEach(componentResponse -> {
            if (componentResponse.getModuleList() != null && componentResponse.getModuleList().size() > 0) {
                componentResponse.getModuleList().forEach(moduleResponse -> {
                    if (moduleResponse.getSubModuleList() != null && moduleResponse.getSubModuleList().size() > 0) {
                        moduleResponse.getSubModuleList().forEach(subModuleResponse -> {
                            if (subModuleResponse.getPermissionList() != null && subModuleResponse.getPermissionList().size() > 0) {
                                subModuleResponse.getPermissionList().forEach(permissionResponse -> {
                                    if (permissionResponse.isStatus()) {
                                        RolePermission rolePermission = rolePermissionService.findByRoleAndPermissionId(apiPermissionRequest.getRoleId(), permissionResponse.getId());
                                        if (rolePermission != null)
                                            rolePermission.setActive(true);
                                        else {
                                            rolePermission = new RolePermission();
                                            rolePermission.setRoleId(apiPermissionRequest.getRoleId());
                                            rolePermission.setPermissionId(permissionResponse.getId());
                                            rolePermission.setActive(true);
                                        }
                                        rolePermissionList.add(rolePermission);
                                    } else {
                                        RolePermission rolePermission = rolePermissionService.findByRoleAndPermissionId(apiPermissionRequest.getRoleId(), permissionResponse.getId());
                                        if (rolePermission != null) {
                                            rolePermission.setActive(false);
                                            rolePermissionDeleteList.add(rolePermission);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });
        rolePermissionService.saveAll(rolePermissionList);
        rolePermissionService.safeDeleteAll(rolePermissionDeleteList);
        return new ResponseEntity<HttpStatus>(HttpStatus.CREATED);
    }

    /**
     * For saving CustomizeRolePermission
     * @param apiPermissionRequest
     * @return
     */
//    @PostMapping("/api/api-access-byuser-byrole")
    @PostMapping(ApiAccessConstants.API_BY_USER_BY_ROLE)
    public ResponseEntity<HttpStatus> saveCustomizeRolePermission(@RequestBody ApiPermissionRequest apiPermissionRequest) {
        List<UserRolePermission> userRolePermissionList = new ArrayList<UserRolePermission>();
        List<UserRolePermission> userRolePermissionDeleteList = new ArrayList<UserRolePermission>();
        List<ComponentResponse> componentResponseList = apiPermissionRequest.getComponentResponse();
        componentResponseList.forEach(componentResponse -> {
            if (componentResponse.getModuleList() != null && componentResponse.getModuleList().size() > 0) {
                componentResponse.getModuleList().forEach(moduleResponse -> {
                    if (moduleResponse.getSubModuleList() != null && moduleResponse.getSubModuleList().size() > 0) {
                        moduleResponse.getSubModuleList().forEach(subModuleResponse -> {
                            if (subModuleResponse.getPermissionList() != null && subModuleResponse.getPermissionList().size() > 0) {
                                subModuleResponse.getPermissionList().forEach(permissionResponse -> {
                                    if (permissionResponse.isStatus()) {
                                        UserRolePermission userRolePermission = userRolePermissionService.getUserRolePermissionByUserAndRoleAndPermission(apiPermissionRequest.getUserId(), apiPermissionRequest.getRoleId(), permissionResponse.getId());
                                        if (userRolePermission != null)
                                            userRolePermission.setActive(true);
                                        else {
                                            if (!userRolePermissionService.existRolePermission(apiPermissionRequest.getRoleId(), permissionResponse.getId())) {
                                                userRolePermission = new UserRolePermission();
                                                userRolePermission.setPermissionId(permissionResponse.getId());
                                                userRolePermission.setRoleId(apiPermissionRequest.getRoleId());
                                                userRolePermission.setUserId(apiPermissionRequest.getUserId());
                                                userRolePermission.setActive(true);
                                                userRolePermission.setEnable(true);
                                            }
                                        }
                                        if (userRolePermission != null)
                                            userRolePermissionList.add(userRolePermission);
                                    } else {
                                        UserRolePermission userRolePermission = userRolePermissionService.getUserRolePermissionByUserAndRoleAndPermission(apiPermissionRequest.getUserId(), apiPermissionRequest.getRoleId(), permissionResponse.getId());
                                        if (userRolePermission != null) {
                                            userRolePermission.setActive(false);
                                            userRolePermissionDeleteList.add(userRolePermission);
                                        }
                            /*else{
                                userRolePermission = new UserRolePermission();
                                userRolePermission.setPermissionId(permissionResponse.getId());
                                userRolePermission.setRoleId(apiPermissionRequest.getRoleId());
                                userRolePermission.setActive(false);
                                userRolePermissionDeleteList.add(userRolePermission);
                            }*/


                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        userRolePermissionService.saveAll(userRolePermissionList);
        userRolePermissionService.safeDeleteAll(userRolePermissionDeleteList);
        return new ResponseEntity<HttpStatus>(HttpStatus.CREATED);
    }

    /**
     * get AllApis By SubModule
     * @param subModuleId
     * @return
     */
//    @GetMapping("/api/api-endpoint-bySubModule/{sm_id}")
    @GetMapping(ApiAccessConstants.API_ENDPOINT_BY_SUBMODULE + "/{sm_id}")
    public ResponseEntity<List<ApiEndpoints>> getAllApisBySubModule(@PathVariable("sm_id") Long subModuleId) {
        SubModule subModule = subModuleService.getSubModule(subModuleId);
        List<ApiEndpoints> apiEndpointsList = apiEndpointsRepo.findAllBySubModule(subModule);
        return new ResponseEntity<List<ApiEndpoints>>(apiEndpointsList, HttpStatus.OK);
    }

    /**
     * api endpoint by permission
     * @param permissionId
     * @param subModuleId
     * @return
     */
//    @GetMapping("/api/api-endpoint-bypermission/{p_id}/{sm_id}")
    @GetMapping(ApiAccessConstants.API_ENDPOINT_BY_PERMISSION + "/{p_id}/{sm_id}")
    public ResponseEntity<List<ApiEndpoints>> getAllApisByPermission(@PathVariable("p_id") int permissionId, @PathVariable("sm_id") Long subModuleId) {
        Permission permission = permissionService.getPermission(permissionId);
        SubModule subModule = subModuleService.getSubModule(subModuleId);
        List<ApiEndpoints> apiEndpointsList = apiEndpointsRepo.findAllByPermissionAndSubModule(permission, subModule);
        return new ResponseEntity<List<ApiEndpoints>>(apiEndpointsList, HttpStatus.OK);
    }

}
