package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.NothiUserApiConstants;
import com.ibcs.idsdp.model.domain.NothiUsers;
import com.ibcs.idsdp.services.NothiUserService;
import com.ibcs.idsdp.web.dto.NothiUserDto;
import com.ibcs.idsdp.web.dto.ResponseStatus;
import com.ibcs.idsdp.web.dto.request.NothiUserRequest;
import com.ibcs.idsdp.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.web.dto.response.NothiUserResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import static com.ibcs.idsdp.constants.ApiConstants.*;

@ApiController
@AllArgsConstructor
public class NothiUserController {

    private final NothiUserService nothiUserService;

    /*
     * Create Nothi user
     *
     */
    @PostMapping(NothiUserApiConstants.CREATE_NOTHI_USER)
    public ResponseStatus createNothiUser(@RequestBody NothiUserDto nothiUserDto) {
        return nothiUserService.createNothiUser(nothiUserDto);
    }

    /**
     * for get Active Nothi user list
     *
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = NothiUserApiConstants.NOTHI_USERS_ENDPOINT + "/{page}" + "/{size}", produces = "application/json")
    public Page<NothiUserResponse> getAllNothiUserList(@PathVariable("page") int page, @PathVariable("size") int size) {
        return nothiUserService.getAllNothiUsers(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

    /**
     * For Updating User Status
     *
     * @param nothiUserRequest
     * @param id
     */
    @PutMapping(value = NothiUserApiConstants.CHANGE_NOTHI_USER_STATUS + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public void changeUserStatus(@RequestBody NothiUserRequest nothiUserRequest,
                                 @PathVariable(ID) Long id) {
        nothiUserService.changeStatus(id, nothiUserRequest);
    }

    @PostMapping(value = NothiUserApiConstants.NOTHI_USER_BY_STATUS, produces = EXTERNAL_MEDIA_TYPE)
    public Page<NothiUserResponse> filterByStatus(@RequestBody NothiUserRequest nothiUserRequest) {
        return nothiUserService.filterByStatus(nothiUserRequest);
    }

    /**
     * For deleting user
     *
     * @param nothiId
     */
    @DeleteMapping(value = NothiUserApiConstants.NOTHI_USERS_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public void softDeleteUser(@PathVariable("id") String nothiId) {
        nothiUserService.softDeleteUser(nothiId);
    }

    @PutMapping(value = NothiUserApiConstants.NOTHI_USERS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public NothiUsers updateNothiUser(@RequestBody NothiUserResponse nothiUsers) {
        return nothiUserService.updateNothiUser(nothiUsers);
    }

    @GetMapping(value = NothiUserApiConstants.NOTHI_USER_ENDPOINT_BY_NOTHI_ID + "/{nothi_id}")
    public NothiUsers getNothiUserByNothiId(@PathVariable("nothi_id") String nothiId){
        return nothiUserService.getNothiUserByNothiId(nothiId);
    }
}
