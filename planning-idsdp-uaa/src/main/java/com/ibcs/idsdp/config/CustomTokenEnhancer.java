package com.ibcs.idsdp.config;

import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.services.UserService;
import com.ibcs.idsdp.web.dto.CustomUser;
import com.ibcs.idsdp.web.dto.response.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class CustomTokenEnhancer extends JwtAccessTokenConverter {

	@Autowired
	private UserService userService;

	// For Create OAuth2AccessToken
	@Override
	public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
		CustomUser user = (CustomUser) authentication.getPrincipal();
		Map<String, Object> info = new LinkedHashMap<>(accessToken.getAdditionalInformation());
		ResponseEntity<User> userResponseResponseEntity = userService.getUserById(Long.parseLong(user.getId()));
		if (user.getId() != null)
			info.put("id", user.getId());
		if (user.getName() != null)
			info.put("name", user.getName());
		if (user.getUsername() != null)
			info.put("userName", user.getUsername());
		if (!user.getAppAccess().isEmpty())
			info.put("appAccess", user.getAppAccess());

		info.put("dutyType", userResponseResponseEntity.getBody().getDutyType());
		info.put("userType", userResponseResponseEntity.getBody().getUserType());
		info.put("isInstitutional", userResponseResponseEntity.getBody().getIsInstitutional());
		info.put("organigationName", userResponseResponseEntity.getBody().getOrganigationName());

		//System.out.println(userResponseResponseEntity.getBody());
		DefaultOAuth2AccessToken customAccessToken = new DefaultOAuth2AccessToken(accessToken);
		customAccessToken.setAdditionalInformation(info);
		return super.enhance(customAccessToken, authentication);
	}
}
