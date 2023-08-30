package com.ibcs.idsdp.model.domain;


import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "user_profile")
@Data
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String presentAddress;
    private String permanentAddress;
    private String profileImageUrl;
    private String signatureImageUrl;

}
