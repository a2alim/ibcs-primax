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

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted;

    @NotNull
    @Column(name = "created_by", nullable = false, length = 20)
    private String createdBy;

    @NotNull private LocalDate createdOn;

    @NotNull
    @Column(name = "updated_by", nullable = false, length = 20)
    private String updatedBy;

    private LocalDate updatedOn;

    @PrePersist
    public void onCreate() {
        try {
            AccessTokenDetail accessTokenDetail =
                    (AccessTokenDetail)
                            ((OAuth2AuthenticationDetails)
                                    SecurityContextHolder.getContext().getAuthentication().getDetails())
                                    .getDecodedDetails();
            setCreatedBy(accessTokenDetail.getId());
            setCreatedOn(LocalDate.now());
            setUpdatedBy(accessTokenDetail.getId());
            setIsDeleted(false);
        } catch (Exception ex) {
            setUpdatedBy("anonymous user");
            setUpdatedOn(LocalDate.now());
        }
    }

    @PreUpdate
    public void onUpdate() {
        try {
            AccessTokenDetail accessTokenDetail =
                    (AccessTokenDetail)
                            ((OAuth2AuthenticationDetails)
                                    SecurityContextHolder.getContext().getAuthentication().getDetails())
                                    .getDecodedDetails();
            setUpdatedBy(accessTokenDetail.getId());
            setUpdatedOn(LocalDate.now());
        } catch (Exception ex) {
            setUpdatedBy("anonymous user");
            setUpdatedOn(LocalDate.now());
        }
    }
}
