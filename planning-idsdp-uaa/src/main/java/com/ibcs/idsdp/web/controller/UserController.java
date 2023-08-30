package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.enums.UserType;
import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.services.UserService;
import com.ibcs.idsdp.web.dto.ResponseStatus;
import com.ibcs.idsdp.web.dto.request.*;
import com.ibcs.idsdp.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.web.dto.response.OtpResponseDto;
import com.ibcs.idsdp.web.dto.response.UserResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.ibcs.idsdp.constants.ApiConstants.*;
import static com.ibcs.idsdp.constants.UserApiConstants.*;

@ApiController
@AllArgsConstructor
public class UserController {

	private final UserService userService;

	/**
	 * For saving registration
	 *
	 * @param registrationRequest
	 * @return
	 */
	@PostMapping(value = USERS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<IdentityResponse> registration(@RequestBody RegistrationRequest registrationRequest) {
		return userService.registration(registrationRequest);
	}

	/**
	 * For saving RMS registration
	 *
	 * @param registrationRequest
	 * @return
	 */
	@PostMapping(value = RMS_RESEARCHER_USERS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<IdentityResponse> rmsResearcherRegistration(@RequestBody RegistrationRequest registrationRequest) {
		return userService.rmsResearcherRegistration(registrationRequest);
	}


	@PostMapping(value = RMS_EVALUATOR_USERS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<IdentityResponse> rmsEvaluatorRegistration(@RequestBody RegistrationRequest registrationRequest) {
		return userService.rmsEvaluatorRegistration(registrationRequest);
	}

	/**
	 * user verification
	 */
	@PostMapping(value = "api/rms-verification/{userId}", produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<String> verification(@PathVariable("userId") String userId) {
		String res = userService.doVerification(userId);
		return new ResponseEntity<String>(res, HttpStatus.OK);

	}

	@PostMapping(value = "api/rms-verification/otp", produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<OtpResponseDto> otpVerification(@RequestBody OtpRequestDto otpRequestDto) {
		OtpResponseDto otpResponseDto = userService.otpDoVerification(otpRequestDto);
		return new ResponseEntity<OtpResponseDto>(otpResponseDto, HttpStatus.OK);

	}

	@PostMapping(value = "api/rms-verification/otp/resend/{userId}", produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<OtpResponseDto> otpResends(@PathVariable Long userId) {
		OtpResponseDto otpResponseDto = userService.otpResend(userId);
		return new ResponseEntity<OtpResponseDto>(otpResponseDto, HttpStatus.OK);

	}

	@PostMapping(value = "api/rms-verification/otp/profile/{userId}", produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<OtpResponseDto> otpResendsProfile(@PathVariable Long userId) {
		OtpResponseDto otpResponseDto = userService.phoneVerifiedFromProfile(userId);
		return new ResponseEntity<OtpResponseDto>(otpResponseDto, HttpStatus.OK);

	}

	/**
	 * For saving RMS registration
	 *
	 * @param registrationRequest
	 * @return
	 */
	@PostMapping(value = RMS_TI_USERS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<IdentityResponse> createRmsTIResearcherRegistration(
			@RequestBody RegistrationTIRequest registrationRequest) {
		return userService.createRmsTIResearcherRegistration(registrationRequest);
	}

	/**
	 * For getting UsersListByPageable
	 *
	 * @param page
	 * @param size
	 * @return
	 */
//    @GetMapping(value = USERS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
//    public Page<UserResponse> getUsersListByPageable(@RequestParam(name = "page", defaultValue = "0") int page,
//                                                     @RequestParam(name = "size", defaultValue = "10") int size) {
//        return userService.getUsersListByPageable(page, size);
//    }

	/**
	 * For getting User
	 *
	 * @param userId
	 * @return
	 */
	@GetMapping(value = USERS_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<UserResponse> getUser(@PathVariable(ID) Long userId) {
		return userService.getUser(userId);
	}

	/**
	 * For getting UserByUserId
	 *
	 * @param userId
	 * @return
	 */
	@GetMapping(value = USERS_BY_USER_ID_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<UserResponse> getUserByUserId(@PathVariable(ID) String userId) {
		return userService.getUserByUserId(userId);
	}

	@GetMapping(value = USERS_BY_EMAIL_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
	public String getUserByEmailId(@PathVariable(EMAILID) String emailId) {		
		System.out.println(emailId);
		return userService.getUserByEmailId(emailId);
	}

	/**
	 * For saving User Role
	 *
	 * @param userRoleRequest
	 * @param userId
	 */
	@PostMapping(value = USERS_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
	public void assignRoleForUser(@RequestBody UserRoleRequest userRoleRequest, @PathVariable(ID) Long userId) {
		userService.assignRoleForUser(userId, userRoleRequest);
	}

	/**
	 * For saving verify User
	 *
	 * @param registrationRequest
	 * @param userId
	 * @return
	 */
	@PutMapping(value = USERS_VERIFY_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<IdentityResponse> verifyUser(@RequestBody RegistrationRequest registrationRequest,
			@PathVariable(ID) Long userId) {
		return userService.verifyUser(userId, registrationRequest);
	}

	/**
	 * For updating User
	 *
	 * @param registrationRequest
	 * @param userId
	 * @return
	 */
	@PutMapping(value = USERS_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<IdentityResponse> updateUser(@RequestBody RegistrationRequest registrationRequest,
			@PathVariable(ID) Long userId) {
		return userService.updateUser(userId, registrationRequest);
	}

	/**
	 * For deleting user
	 *
	 * @param id
	 */
	@DeleteMapping(value = USERS_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
	public void softDeleteUser(@PathVariable("id") Long id) {
		userService.softDeleteUser(id);
	}

	/**
	 * For Updating change User Status
	 *
	 * @param registrationRequest
	 * @param userId
	 */
	@PutMapping(value = CHANGE_USER_STATUS + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
	public void changeUserStatus(@RequestBody RegistrationRequest registrationRequest, @PathVariable(ID) Long userId) {
		userService.changeUserStatus(userId, registrationRequest);
	}

	@PostMapping(value = UAA_USER_BY_USERID_AND_USERTYPE, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseStatus getUserByUserIdAndUserType(@RequestBody NothiUserRequest nothiUserRequest) {
		if (userService.getUserByUserIdAndUserType(nothiUserRequest)) {
			userService.saveNothiUser(nothiUserRequest);
			return new ResponseStatus(302, "User Found");
		} else {
			return new ResponseStatus(403, "User not Found");
		}
	}

	/**
	 * For getting all users
	 */
	@GetMapping(value = USERS_ALL_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<?> getAllUsers() {
		List<User> userList = userService.getAll();
		return new ResponseEntity<List<User>>(userList, HttpStatus.OK);
	}

	/*
	 * getting list of user by specific user type
	 */

	@GetMapping(value = USERS_ALL_ENDPOINT_USERTYPE, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<?> getAllUsersByType(@PathVariable String type) {
		List<User> userList = userService.getAllByUserType(type);
		return new ResponseEntity<List<User>>(userList, HttpStatus.OK);
	}


	@GetMapping(value = USERS_ALL_ENDPOINT_DUTYTYPE, produces = EXTERNAL_MEDIA_TYPE)
	public ResponseEntity<?> getAllUsersByDutyType(@PathVariable String type) {
		List<User> userList = userService.getAllByDutyType(UserType.valueOf(type));
		return new ResponseEntity<List<User>>(userList, HttpStatus.OK);
	}

	@GetMapping(path = USER_PAGEABLE_ENDPOINT + "/{page}" + "/{size}", produces = "application/json")
	public Page<UserResponse> getAllNothiUserList(@PathVariable("page") int page, @PathVariable("size") int size, @RequestHeader Map<String, Object> headerMap) {
		Map<String, Object> header = new HashMap<>();
		header.put("Accept", headerMap.get("accept"));
		header.put("Authorization", headerMap.get("authorization"));
		return userService.getUsersListByPageable(header, new PageableRequestBodyDTO() {
			{
				setPage(page);
				setSize(size);
			}
		});
	}

	@PostMapping(path = SEARCH_USER_ENDPOINT, produces = "application/json")
	public Page<UserResponse> searchUser(@RequestBody SearchUserRequest request, @RequestHeader Map<String, Object> headerMap) {
		Map<String, Object> header = new HashMap<>();
		header.put("Accept", headerMap.get("accept"));
		header.put("Authorization", headerMap.get("authorization"));
		return userService.searchUser(request, header);
	}


	@GetMapping(path = USERS_BY_USERSGROUP_ENDPOINT + "/{usergroup}", produces = "application/json")
	public List<User> getUserByUserGroup(@PathVariable("usergroup") String name) {
		return userService.getUserByUserGroup(name);
	}

	@PostMapping(path = USERS_BY_ID_SET_ENDPOINT, produces = "application/json")
	public ResponseEntity<List<UserResponse>> getUserByIdSet(@RequestBody Set<Long> ids) {
		return userService.getUserByIdSet(ids);
	}

}
