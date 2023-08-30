package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.client.dto.request.User;

import java.util.List;

public interface UserListService {
    List<User> getAllUser();
}
