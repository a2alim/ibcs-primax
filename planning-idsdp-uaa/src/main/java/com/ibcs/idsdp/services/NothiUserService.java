package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.UserNotFoundException;
import com.ibcs.idsdp.model.domain.NothiUsers;
import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.model.repositories.NothiUserRepository;
import com.ibcs.idsdp.model.repositories.RoleRepository;
import com.ibcs.idsdp.model.repositories.UserRepository;
import com.ibcs.idsdp.model.repositories.UserRoleRepository;
import com.ibcs.idsdp.utils.Utils;
import com.ibcs.idsdp.web.dto.NothiUserDto;
import com.ibcs.idsdp.web.dto.ResponseStatus;
import com.ibcs.idsdp.web.dto.request.NothiUserRequest;
import com.ibcs.idsdp.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.web.dto.response.NothiUserResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NothiUserService {

    private final NothiUserRepository nothiUserRepository;
    private UserRepository userRepository;
    private UserRoleRepository userRoleRepository;
    private UserService userService;
    private RoleRepository roleRepository;
    private UserRoleService userRoleService;
    private final PasswordEncoder encoder;

    public Page<NothiUserResponse> getAllNothiUsers(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = Utils.getPageable(requestBodyDTO);
        Page<NothiUsers> ePage = nothiUserRepository.findAllByIsDeleteOrderByIdDesc(false, pageable);
        return new PageImpl<>(getRoleByNothiUser(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    private List<NothiUserResponse> getRoleByNothiUser(List<NothiUsers> nothiUsers) {
        List<NothiUserResponse> nothiUserResponses = new ArrayList<>();
        nothiUsers.forEach(e -> {
            nothiUserResponses.add(
                    new NothiUserResponse() {{
                        setId(e.getId());
                        setName(e.getName());
                        setDesignation(e.getDesignation());
                        setMobileNumber(e.getMobileNumber());
                        setIsActive(e.getIsActive());
                        setSection(e.getSection());
                        setNothiId(e.getNothiId());
                        setIsDelete(e.getIsDelete());
                        setRoles(userRoleRepository.findAllByUserId(userRepository.findByUserId(e.getNothiId()).getId()).stream().map(r -> roleRepository.findById(r.getRoleId()).get()).collect(Collectors.toList()));
                    }}
            );
        });
        return nothiUserResponses;
    }

    public void changeStatus(Long id, NothiUserRequest nothiUserRequest) {
        Optional<NothiUsers> nothiUsersOptional = nothiUserRepository.findById(id);
        if (nothiUsersOptional.isPresent()) {
            NothiUsers nothiUser = nothiUsersOptional.get();
            nothiUser.setIsActive(nothiUserRequest.getIsActive());
            nothiUserRepository.save(nothiUser);
        } else {
            throw new UserNotFoundException("Nothi User not fount");
        }
    }

    public Page<NothiUserResponse> filterByStatus(NothiUserRequest nothiUserRequest) {
        Pageable pageable = Utils.getPageable(nothiUserRequest.getRequestBodyDTO());
        Page<NothiUsers> ePage = nothiUserRepository.findAllByIsActiveAndIsDeleteOrderByIdDesc(nothiUserRequest.getIsActive(), false, pageable);
        return new PageImpl<>(getRoleByNothiUser(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    public void softDeleteUser(String nothiId) {
        NothiUsers nothiUser = nothiUserRepository.findByNothiId(nothiId);
        nothiUser.setIsActive(false);
        nothiUser.setIsDelete(true);
        nothiUserRepository.save(nothiUser);
        User user = userRepository.findByUserId(nothiId);
        user.setIsActive(false);
        user.setIsDelete(true);
        userRepository.save(user);
    }

    public NothiUsers updateNothiUser(NothiUserResponse response) {
        NothiUsers nothiUser = nothiUserRepository.findByNothiId(response.getNothiId());
        nothiUser.setDesignation(response.getDesignation());
        nothiUser.setName(response.getName());
        nothiUser.setMobileNumber(response.getMobileNumber());
        nothiUser.setIsActive(response.getIsActive());
        return nothiUserRepository.save(nothiUser);
    }


    @Transactional
    public ResponseStatus createNothiUser(NothiUserDto nothiUserDto) {
        /*
         * Check the Nothi user
         */
        if (isNothiUserAlreadyPresent(nothiUserDto.getNothiId())) {
            return new ResponseStatus(204, "User Already Exits");
        }
        if (isNothiUserPresentByEmail(nothiUserDto.getEmail())) {
            return new ResponseStatus(204, "User Already Exits by this email");
        }

        /*
         *Save Nothi User
         */
        NothiUsers nothiUsers = new NothiUsers();
        BeanUtils.copyProperties(nothiUserDto, nothiUsers);
        nothiUsers.setIsActive(true);
        nothiUsers.setIsDelete(false);
        nothiUserRepository.save(nothiUsers);

        /*
         * Save nothi-user in user table
         */
        User user = new User();
        user.setUserId(nothiUserDto.getNothiId());
        user.setName(nothiUserDto.getName());
        user.setDesignation(nothiUserDto.getDesignation());
        user.setMobileNumber(nothiUserDto.getMobileNumber());
        user.setPassword(encoder.encode(nothiUserDto.getMobileNumber()));
        user.setEmailId(nothiUserDto.getEmail());
        user.setUserType("NOTHI");
        user.setIsActive(true);
        user.setIsDelete(false);
        userRepository.save(user);
        return new ResponseStatus(200, "Succesfully Saved Nothi User Data");

    }

    private boolean isNothiUserAlreadyPresent(String nothiId) {
        return nothiUserRepository.existsByNothiIdAndIsDelete(nothiId, false);
    }

    private boolean isNothiUserPresentByEmail(String nothiId) {
        return nothiUserRepository.existsByEmailAndIsDelete(nothiId, false);
    }

    public NothiUsers getNothiUserByNothiId(String nothiId) {
        return nothiUserRepository.findByNothiId(nothiId);
    }
}
