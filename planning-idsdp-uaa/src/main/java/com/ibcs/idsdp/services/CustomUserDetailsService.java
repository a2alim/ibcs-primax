package com.ibcs.idsdp.services;


import com.ibcs.idsdp.model.repositories.OAuthRepository;
import com.ibcs.idsdp.web.dto.CustomUser;
import com.ibcs.idsdp.web.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.common.exceptions.UnauthorizedUserException;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private OAuthRepository oAuthRepository;

	/**
	 * For finding user and permission
	 * @param username
	 * @return
	 * @throws UsernameNotFoundException
	 */
	@Override
	public UserDetails loadUserByUsername(String usernameOrMobileNumber) throws UsernameNotFoundException {

		UserDto userDto = null;

		try {
			userDto = oAuthRepository.getUserDetails(usernameOrMobileNumber);
			if (userDto != null && userDto.getId() != null && !"".equalsIgnoreCase(String.valueOf(userDto.getId()))) {
				if (!userDto.getIsDelete()) {
					if (userDto.getIsActive()) {
						CustomUser customUser = new CustomUser(userDto);
						return customUser;
					} else {
						throw new UnauthorizedUserException("User " + usernameOrMobileNumber + " is not active");
					}
				} else {
					throw new UsernameNotFoundException("User " + usernameOrMobileNumber + " was not found in the database");
				}
			} else {
				throw new UsernameNotFoundException("User " + usernameOrMobileNumber + " was not found in the database");
			}
		} catch (Exception e) {
			throw new UsernameNotFoundException("User " + usernameOrMobileNumber + " was not found in the database");
		}

	}

}
