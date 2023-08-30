package com.ibcs.idsdp.services;

import com.ibcs.idsdp.client.PpsConfigurationClientService;
import com.ibcs.idsdp.client.RmsMailService;
import com.ibcs.idsdp.enums.UserGroup;
import com.ibcs.idsdp.enums.UserType;
import com.ibcs.idsdp.exceptions.EmailAlreadyExistException;
import com.ibcs.idsdp.exceptions.MobileNumberAlreadyExistException;
import com.ibcs.idsdp.exceptions.UserNotFoundException;
import com.ibcs.idsdp.model.domain.Role;
import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.model.domain.UserRole;
import com.ibcs.idsdp.model.repositories.RoleRepository;
import com.ibcs.idsdp.model.repositories.UserRepository;
import com.ibcs.idsdp.model.repositories.UserRoleRepository;
import com.ibcs.idsdp.utils.Utils;
import com.ibcs.idsdp.web.dto.UserTfaDto;
import com.ibcs.idsdp.web.dto.request.*;
import com.ibcs.idsdp.web.dto.response.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder encoder;
    private final RoleService roleService;
    private final MailService mailService;
    private final RmsMailService rmsMailService;
    private final SmsService smsService;
    private final PpsConfigurationClientService configurationClientService;

    @Value("${idsdp.frontend.verification.link}")
    private String verificationLink;

    @Value("${idsdp.frontend.verification.rms}")
    private String RmsVerificationLink;

    @Value("${timer.value}")
    private int timer;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, UserRoleRepository userRoleRepository,
                       PasswordEncoder encoder, MailService mailService, RoleService roleService, SmsService smsService,
                       RmsMailService rmsMailService, PpsConfigurationClientService configurationClientService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleService = roleService;
        this.encoder = encoder;
        this.mailService = mailService;
        this.rmsMailService = rmsMailService;
        this.smsService = smsService;
        this.configurationClientService = configurationClientService;
    }

    /*
     * Create Evaluator User
     * */
    public ResponseEntity<IdentityResponse> rmsEvaluatorRegistration(RegistrationRequest registrationRequest) {
        User user = new User();
        user.setUserId(Utils.generateUniqueKey());
        user.setName(registrationRequest.getName());
        user.setEmailId(registrationRequest.getEmailId());
        user.setPassword(encoder.encode(registrationRequest.getPassword()));
        user.setDesignation(registrationRequest.getDesignation());
        user.setMobileNumber(registrationRequest.getMobileNumber());
        user.setIsInstitutional(registrationRequest.getIsInstitutional());
        user.setIsActive(true);
        user.setIsDelete(false);
        user.setPhoneIsVerified(false);
        user.setPhoneOtp(null);
        user.setUserGroupId(null);
        user.setUserType("Rms_Evaluator");
        user.setDutyType(null);

        if (isMobileNumberAlreadyPresent(registrationRequest.getMobileNumber())) {
            return new ResponseEntity(new IdentityResponse("Mobile Number Already Exist"), HttpStatus.CONFLICT);
        }

        if (isEmailAlreadyPresent(registrationRequest.getEmailId())) {
            return new ResponseEntity(new IdentityResponse("Email Already Exist"), HttpStatus.CONFLICT);
        }

        userRepository.save(user);

        if (user != null && user.getId() != null) {
            UserRoleRequest userRoleRequest = new UserRoleRequest();
            Set<String> userRole = new HashSet<>();
            userRole.add("Rms_Evaluator");
            userRoleRequest.setRoleNames(userRole);
            assignRoleForUser(user.getId(), userRoleRequest);

        }
        return new ResponseEntity(new IdentityResponse(user.getId()), HttpStatus.CREATED);
    }

    /**
     * For getting registrationRequest
     *
     * @param registrationRequest
     * @return
     */
    public ResponseEntity<IdentityResponse> rmsResearcherRegistration(RegistrationRequest registrationRequest) {

        if (isMobileNumberAlreadyPresent(registrationRequest.getMobileNumber())) {
            //System.out.println("Mobile Number Already Exist");
            // throw new MobileNumberAlreadyExistException("Mobile Number Already Exist");
            return new ResponseEntity(new IdentityResponse("Mobile Number Already Exist"), HttpStatus.CONFLICT);
        }

        if (isEmailAlreadyPresent(registrationRequest.getEmailId())) {
            //System.out.println("Email Already Exist");
            // throw new EmailAlreadyExistException("Email Already Exist");
            return new ResponseEntity(new IdentityResponse("Email Already Exist"), HttpStatus.CONFLICT);
        }

        Integer otp = smsService.generateOtp();
        User user = new User();
        user.setUserId(Utils.generateUniqueKey());
        user.setName(registrationRequest.getName());
        user.setEmailId(registrationRequest.getEmailId());
        user.setPassword(encoder.encode(registrationRequest.getPassword()));
        user.setDesignation(registrationRequest.getDesignation());
        user.setMobileNumber(registrationRequest.getMobileNumber());
        user.setIsInstitutional(registrationRequest.getIsInstitutional());

        user.setIsActive(false);
        user.setIsDelete(false);
        user.setPhoneIsVerified(false);
        user.setPhoneOtp(otp);

        user.setUserGroupId(null);
        if(!registrationRequest.getIsVisitorUser()) {
            user.setUserType("Rms_Researcher");
        }else{
            user.setUserType("Rms_Visitor");
        }
        user.setDutyType(null);

        userRepository.save(user);

        //sending sms
        /*
        SmsDto smsdto = new SmsDto();
        smsdto.setMessage(String.valueOf(otp));
        smsdto.setNumber(registrationRequest.getMobileNumber());
        rmsMailService.sendOtpSms(smsdto);
        */

        if (user != null && user.getId() != null) {

            UserRoleRequest userRoleRequest = new UserRoleRequest();
            Set<String> userRole = new HashSet<>();

            if(!registrationRequest.getIsVisitorUser()) {
                userRole.add("RMS_RESEARCHER");
            }else{
                userRole.add("RMS_VISITOR");
            }
            userRoleRequest.setRoleNames(userRole);
            assignRoleForUser(user.getId(), userRoleRequest);
        }

        try {
            MailRequestDto requestDto = new MailRequestDto();
            requestDto.setBody(RmsVerificationLink + user.getUserId() + "/ti");
            requestDto.setTo(user.getEmailId());
            requestDto.setFrom("ssrc.gov.bd@gmail.com");

            if(!registrationRequest.getIsVisitorUser()) {
                requestDto.setSubject("Researcher sign-up");
            }else{
                requestDto.setSubject("Visitor sign-up");
            }
            requestDto.setTemplateName("email-template");
            requestDto.setIsAttachment(false);
            requestDto.setAttachmentUrl("");
            requestDto.setAttachmentName("");

            rmsMailService.sendMail(requestDto);
            //mailService.sendEmail(user.getEmailId(), "User creation confirmation from our service",verificationLink + user.getUserId());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        this.OtpTimeOut(timer, user.getId());
        return new ResponseEntity(new IdentityResponse(user.getId()), HttpStatus.CREATED);
    }


    /**
     * For otp validation
     *
     * @param
     * @return
     */

    public OtpResponseDto otpDoVerification(OtpRequestDto otpRequestDto) {

        Optional<User> byIdAndPhoneOtp = userRepository.findByIdAndPhoneOtp(otpRequestDto.getUserId(), otpRequestDto.getOtp());

        if (byIdAndPhoneOtp.isPresent()) {

            User user = byIdAndPhoneOtp.get();

            if (user.getPhoneIsVerified()) {
                return new OtpResponseDto() {{
                    setStatus(false);
                    setMessage("Already verified");
                }};

            } else {
                user.setPhoneIsVerified(true);
                userRepository.save(user);

                return new OtpResponseDto() {{
                    setStatus(true);
                    setMessage("Phone Verified Successfully");
                }};
            }

        } else {

            return new OtpResponseDto() {{
                setStatus(false);
                setMessage("Wrong OTP. Please Try Again");
            }};

        }


    }


    //otp Resend

    public OtpResponseDto otpResend(Long userId) {
        Integer otp = smsService.generateOtp();
        Boolean res = false;
        Optional<User> byId = userRepository.findById(userId);
        if (byId.isPresent()) {
            User user = byId.get();
            user.setPhoneOtp(otp);
            userRepository.save(user);
            //sending sms
            SmsDto smsdto = new SmsDto();
            smsdto.setMessage(String.valueOf(otp));
            smsdto.setNumber(user.getMobileNumber());
            rmsMailService.sendOtpSms(smsdto);
            //timeout
            OtpTimeOut(timer, userId);
            return new OtpResponseDto() {{
                setStatus(true);
                setMessage("OTP Resend Success");
            }};
        } else {
            return new OtpResponseDto() {{
                setStatus(false);
                setMessage("User data Not Found");
            }};
        }


    }


    /**
     * For getting registrationRequest
     *
     * @param registrationRequest
     * @return
     */
    public ResponseEntity<IdentityResponse> createRmsTIResearcherRegistration(RegistrationTIRequest registrationRequest) {
        Integer otp = smsService.generateOtp();

        User user = new User();
        user.setUserId(Utils.generateUniqueKey());
        user.setOrganigationName(registrationRequest.getTrainingInstituteName());
        user.setName(registrationRequest.getHeadOfInstitute());
        user.setEmailId(registrationRequest.getEmail());
        user.setPassword(encoder.encode(registrationRequest.getPassword()));
        user.setDesignation(registrationRequest.getDesignation());
        user.setMobileNumber(registrationRequest.getMobile());
        user.setDateOfBirth(registrationRequest.getDateOfBirth());
        user.setPhoneOtp(otp);
        user.setPhoneIsVerified(false);
        user.setIsActive(false);
        user.setIsDelete(false);

        user.setUserGroupId(null);
        user.setUserType(registrationRequest.getUserType());
        user.setDutyType(null);

        if (isMobileNumberAlreadyPresent(registrationRequest.getMobile())) {
            System.out.println("Mobile Number Already Exist");
            // throw new MobileNumberAlreadyExistException("Mobile Number Already Exist");
            return new ResponseEntity(new IdentityResponse("Mobile Number Already Exist"), HttpStatus.CONFLICT);
        }

        if (isEmailAlreadyPresent(registrationRequest.getEmail())) {
            System.out.println("Email Already Exist");
            // throw new EmailAlreadyExistException("Email Already Exist");
            return new ResponseEntity(new IdentityResponse("Email Already Exist"), HttpStatus.CONFLICT);
        }

        userRepository.save(user);

        if (user != null && user.getId() != null) {

            UserRoleRequest userRoleRequest = new UserRoleRequest();
            Set<String> userRole = new HashSet<>();
            userRole.add("RMS_TRAINING_INSTITUTE");
            userRoleRequest.setRoleNames(userRole);
            assignRoleForUser(user.getId(), userRoleRequest);

        }

        try {
//            SmsDto smsdto = new SmsDto();
//            smsdto.setMessage(String.valueOf(otp));
//            smsdto.setNumber(user.getMobileNumber());
//            rmsMailService.sendOtpSms(smsdto);

            MailRequestDto requestDto = new MailRequestDto();
            requestDto.setBody(RmsVerificationLink + user.getUserId() + "/ti");
            requestDto.setTo(user.getEmailId());
            requestDto.setFrom("ssrc.gov.bd@gmail.com");
            requestDto.setSubject("SSRC Training Institute Sign-Up");
            requestDto.setTemplateName("email-template");
            requestDto.setIsAttachment(false);
            requestDto.setAttachmentUrl("");
            requestDto.setAttachmentName("");
            rmsMailService.sendMail(requestDto);

//            MailRequestDto requestDto = new MailRequestDto();
//            requestDto.setBody(RmsVerificationLink + user.getUserId());
//            requestDto.setTo(user.getEmailId());
//            requestDto.setFrom("ssrc.gov.bd@gmail.com");
//            requestDto.setSubject("SSRC Training Institute Sign-Up");
//            requestDto.setTemplateName("email-template");
//            requestDto.setIsAttachment(false);
//            requestDto.setAttachmentUrl("");
//            requestDto.setAttachmentName("");
//            rmsMailService.sendMail(requestDto);
        } catch (Exception e) {
            System.out.println(e);
        }
        return new ResponseEntity(new IdentityResponse(user.getId()), HttpStatus.CREATED);
    }

    /**
     * For
     * user
     * Verification
     */
    public String doVerification(String userId) {
        String res;
        User user = null;
        user = userRepository.findByUserId(userId);
        if (user == null) {
            res = "User Not Found";
        }
        if (user != null && user.getIsActive()) {
            res = "This user Already Activated";
        } else {
            user.setIsActive(true);
            userRepository.save(user);
            res = "Activated !! You Can Login Now";
        }
        return res;
    }

    /**
     * For getting registrationRequest
     *
     * @param registrationRequest
     * @return
     */
    public ResponseEntity<IdentityResponse> registration(RegistrationRequest registrationRequest) {
        User user = new User();
        user.setUserId(Utils.generateUniqueKey());
        user.setName(registrationRequest.getName());
        user.setEmailId(registrationRequest.getEmailId());
        user.setPassword(encoder.encode(registrationRequest.getMobileNumber()));
        user.setDesignation(registrationRequest.getDesignation());
        user.setMobileNumber(registrationRequest.getMobileNumber());
        user.setIsActive(false);
        user.setIsDelete(false);

        UserType userType = null;
        UserGroup userGroup = null;

        if (registrationRequest.getDutyType() != null && !registrationRequest.getDutyType().isEmpty()) {
            userType = UserType.valueOf(registrationRequest.getDutyType());
        }
        if (registrationRequest.getUserGroup() != null && !registrationRequest.getUserGroup().isEmpty()) {
            userGroup = UserGroup.valueOf(registrationRequest.getUserGroup());
        }

        user.setUserGroupId(userGroup);
        user.setDutyType(userType);
        if (isEmailAlreadyPresent(registrationRequest.getEmailId())) {
            throw new EmailAlreadyExistException("Email Already Exist");
        }
        if (isMobileNumberAlreadyPresent(registrationRequest.getMobileNumber())) {
            throw new MobileNumberAlreadyExistException("Mobile number Already Exist");
        }
        userRepository.save(user);
        try {
            mailService.sendEmail(user.getEmailId(), "User creation confirmation from our service",
                    verificationLink + user.getUserId());
        } catch (Exception e) {
            System.out.println(e);
        }
        return new ResponseEntity(new IdentityResponse(user.getId()), HttpStatus.CREATED);
    }

    private boolean isEmailAlreadyPresent(String email) {
        return userRepository.existsByEmailId(email);
    }

    private boolean isMobileNumberAlreadyPresent(String mobileNumber) {
        return userRepository.existsByMobileNumber(mobileNumber);
    }

    /**
     * For assignRoleForUser
     *
     * @param userId
     * @param userRoleRequest
     */
    public void assignRoleForUser(Long userId, UserRoleRequest userRoleRequest) {

        for (String roleName : userRoleRequest.getRoleNames()) {
            Optional<Role> optionalRole = roleRepository.findByRoleName(roleName);
            if (!optionalRole.isPresent()) {
                throw new UserNotFoundException(userRoleRequest.getRoleNames() + " role not found");
            } else {
                UserRole userRole = new UserRole();
                userRole.setUserId(userId);
                userRole.setRoleId(optionalRole.get().getId());
                userRoleRepository.save(userRole);
            }
        }
    }

    /**
     * For
     *
     * @return
     */
    public ResponseEntity<List<UserResponse>> getUsers() {
        List<UserResponse> userResponseList = new ArrayList<>();
        List<User> userList = userRepository.findAllByIsDelete(false);
        for (User user : userList) {
            userResponseList.add(getUserResponse(user));
        }
        return new ResponseEntity(userResponseList, HttpStatus.OK);
    }

    public Page<UserResponse> getUsersListByPageable(Map<String, Object> headerMap, PageableRequestBodyDTO requestBodyDTO) {
        List<UserResponse> userResponseList = new ArrayList<>();
        Pageable pageable = Utils.getPageable(requestBodyDTO);
        Page<User> ePage = userRepository.findAllByIsDeleteOrderByIdDesc(false, pageable);
        Set<Long> userIds = ePage.stream().map(m -> m.getId()).collect(Collectors.toSet());
        List<UserRole> allUserRoll = userRoleRepository.findAllByUserIdIn(userIds);
        List<Role> allRoll = roleRepository.findAllByIsNotDelete();
        List<UserGroupDTO> userGroupList = configurationClientService.getUserGroupByUserIdSet(headerMap,
            new IdSetRequestBodyDTO() {{
                setIds(userIds);
            }}
        );

        ePage.getContent().forEach(user -> {
            UserResponse userDTO = new UserResponse();
            BeanUtils.copyProperties(user, userDTO);
            List<UserRole> roles = allUserRoll.stream().filter(m -> m.getUserId().equals(user.getId())).collect(toList());
            List<Role> roleList = roles.stream()
                    .map(userRole -> allRoll.stream().filter(n -> n.getId() == userRole.getRoleId()).findFirst().get()).collect(toList());
            userDTO.setRoles(roleList);

            Optional<UserGroupDTO> userGroup = userGroupList.stream().filter(m -> m.getUserId().equals(user.getId())).findFirst();
            if (userGroup.isPresent()) {
                String agency = userGroup.get().getAgency() != null ? userGroup.get().getAgency().getNameEn() : "";
                String ministry = userGroup.get().getMinistryDivision() != null ? userGroup.get().getMinistryDivision().getNameEn() : "";
                if (!agency.isEmpty() && userGroup.get().getAgency().getMinistryDivision() != null) {
                    ministry = userGroup.get().getAgency().getMinistryDivision().getNameEn();
                }

                userDTO.setAgencyName(agency);
                userDTO.setMinistryDivisionName(ministry);
            }

            userResponseList.add(userDTO);
        });
        return new PageImpl<>(userResponseList, pageable, ePage.getTotalElements());
    }

    public Page<UserResponse> searchUser(@RequestBody SearchUserRequest request, Map<String, Object> headerMap) {
        if (request.getAgencyId() == null && request.getMinistryDivisionId() == null) {
            return searchByText(request, headerMap);
        } else {
            return searchByAgencyMinistry(request, headerMap);
        }
    }

    private Page<UserResponse> searchByText(@RequestBody SearchUserRequest request, Map<String, Object> headerMap) {
        List<UserResponse> userResponseList = new ArrayList<>();
        Pageable pageable = Utils.getPageable(request.getPageable());
        Page<User> users = null;
        if (request.getSearchText()==null || request.getSearchText().isEmpty() || request.getSearchText().trim().isEmpty()) {
            users = userRepository.findAllByIsDeleteOrderByIdDesc(false, pageable);
        } else {
            String searchText = "%"+request.getSearchText().trim()+"%";
            users = userRepository.findAllByNameLikeIgnoreCaseOrEmailIdLikeIgnoreCaseOrMobileNumberLikeAndIsDeleteOrderByIdDesc(searchText, searchText, searchText, false, pageable);
        }

        Set<Long> userIds = users.stream().map(User::getId).collect(Collectors.toSet());
        List<UserRole> allUserRoll = userRoleRepository.findAllByUserIdIn(userIds);
        List<Role> allRoll = roleRepository.findAllByIsNotDelete();
        List<UserGroupDTO> userGroupList = configurationClientService.getUserGroupByUserIdSet(headerMap,
                new IdSetRequestBodyDTO() {{
                    setIds(userIds);
                }}
        );

        users.getContent().forEach(user -> {
            UserResponse userDTO = new UserResponse();
            BeanUtils.copyProperties(user, userDTO);
            List<UserRole> roles = allUserRoll.stream().filter(m -> m.getUserId().equals(user.getId())).collect(toList());
            List<Role> roleList = roles.stream()
                    .map(userRole -> allRoll.stream().filter(n -> n.getId() == userRole.getRoleId()).findFirst().get()).collect(toList());
            userDTO.setRoles(roleList);

            Optional<UserGroupDTO> userGroup = userGroupList.stream().filter(m -> m.getUserId().equals(user.getId())).findFirst();
            if (userGroup.isPresent()) {
                String agency = userGroup.get().getAgency() != null ? userGroup.get().getAgency().getNameEn() : "";
                String ministry = userGroup.get().getMinistryDivision() != null ? userGroup.get().getMinistryDivision().getNameEn() : "";
                if (!agency.isEmpty() && userGroup.get().getAgency().getMinistryDivision() != null) {
                    ministry = userGroup.get().getAgency().getMinistryDivision().getNameEn();
                }

                userDTO.setAgencyName(agency);
                userDTO.setMinistryDivisionName(ministry);
            }

            userResponseList.add(userDTO);
        });
        return new PageImpl<>(userResponseList, pageable, users.getTotalElements());
    }

    private Page<UserResponse> searchByAgencyMinistry(@RequestBody SearchUserRequest request, Map<String, Object> headerMap) {
        List<User> userList = new ArrayList<>();
        List<UserResponse> userResponseList = new ArrayList<>();
        List<UserGroupDTO> userGroupList = new ArrayList<>();
        Pageable pageable = Utils.getPageable(request.getPageable());
        if (request.getAgencyId() != null && request.getAgencyId()> 0) {
            userGroupList = configurationClientService.getUserGroupByAgencyId(headerMap, request.getAgencyId());
        } else if (request.getMinistryDivisionId() != null && request.getMinistryDivisionId() > 0) {
            userGroupList = configurationClientService.getUserGroupByMinistryDivisionId(headerMap, request.getMinistryDivisionId());
        }

        Set<Long> userIds = userGroupList.stream().map(m -> m.getUserId()).collect(Collectors.toSet());
        List<UserRole> allUserRoll = userRoleRepository.findAllByUserIdIn(userIds);
        List<Role> allRoll = roleRepository.findAllByIsNotDelete();
        Page<User> users = userRepository.findByIdInAndIsDeleteOrderByIdDesc(userIds, false, pageable);
        if (request.getSearchText() == null || request.getSearchText().isEmpty()) {
            userList = users.getContent();
        } else {
            String searchText = request.getSearchText().trim().toLowerCase();
            userList = users.stream().filter(m -> m.getName().toLowerCase().contains(searchText) || m.getEmailId().toLowerCase().contains(searchText)
                    || m.getMobileNumber().toLowerCase().contains(searchText)).collect(toList());
        }

        List<UserGroupDTO> finalUserGroupList = userGroupList;
        userList.forEach(user -> {
            UserResponse userDTO = new UserResponse();
            BeanUtils.copyProperties(user, userDTO);
            List<UserRole> roles = allUserRoll.stream().filter(m -> m.getUserId().equals(user.getId())).collect(toList());
            List<Role> roleList = roles.stream()
                    .map(userRole -> allRoll.stream().filter(n -> n.getId() == userRole.getRoleId()).findFirst().get()).collect(toList());
            userDTO.setRoles(roleList);

            Optional<UserGroupDTO> userGroup = finalUserGroupList.stream().filter(m -> m.getUserId().equals(user.getId())).findFirst();
            if (userGroup.isPresent()) {
                String agency = userGroup.get().getAgency() != null ? userGroup.get().getAgency().getNameEn() : "";
                String ministry = userGroup.get().getMinistryDivision() != null ? userGroup.get().getMinistryDivision().getNameEn() : "";
                if (!agency.isEmpty() && userGroup.get().getAgency().getMinistryDivision() != null) {
                    ministry = userGroup.get().getAgency().getMinistryDivision().getNameEn();
                }

                userDTO.setAgencyName(agency);
                userDTO.setMinistryDivisionName(ministry);
            }

            userResponseList.add(userDTO);
        });

        return new PageImpl<>(userResponseList, pageable, users.getTotalElements());
    }


    /**
     * @param userId
     * @return
     */
    public ResponseEntity<UserResponse> getUser(Long userId) {

        Optional<User> userList = userRepository.findById(userId);
        if(userList.isPresent()){
            return new ResponseEntity(getUserResponse(userList.get()), HttpStatus.OK);
        }
        return new ResponseEntity(null, HttpStatus.OK);
    }

    /**
     * @param userId
     * @param registrationRequest
     * @return
     */
    public ResponseEntity<IdentityResponse> verifyUser(Long userId, RegistrationRequest registrationRequest) {
        User user = userRepository.findById(userId).get();
        if (user != null) {
            user.setPassword(encoder.encode(registrationRequest.getPassword()));
            user.setIsActive(true);
            userRepository.save(user);
            return new ResponseEntity(new IdentityResponse(user.getId()), HttpStatus.OK);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    /**
     * @param id
     */
    public void softDeleteUser(Long id) {
        User user = userRepository.findById(id).get();
        user.setIsDelete(true);
        userRepository.save(user);
    }

    /**
     * @param userId
     * @param registrationRequest
     * @return
     */
    public ResponseEntity<IdentityResponse> updateUser(Long userId, RegistrationRequest registrationRequest) {
        User user = userRepository.findById(userId).get();
        user.setName(registrationRequest.getName());
        user.setDesignation(registrationRequest.getDesignation());
        user.setEmailId(registrationRequest.getEmailId());
        user.setMobileNumber(registrationRequest.getMobileNumber());
        user.setIsActive(registrationRequest.getIsActive());

        UserType userType = null;
        UserGroup userGroup = null;

        if (registrationRequest.getDutyType() != null && !registrationRequest.getDutyType().isEmpty()) {
            userType = UserType.valueOf(registrationRequest.getDutyType());
        }
        if (registrationRequest.getUserGroup() != null && !registrationRequest.getUserGroup().isEmpty()) {
            userGroup = UserGroup.valueOf(registrationRequest.getUserGroup());
        }

        user.setUserGroupId(userGroup);
        user.setDutyType(userType);

        userRepository.save(user);
        return new ResponseEntity(new IdentityResponse(user.getId()), HttpStatus.OK);
    }

    /**
     * @return
     */
    public ResponseEntity<List<UserTfaDto>> getAllUser() {
        List<UserTfaDto> userTfaDtoList = new ArrayList<>();
        List<User> userList = userRepository.findAll();
        for (User user : userList) {
            UserTfaDto userTfaDto = new UserTfaDto();
            userTfaDto.setId(user.getId());
            userTfaDto.setTfa_enabled(user.getTfa_Enabled());
            userTfaDto.setName(user.getName());
            userTfaDtoList.add(userTfaDto);
        }
        return new ResponseEntity(userTfaDtoList, HttpStatus.OK);
    }

    /**
     * @param userTfaRequest
     * @return
     */
    public ResponseEntity<String> update2faEnabled(UserTfaRequest userTfaRequest) {
        User existingUser = userRepository.findById(userTfaRequest.getUserId()).orElse(null);
        existingUser.setTfa_Enabled(userTfaRequest.isTfaEnabled());
        userRepository.save(existingUser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * @param userId
     * @return
     */
    public ResponseEntity<UserResponse> getUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user != null) {
            return new ResponseEntity(getUserResponse(user), HttpStatus.OK);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public ResponseEntity<User> getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return new ResponseEntity(userOptional.get(), HttpStatus.OK);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public void changeUserStatus(Long userId, RegistrationRequest registrationRequest) {
        User user = userRepository.findById(userId).get();
        user.setIsActive(registrationRequest.getIsActive());
        userRepository.save(user);
    }

    /**
     * Fon
     *
     * @param user
     * @return
     */
    private UserResponse getUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUserId(user.getUserId());
        userResponse.setDesignation(user.getDesignation());
        userResponse.setEmailId(user.getEmailId());
        userResponse.setMobileNumber(user.getMobileNumber());
        userResponse.setName(user.getName());
        userResponse.setOrganigationName(user.getOrganigationName());
        userResponse.setDateOfBirth(user.getDateOfBirth());
        userResponse.setUserType(user.getUserType());
        userResponse.setIsActive(user.getIsActive());
        userResponse.setUserGroupId(user.getUserGroupId());
        userResponse.setDutyTypeId(user.getDutyType());
        userResponse.setPhoneIsVerified(user.getPhoneIsVerified());
        return userResponse;
    }

    /**
     * For getting RoleByUser
     *
     * @param userResponse
     * @return
     */
    private UserResponse getRoleByUser(UserResponse userResponse) {
        List<UserRole> userRoleList = userRoleRepository.findAllByUserId(userResponse.getId());
        List<Role> roleList = userRoleList.stream().map(userRole -> {
            return roleRepository.findById(userRole.getRoleId()).get();
        }).collect(toList());
        userResponse.setRoles(roleList);
        return userResponse;
    }

    private List<Role> getRolesByUserId(Long id) {
        List<UserRole> userRoleList = userRoleRepository.findAllByUserId(id);
        return userRoleList.stream().map(userRole -> {
            return roleRepository.findById(userRole.getRoleId()).get();
        }).collect(toList());
    }

    public boolean getUserByUserIdAndUserType(NothiUserRequest nothiUserRequest) {
//        Optional<User> user = userRepository.findByUserIdAndIsActiveAndIsDeleteAndUserType(nothiUserRequest.getUserId(),
//                true, false, nothiUserRequest.getUserType());

        Optional<User> user = userRepository.findByUserIdAndIsActiveAndIsDelete(nothiUserRequest.getUserId(), true, false);
        return user.isPresent();
    }

    public void saveNothiUser(NothiUserRequest nothiUserRequest) {
        User user = userRepository.findByUserId(nothiUserRequest.getUserId());
        user.setPassword(encoder.encode(nothiUserRequest.getPassword()));
        user.setIsActive(true);
        user.setIsDelete(false);
        //user.setUserType("NOTHI");
        userRepository.save(user);
    }

    public List<User> getUserByUserGroup(String name) {
        UserGroup userGroup = UserGroup.valueOf(name);
        List<User> userList = userRepository.findAllByUserGroupId(userGroup);
        return userList;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public ResponseEntity<List<UserResponse>> getUserByIdSet(Set<Long> ids) {

        List<User> userList = userRepository.findByIdIn(ids);
        if (userList.isEmpty())
            return new ResponseEntity(Collections.EMPTY_LIST, HttpStatus.OK);
        return new ResponseEntity(userList.stream().map(this::getUserResponse).collect(Collectors.toList()),
                HttpStatus.OK);
    }


    //phoneVerifiedFromProfile
    public OtpResponseDto phoneVerifiedFromProfile(Long id) {
        try {
            User user = userRepository.findById(id).get();
            Integer otp = smsService.generateOtp();
            user.setPhoneOtp(otp);
            userRepository.save(user);
            SmsDto smsdto = new SmsDto();
            smsdto.setMessage(String.valueOf(otp));
            smsdto.setNumber(user.getMobileNumber());
            rmsMailService.sendOtpSms(smsdto);
            OtpTimeOut(timer, id);
            return new OtpResponseDto() {{
                setStatus(true);
                setMessage("OTP Send Success");
            }};
        } catch (Exception e) {
            return new OtpResponseDto() {{
                setStatus(false);
                setMessage(e.getMessage());
            }};

        }

    }

    public void OtpTimeOut(int secondsToSleep, Long userId) {

        new Thread(new Runnable() {
            @Override
            public void run() {

                try {
                    System.out.println("Thread sleep for " + secondsToSleep);
                    Thread.sleep(secondsToSleep * 1000);
                    Random random = new Random();
                    int newOtp = random.nextInt(1000000 - 100000) - 100000;
                    Optional<User> byId = userRepository.findById(userId);
                    User user = null;
                    if (byId.isPresent()) {
                        user = byId.get();
                    }
                    user.setPhoneOtp(newOtp);
                    userRepository.save(user);
                    System.out.println("========Otp time out===========" + secondsToSleep);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }

            }
        }).start();
    }


    public List<User> getAllByUserType(String userType) {

        return userRepository.findAllByUserTypeAndIsActiveAndIsDelete(userType, true, false);
    }

    public String getUserByEmailId(String emailId) {
        User user = userRepository.findByEmailIdOrMobileNumber(emailId, emailId);

        if (user == null) {
            return "User not found!.";
        }

        if (emailId.contains("@")) {
            if (user != null && !user.getIsActive()) {
                return "Your email address is not verified. Please verify your email address first.";
            }
        }


        if (!emailId.contains("@")) {
            if (!user.getPhoneIsVerified()) {
                return "Your Mobile Number is not verified. Please verify your Mobile Number first.";
            }
        }


        if (user != null && user.getIsActive()) {
            return "OK";
        }

        if (user != null) {
            return "User not found";
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public List<User> getAllByDutyType(UserType type) {
      return  userRepository.findAllByDutyType(type);
    }
}
