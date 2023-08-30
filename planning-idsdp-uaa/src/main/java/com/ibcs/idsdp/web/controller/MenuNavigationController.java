package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.domain.Navigation;
import com.ibcs.idsdp.model.domain.Navigations;
import com.ibcs.idsdp.services.NavigationService;
import com.ibcs.idsdp.services.NavigationsService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ibcs.idsdp.constants.MenuNavigationApiConstants.*;

@AllArgsConstructor
@ApiController
@RestController
public class MenuNavigationController {

    NavigationService navigationService;
    NavigationsService navigationsService;

    /**
     * For getting AllMenus
     * @return
     */
    @GetMapping(MENU_NAVIGATIONS_ENDPOINT)
    public ResponseEntity<List<Navigation>> getAllMenus(){
        return new ResponseEntity<>(navigationService.getAllNavigationList(), HttpStatus.OK);
    }

    /**
     * For getting MenuListByPageable
     * @param page
     * @param size
     * @return
     */
    @GetMapping(value = MENU_NAVIGATIONS_WITH_PAGEABLE_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public Page<Navigations> getMenuListByPageable(@RequestParam(name = "page", defaultValue = "0") int page,
                                            @RequestParam(name = "size", defaultValue = "10") int size) {
        return navigationsService.getNavigationListByPageable(page, size);
    }

    /**
     * For getting All Menus By SubNav
     * @param subNav
     * @return
     */
    @GetMapping(MENU_NAVIGATIONS_BY_SUBNAV_ENDPOINT+"/{subNav}")
    public ResponseEntity<List<Navigations>> getAllMenusBySubNav(@PathVariable("subNav") String subNav){
        //return new ResponseEntity<>(navigationService.getAllNavigationBySubNav(subNav), HttpStatus.OK);
        return new ResponseEntity<>(navigationsService.getAllNavigationBySubNav(subNav), HttpStatus.OK);
    }

    /**
     * For getting navigations ByType
     * @param subNav
     * @return
     */
    @GetMapping(MENU_NAVIGATIONS_BY_TYPE_ENDPOINT + "/{type}")
    public ResponseEntity<List<Navigations>> getByType(@PathVariable("type") String subNav){
        return new ResponseEntity<>(navigationsService.getByType(subNav), HttpStatus.OK);
    }

    /**
     * For saving All Menus
     * @param navigationsList
     * @return Navigations
     */
    @PostMapping(MENU_NAVIGATIONS_ENDPOINT)
    public ResponseEntity<String> saveAllMenus(@RequestBody List<Navigations> navigationsList){
        return  navigationsService.saveAllNavigation(navigationsList);
    }

    /**
     * For saving Menu
     * @param navigations
     * @return
     */
    @PostMapping(MENU_NAVIGATION_ENDPOINT)
    public ResponseEntity<String>saveMenu(@RequestBody Navigations navigations){
        return navigationsService.saveNavigation(navigations);
    }

    /**
     * For editing Role
     * @param id
     * @param navigations
     * @return
     */
    @PutMapping(value = MENU_NAVIGATION_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> editRole(@PathVariable(ID) int id,
                                           @RequestBody Navigations navigations) {
        return navigationsService.edit(id, navigations);
    }
}
