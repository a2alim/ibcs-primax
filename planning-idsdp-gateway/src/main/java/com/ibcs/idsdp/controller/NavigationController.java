package com.ibcs.idsdp.controller;

import com.ibcs.idsdp.constants.UrlConstants;
import com.ibcs.idsdp.domain.ApiEndpoints;
import com.ibcs.idsdp.domain.Navigation;
import com.ibcs.idsdp.domain.Navigations;
import com.ibcs.idsdp.domain.Permission;
import com.ibcs.idsdp.dto.NavigationDto;
import com.ibcs.idsdp.dto.TokenDetails;
import com.ibcs.idsdp.repositories.NavigationsRepo;
import com.ibcs.idsdp.service.ApiEndpointService;
import com.ibcs.idsdp.service.NavigationService;
import com.ibcs.idsdp.service.PermissionService;
import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.EurekaClient;
import com.netflix.discovery.shared.Application;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static com.ibcs.idsdp.constants.UrlConstants.ACTION_URL;
import static com.ibcs.idsdp.constants.UrlConstants.NAVIGATION_URL;

@AllArgsConstructor
@RequestMapping("/gateway")
@RestController
public class NavigationController {

    PermissionService permissionService;
    NavigationService navigationService;
    ApiEndpointService apiEndpointService;
    private EurekaClient eurekaClient;
    RestTemplate restTemplate;
    NavigationsRepo navigationsRepo;

    @GetMapping(NAVIGATION_URL)
    public List<NavigationDto> getAllNavigation(@RequestHeader(value="token") String token, @RequestParam("service_name") String service_name){
        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
        map.add("token",token);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);
        Application application = eurekaClient.getApplication("planning-idsdp-uaa");
        InstanceInfo instanceInfo = application.getInstances().get(0);
        TokenDetails tokenDetails = restTemplate.postForObject("http://"+instanceInfo.getIPAddr()+":"+instanceInfo.getPort()+UrlConstants.CHECK_TOKEN,request, TokenDetails.class);
        //TokenDetails tokenDetails = restTemplate.postForObject(UrlConstants.CHECK_TOKEN,request, TokenDetails.class);
        System.out.println(tokenDetails);
        List<Permission> permissionList = new ArrayList<Permission>();
        if(tokenDetails.getAuthorities()!=null){
            for(String authority : tokenDetails.getAuthorities()){
                String auth = authority.replaceFirst("ROLE_", "");
                Permission permission =  permissionService.getByPermissionName(auth);
                permissionList.add(permission);

            }
        }


        String serviceName = service_name.replaceFirst("serviceName", "");
        List<ApiEndpoints> apiEndpointList = new ArrayList<ApiEndpoints>();
        /*apiEndpointList =  permissionList.stream()
                .map(permission -> {
            return apiEndpointsRepo.findByPermissionAndMethodType(permission,"GET");
        }).filter().collect(Collectors.toList());*/

            permissionList.forEach(permission -> {
                apiEndpointList.addAll(apiEndpointService.getByPermissionAndMethodType(permission,"GET").stream().filter(Objects::nonNull).collect(Collectors.toList())) ;
            });

            List<Navigation> navigationList = new ArrayList<>();
        List<Navigation> tempNavigationList = new ArrayList<>();
        //apiEndpointList.forEach(apiEndpoints -> tempNavigationList.addAll(apiEndpoints.getNavigations().stream().filter(navigation -> navigation.getMenuNavId().equals(serviceName) || navigation.getNavId().equals(serviceName)).collect(Collectors.toList())));
//        List<Navigation> navigationList = apiEndpointList.stream().map(apiEndpoints -> {
//            return apiEndpoints.getNavigations();
//        }).filter(Objects::nonNull).filter(navigation -> navigation.getMenuNavId().equals(serviceName) || navigation.getNavId().equals(serviceName)).collect(Collectors.toList());
        navigationList = tempNavigationList.stream().filter(navigation -> navigation.getMenuNavId().equals(serviceName) || navigation.getNavId().equals(serviceName)).collect(Collectors.toList());


        Navigation mainNavigation =  new Navigation();
        List<NavigationDto> navigationDtoList = new ArrayList<NavigationDto>();
        List<NavigationDto> subNavigationDtoList = new ArrayList<NavigationDto>();
        NavigationDto mainNavigationDto = new NavigationDto();
        Set<String> subMenuSet = new HashSet<String>();
        mainNavigation = navigationService.findByNavId(serviceName);
        for(Navigation navigation : navigationList){

            NavigationDto navigationDto = new NavigationDto();
            BeanUtils.copyProperties(navigation, navigationDto);
            navigationDto.setId(navigation.getNavId());

            if(!subMenuSet.contains(navigation.getSubMenuNavId())){
                subMenuSet.add(navigation.getSubMenuNavId());
                Navigation subMenu = navigationService.findByNavId(navigation.getSubMenuNavId());
                NavigationDto subNavigationDto = new NavigationDto();
                BeanUtils.copyProperties(subMenu, subNavigationDto);
                subNavigationDto.setId(subMenu.getNavId());

                List<NavigationDto> featuresNavDto = new ArrayList<NavigationDto>();
                featuresNavDto.add(navigationDto);
                subNavigationDto.setChildren(featuresNavDto);
                subNavigationDtoList.add(subNavigationDto);
            }
            else{
                Optional<NavigationDto> optionalNavigationDto =  subNavigationDtoList.stream().filter(subnavigationDto -> {
                    return subnavigationDto.getId().equals(navigation.getSubMenuNavId());
                }).findFirst();
                if(optionalNavigationDto.isPresent()){
                    List<NavigationDto> featuresNavDto = optionalNavigationDto.get().getChildren();
                    featuresNavDto.add(navigationDto);
                    optionalNavigationDto.get().setChildren(featuresNavDto);
                }

            }



        }

        BeanUtils.copyProperties(mainNavigation, mainNavigationDto);
        mainNavigationDto.setId(mainNavigation.getNavId());
        mainNavigationDto.setChildren(subNavigationDtoList);
        navigationDtoList.add(mainNavigationDto);

        //List<Navigation> subMenuList =  navigationList.stream().map(navigation -> {return navigationRepo.findBySubMenuNavId(navigation.getSubMenuNavId()) ;}).collect(Collectors.toList());



        return navigationDtoList;
    }

    @GetMapping(ACTION_URL)
    public List<String> getAllActions(@RequestHeader(value="token") String token, @RequestParam("service_name") String service_name){
        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
        map.add("token",token);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);
        TokenDetails tokenDetails =  getToken(token);
        List<Permission> permissionList = new ArrayList<Permission>();
        List<ApiEndpoints> apiEndpointList = new ArrayList<ApiEndpoints>();
        if(tokenDetails.getAuthorities()!=null){
            for(String authority : tokenDetails.getAuthorities()){
                String auth = authority.replaceFirst("ROLE_", "");
                Permission permission =  permissionService.getByPermissionName(auth);
                permissionList.add(permission);

            }
        }

        String serviceName = service_name.replaceFirst("serviceName", "");

        permissionList.forEach(permission -> {
            //apiEndpointList.addAll(apiEndpointService.getByPermission(permission).stream().filter(Objects::nonNull).collect(Collectors.toList()));
            apiEndpointList.addAll(apiEndpointService.getByPermission(permission).stream().filter(Objects::nonNull).filter(apiEndpoints -> apiEndpoints.getSubModule().getModule().getComponent().getName().equals(serviceName)).collect(Collectors.toList()));
        });
        List<Navigations> navigationList = new ArrayList<>();
        List<Navigation> tempNavigationList = new ArrayList<>();
        apiEndpointList.forEach( apiEndpoints -> { navigationList.addAll(apiEndpoints.getNavigations().stream().filter(navigations -> navigations.getType().equals("action")).filter(Objects::nonNull).collect(Collectors.toList())); });

        /*List<Navigation> navigationList = apiEndpointList.stream().map(apiEndpoints -> {
            return apiEndpoints.getNavigation();
        }).filter(Objects::nonNull).filter(navigation -> navigation.getMenuNavId().equals(serviceName) && navigation.getType().equals("action")).collect(Collectors.toList());
*/
       List<String> actionList =  navigationList.stream().map(navigations -> {return navigations.getTitle();}).collect(Collectors.toList());
       return actionList;

    }

    @GetMapping("/nav")
    public ResponseEntity<Navigations> getAllNav(@RequestHeader(value="token") String token, @RequestParam("service_name") String serviceName){
        TokenDetails tokenDetails = getToken(token);
        List<Permission> permissionList = new ArrayList<Permission>();
        if(tokenDetails.getAuthorities()!=null){
            for(String authority : tokenDetails.getAuthorities()){
                String auth = authority.replaceFirst("ROLE_", "");
                Permission permission =  permissionService.getByPermissionName(auth);
                permissionList.add(permission);

            }
        }
        Navigations navigation =  navigationsRepo.findByTitle(serviceName);
        List<Navigations> subNavigationList = navigationsRepo.findAllByParent(navigation);
        List<Navigations> subNavigationsListLink = new ArrayList<>();
        for(Navigations subNavigation: subNavigationList){
            List<Navigations> navigationsList = navigationsRepo.findAllByParent(subNavigation);
            List<Navigations> navigationsListLink = new ArrayList<>();
            permissionList.forEach(permission -> {

                List<ApiEndpoints> apiEndpointList =  apiEndpointService.getByPermission(permission);
                for(ApiEndpoints apiEndpoints : apiEndpointList){
                    for(Navigations nav:navigationsList) {

                        //System.out.println(String.valueOf(nav.getTitle()) + String.valueOf(nav.getApiEndpoints().getId()) + "===" + String.valueOf(apiEndpoints.getId()));



                        if(nav.getApiEndpoints()!=null){
                            if(nav.getApiEndpoints().getId().longValue() == apiEndpoints.getId().longValue()){
                                navigationsListLink.add(nav);
                            }

                        }

                    }
                }

            });
            if(!navigationsListLink.isEmpty()){
                navigationsListLink.sort(Comparator.comparing(Navigations::getOrders));
                subNavigation.setChildren(navigationsListLink);
                subNavigationsListLink.add(subNavigation);
            }

        }
        if(!subNavigationsListLink.isEmpty()){
            subNavigationsListLink.sort(Comparator.comparing(Navigations::getOrders));
            navigation.setChildren(subNavigationsListLink);
        }
        else
            navigation = new Navigations();

       return new ResponseEntity<Navigations>(navigation, HttpStatus.OK);
    }

    @GetMapping("/route-permission")
    public ResponseEntity<?> getRoutePermission(@RequestHeader(value="token") String token, @RequestParam("route_name") String routeName){
        Boolean exist = false;
        TokenDetails tokenDetails = getToken(token);
        List<Permission> permissionList = new ArrayList<Permission>();
        if(tokenDetails.getAuthorities()!=null){
            for(String authority : tokenDetails.getAuthorities()){
                String auth = authority.replaceFirst("ROLE_", "");
                Permission permission =  permissionService.getByPermissionName(auth);
                permissionList.add(permission);

            }
        }
        Navigations navigations = navigationsRepo.findByLink(routeName);
        ApiEndpoints apiEndpoints =  navigations.getApiEndpoints();
        exist = permissionList.stream().filter(permission -> {
            return permission.getId() == apiEndpoints.getPermission().getId();
        }).findAny().isPresent();

        return new ResponseEntity<Boolean>(exist, HttpStatus.OK);
    }

    @GetMapping("/nav-bn")
    public ResponseEntity<NavigationDto> getAllBengaliNav(@RequestHeader(value="token") String token, @RequestParam("service_name") String serviceName){
        TokenDetails tokenDetails = getToken(token);
        List<Permission> permissionList = new ArrayList<Permission>();
        if(tokenDetails.getAuthorities()!=null){
            for(String authority : tokenDetails.getAuthorities()){
                String auth = authority.replaceFirst("ROLE_", "");
                Permission permission =  permissionService.getByPermissionName(auth);
                permissionList.add(permission);

            }
        }
        NavigationDto navigationDto = new NavigationDto();
        Navigations navigation =  navigationsRepo.findByTitle(serviceName);
        List<Navigations> subNavigationList = navigationsRepo.findAllByParent(navigation);
        BeanUtils.copyProperties(navigation,navigationDto);
        navigationDto.setTitle(navigation.getTitleBn());
        List<NavigationDto> subNavigationsListLink = new ArrayList<>();
        for(Navigations subNavigation: subNavigationList){
            List<Navigations> navigationsList = navigationsRepo.findAllByParent(subNavigation);
            List<NavigationDto> navigationsListLink = new ArrayList<>();
            permissionList.forEach(permission -> {

                List<ApiEndpoints> apiEndpointList =  apiEndpointService.getByPermission(permission);
                for(ApiEndpoints apiEndpoints : apiEndpointList){
                    for(Navigations nav:navigationsList) {

                        //System.out.println(String.valueOf(nav.getTitle()) + String.valueOf(nav.getApiEndpoints().getId()) + "===" + String.valueOf(apiEndpoints.getId()));



                        if(nav.getApiEndpoints()!=null){
                            if(nav.getApiEndpoints().getId().longValue() == apiEndpoints.getId().longValue()){
                                NavigationDto navDto = new NavigationDto();
                                BeanUtils.copyProperties(nav,navDto);
                                navDto.setTitle(nav.getTitleBn());
                                navigationsListLink.add(navDto);
                            }

                        }

                    }
                }

            });
            if(!navigationsListLink.isEmpty()){
                navigationsListLink.sort(Comparator.comparing(NavigationDto::getOrders));
                //subNavigation.setChildren(navigationsListLink);
                NavigationDto subNavigationDto = new NavigationDto();
                BeanUtils.copyProperties(subNavigation, subNavigationDto);
                subNavigationDto.setChildren(navigationsListLink);
                subNavigationDto.setTitle(subNavigation.getTitleBn());
                subNavigationsListLink.add(subNavigationDto);
            }

        }
        if(!subNavigationsListLink.isEmpty()){
            subNavigationsListLink.sort(Comparator.comparing(NavigationDto::getOrders));
            navigationDto.setChildren(subNavigationsListLink);
        }
        else
            navigation = new Navigations();

        return new ResponseEntity<NavigationDto>(navigationDto, HttpStatus.OK);
    }

    TokenDetails getToken(String token){
        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
        map.add("token",token);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);
        Application application = eurekaClient.getApplication("planning-idsdp-uaa");
        InstanceInfo instanceInfo = application.getInstances().get(0);
        TokenDetails tokenDetails = restTemplate.postForObject("http://"+instanceInfo.getIPAddr()+":"+instanceInfo.getPort()+UrlConstants.CHECK_TOKEN,request, TokenDetails.class);
        return tokenDetails;
    }

}
