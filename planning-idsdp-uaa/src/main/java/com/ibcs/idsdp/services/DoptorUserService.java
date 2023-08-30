package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.UserNotFoundException;
import com.ibcs.idsdp.model.domain.DoptorUser;
import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.model.repositories.DoptorUserRepository;
import com.ibcs.idsdp.model.repositories.UserRepository;
import com.ibcs.idsdp.utils.Utils;
import com.ibcs.idsdp.web.dto.request.DoptorUserRequest;
import com.ibcs.idsdp.web.dto.request.PageableRequestBodyDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class DoptorUserService {

    private final DoptorUserRepository doptorUserRepository;
    private UserRepository userRepository;

    public Page<DoptorUser> getAllDoptorUser(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = Utils.getPageable(requestBodyDTO);
        Page<DoptorUser> ePage = doptorUserRepository.findAll(pageable);
        return new PageImpl<>(ePage.getContent(), pageable, ePage.getTotalElements());
    }

    public void changeStatus(Long id, DoptorUserRequest doptorUserRequest) {
        Optional<DoptorUser> doptorUserOptional = doptorUserRepository.findById(id);
        if (doptorUserOptional.isPresent()) {
            DoptorUser doptorUser = doptorUserOptional.get();
            doptorUser.setIsActive(doptorUserRequest.getIsActive());
            doptorUserRepository.save(doptorUser);
            addDoptorUser(doptorUser);
        } else {
            throw new UserNotFoundException("Doptor User not fount");
        }
    }

    private void addDoptorUser(DoptorUser doptorUser) {
        User existUser = userRepository.findByUserId(doptorUser.getUserId());
        if (existUser != null) {
            existUser.setIsDelete(!doptorUser.getIsActive());
            existUser.setIsActive(doptorUser.getIsActive());
            userRepository.save(existUser);
        } else if (doptorUser.getIsActive()) {
            User user = new User();
            user.setUserId(doptorUser.getUserId());
            user.setPassword("$2a$10$FZDlienJ4szXQB2v.7ZXN.iCG/SgIxgOq64MLQiFP.oFbAzfApQ4a");
            user.setDesignation("Maintenance Engineer");
            user.setUserType("DOPTOR");
            user.setIsActive(true);
            user.setIsDelete(false);
            userRepository.save(user);
        }
    }

    public Page<DoptorUser> filterByStatus(DoptorUserRequest doptorUserRequest) {
        Pageable pageable = Utils.getPageable(doptorUserRequest.getRequestBodyDTO());
        Page<DoptorUser> ePage = doptorUserRepository.findAllByIsActive(doptorUserRequest.getIsActive(), pageable);
        return new PageImpl<>(ePage.getContent(), pageable, ePage.getTotalElements());
    }
}
