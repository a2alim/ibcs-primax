package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.client.dto.request.User;
import com.ibcs.idsdp.rmsConfigration.services.UserListService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping("api")
public class UserListController {


    private UserListService userListService;

    public UserListController(UserListService userListService) {
        this.userListService = userListService;
    }

    @GetMapping(path = "/user/all", produces = "application/json")
    public ResponseEntity<List<User>> findAllUser() {
        System.out.println("i am here================");
        List<User> userList = userListService.getAllUser();
        return new ResponseEntity<List<User>>(userList, HttpStatus.OK);
    }

}
