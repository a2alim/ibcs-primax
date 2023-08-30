package com.ibcs.idsdp.model.domain;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Created by : rakibul.hasan on 4/21/2022 1:55 PM
 * github : https://github.com/rhmtechno
 */
@Data
@Entity
public class SessionData {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    @Column(name = "session_id")
    private String sessionId;
    @Column(name ="access_token",columnDefinition = "TEXT")
    private String accessToken;
    @Column(name ="doptor_token",columnDefinition = "TEXT")
    private String doptorToken;
    @CreationTimestamp
    private LocalDate creationTime;
}
