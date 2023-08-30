package com.ibcs.idsdp.common.model.domain;

import com.ibcs.idsdp.config.model.AccessTokenDetail;
import lombok.Data;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@MappedSuperclass
@Data
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uuid;

    @NotNull
    private Boolean isDeleted;

    @NotNull
    private String createdBy;

    @NotNull
    private LocalDate createdOn;

    private String updatedBy;

    private LocalDate updatedOn;

    @PrePersist
    public void onCreate(){
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        setCreatedBy(accessTokenDetail.getUserName());
    }

    @PreUpdate
    public void onUpdate(){
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        setUpdatedBy(accessTokenDetail.getUserName());
    }

}
