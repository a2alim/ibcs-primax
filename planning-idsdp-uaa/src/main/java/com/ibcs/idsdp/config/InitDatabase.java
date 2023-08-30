package com.ibcs.idsdp.config;

import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.model.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class InitDatabase {

    private final UserRepository userRepository;
	
	// For Create new user
    @Bean
    public void insert() {
        User user = new User();
        user.setUserId("1");
        user.setName("Admin");
        user.setEmailId("admin@gmail.com");
        user.setPassword("$2a$10$FZDlienJ4szXQB2v.7ZXN.iCG/SgIxgOq64MLQiFP.oFbAzfApQ4a");
        user.setDesignation("Admin");
        user.setMobileNumber("01813541542");
        user.setIsActive(true);
        user.setIsDelete(false);
        user.setTfa_Enabled(false);
        if (isEmailAlreadyPresent("admin@gmail.com")) {
            System.out.println("Admin profile is active");
        } else {
            userRepository.save(user);
            System.out.println("New Admin profile added");
        }
    }
	// For checking duplicate email
    private boolean isEmailAlreadyPresent(String email) {
        return userRepository.existsByEmailId(email);
    }
}
