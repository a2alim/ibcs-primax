package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.domain.*;
import com.ibcs.idsdp.model.domain.Module;
import com.ibcs.idsdp.model.repositories.ApiEndpointsRepository;
import com.ibcs.idsdp.services.*;
import com.ibcs.idsdp.web.dto.response.ComponentResponse;
import com.ibcs.idsdp.web.dto.response.ModuleResponse;
import com.ibcs.idsdp.web.dto.response.PermissionResponse;
import com.ibcs.idsdp.web.dto.response.SubModuleResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;
import java.util.stream.Collectors;

import static com.ibcs.idsdp.constants.ComponentModuleConstants.*;

@ApiController
@AllArgsConstructor
public class ComponentModuleController {

    ComponentService componentService;
    ModuleService moduleService;
    SubModuleService subModuleService;
    ApiEndpointsRepository apiEndpointsRepo;
    RolePermissionService rolePermissionService;
    PermissionService permissionService;

    /**
     * For getting Components
     * @return Components
     */
    @GetMapping(value = COMPONENTS_ENDPOINT)
    public ResponseEntity<List<Component>> getComponents(){
        List<Component> componentList = componentService.getAllComponents();
        return new ResponseEntity<List<Component>>(componentList, HttpStatus.OK);
    }

    /**
     * For getting Modules
     * @return Modules
     */
    @GetMapping(value = MODULES_ENDPOINT)
    public ResponseEntity<List<Module>> getModules(){
        List<Module> moduleList = moduleService.getAllModules();
        return new ResponseEntity<List<Module>>(moduleList, HttpStatus.OK);
    }

    /**
     * For getting ModuleByComponent
     * @param componentId
     * @return
     */
    @GetMapping(value = MODULES_ENDPOINT+"/{cm_id}")
    public ResponseEntity<List<Module>> getModuleByComponent(@PathVariable("cm_id") Long componentId){
        Component component = componentService.getById(componentId);
        List<Module> moduleList = moduleService.getAllModuleByComponent(component);
        return new ResponseEntity<List<Module>>(moduleList, HttpStatus.OK);
    }

    /**
     * For getting SubModuleByModule
     * @param moduleName
     * @return
     */
    @GetMapping(value = SUBMODULES_ENDPOINT+"/{m_id}")
    public ResponseEntity<List<SubModule>> getSubModuleByModule(@PathVariable("m_id") String moduleName){
        Module module = moduleService.getByName(moduleName);
        List<SubModule> subModuleList = subModuleService.getSubModuleByModule(module);
        return new ResponseEntity<List<SubModule>>(subModuleList, HttpStatus.OK);
    }

    /**
     * @param moduleId
     */
    @GetMapping(value = SUBMODULES_ENDPOINT_BY_MODULE_ID+"/{m_id}")
    public ResponseEntity<List<SubModule>> getSubModuleByModuleId(@PathVariable("m_id") Long moduleId){
        Module module = moduleService.getById(moduleId);
        List<SubModule> subModuleList = subModuleService.getSubModuleByModule(module);
        return new ResponseEntity<List<SubModule>>(subModuleList, HttpStatus.OK);
    }

    /**
     * For getting Component Response
     * @return
     */
    @GetMapping(value = COMPONENTS_RESPONSE_ENDPOINT)
    public ResponseEntity<List<ComponentResponse>> getComponentResponse(){
        List<RolePermission> rolePermissionList = rolePermissionService.getByRoleId(1);
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


            for(int i=0;i<moduleList.size();i++){
                ModuleResponse moduleResponse = new ModuleResponse();
                BeanUtils.copyProperties(moduleList.get(i),moduleResponse);
                List<SubModule> subModuleList = subModuleService.getSubModuleByModule(moduleList.get(i));
                List<SubModuleResponse> subModuleResponseList = new ArrayList<>();

                subModuleList.forEach(subModule -> {
                    SubModuleResponse subModuleResponse = new SubModuleResponse();
                    BeanUtils.copyProperties(subModule,subModuleResponse);
                    List<ApiEndpoints> apiEndpointsResponseList = new ArrayList<>();
                    apiEndpointsResponseList.addAll(apiEndpointsRepo.findAllBySubModule(subModule));
                    Map<Permission, RolePermission> rolePermissionMap = new HashMap<Permission, RolePermission>();
                    Set<PermissionResponse> permissionSet = apiEndpointsResponseList.stream().map(apiEndpoints -> {
                      Permission permission   = apiEndpoints.getPermission();
                        PermissionResponse permissionResponse = new PermissionResponse();
                        BeanUtils.copyProperties(permission, permissionResponse);
                        Optional<RolePermission> rolePermission = rolePermissionList.stream().filter(rp -> {
                            return permission.getId() == rp.getPermissionId();
                        }).findFirst();
                        if(rolePermission.isPresent())
                            permissionResponse.setStatus(true);
                      return permissionResponse;
                    }).collect(Collectors.toSet());


                     /*apiEndpointsResponseList.forEach(apiEndpoints -> {
                        Permission permission = apiEndpoints.getPermission();
                        Optional<RolePermission> optionalRolePermission = rolePermissionList.stream().filter(rp -> rp.getPermissionId() == apiEndpoints.getPermission().getId()).findFirst();
                        if(optionalRolePermission.isPresent())
                            rolePermissionMap.put(permission,optionalRolePermission.get());
                        else
                            rolePermissionMap.put(permission,null);
                         System.out.println(rolePermissionMap.size());

                    });*/

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
        return new ResponseEntity<List<ComponentResponse>>(componentResponseList,HttpStatus.OK);
    }
}
