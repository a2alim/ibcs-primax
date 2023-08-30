package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.rmsConfigration.client.UaaClientService;
import com.ibcs.idsdp.rmsConfigration.client.dto.request.User;
import com.ibcs.idsdp.rmsConfigration.services.UserListService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserListServiceImpl implements UserListService {

    private UaaClientService uaaClientService;

    public UserListServiceImpl(UaaClientService uaaClientService) {
        this.uaaClientService = uaaClientService;
    }

    @Override
    public List<User> getAllUser() {
        List<User> ulist = uaaClientService.getAllUsers();
        List<User> ActiveList = ulist.stream().parallel().filter(f -> f.getIsActive() == true).collect(Collectors.toList());
        return ActiveList;
    }
}
