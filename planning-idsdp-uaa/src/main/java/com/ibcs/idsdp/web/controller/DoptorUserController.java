package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.DoptorUserApiConstants;
import com.ibcs.idsdp.model.domain.DoptorUser;
import com.ibcs.idsdp.services.DoptorUserService;
import com.ibcs.idsdp.web.dto.request.DoptorUserRequest;
import com.ibcs.idsdp.web.dto.request.PageableRequestBodyDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import static com.ibcs.idsdp.constants.ApiConstants.*;

@ApiController
@AllArgsConstructor
public class DoptorUserController {

    private final DoptorUserService doptorUserService;

    /**
     * for get Active Doptor user list
     *
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = DoptorUserApiConstants.DOPTOR_USERS_ENDPOINT + "/{page}" + "/{size}", produces = "application/json")
    public Page<DoptorUser> getAllDoptorUserList(@PathVariable("page") int page, @PathVariable("size") int size) {
        return doptorUserService.getAllDoptorUser(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

    /**
     * For Updating User Status
     *
     * @param doptorUserRequest
     * @param userId
     */
    @PutMapping(value = DoptorUserApiConstants.CHANGE_DOPTOR_USER_STATUS + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public void changeUserStatus(@RequestBody DoptorUserRequest doptorUserRequest,
                                 @PathVariable(ID) Long id) {
        doptorUserService.changeStatus(id, doptorUserRequest);
    }

    @PostMapping(value = DoptorUserApiConstants.DOPTOR_USER_BY_STATUS, produces = EXTERNAL_MEDIA_TYPE)
    public Page<DoptorUser> filterByStatus(@RequestBody DoptorUserRequest doptorUserRequest) {
        return doptorUserService.filterByStatus(doptorUserRequest);
    }
}
