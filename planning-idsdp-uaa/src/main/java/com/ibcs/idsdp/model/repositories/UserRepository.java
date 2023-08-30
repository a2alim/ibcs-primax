package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.enums.UserType;
import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.enums.UserGroup;
import com.ibcs.idsdp.web.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByIsDelete(Boolean isDelete);

    boolean existsByEmailId(String emailId);
    
    boolean existsByMobileNumber(String mobileNumber);

    User findByUserId(String userId);

    User findByEmailId(String emailId);

    Optional<User> findAllByEmailId(String emailId);

    User findByUserIdAndUserType(String userId, String userType);

    Optional<User> findByUserIdAndIsActiveAndIsDeleteAndUserType(String userId, Boolean isActive, Boolean isDelete, String userType);

    Optional<User> findByUserIdAndIsActiveAndIsDelete(String userId, Boolean isActive, Boolean isDelete);

    User findByUserIdAndIsDelete(String userId, Boolean isDelete);

    Page<User> findAllByIsDeleteOrderByIdDesc(boolean isDeleted, Pageable pageable);

    Page<User> findAllByNameLikeIgnoreCaseOrEmailIdLikeIgnoreCaseOrMobileNumberLikeAndIsDeleteOrderByIdDesc(String name, String email, String mobile,
                                                                                                           boolean isDeleted, Pageable pageable);
    Page<User> findByIdInAndIsDeleteOrderByIdDesc(Set<Long> userIds, boolean isDeleted, Pageable pageable);

    List<User> findAllByUserGroupId(UserGroup userGroup);

    List<User> findByIdIn(Set<Long> userIds);

    Optional<User> findByIdAndPhoneOtp(Long userId, Integer otp);

    List<User> findAllByUserTypeAndIsActiveAndIsDelete(String userType, boolean isActive, boolean isDeleted);

    User findByEmailIdOrMobileNumberAndPhoneIsVerified(String emailIdOrMobileNumber, String emailIdOrMobileNumber1, boolean b);


    User findByEmailIdOrMobileNumber(String emailId, String emailId1);

    User findByEmailIdAndIsActive(String emailId, boolean b);

    List<User> findAllByDutyType(UserType type);
}
