package com.ibcs.idsdp.common.model.domain;

import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;


@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "attachment")
@Data
public class Attachment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String fileType;
    private String fileName;
    private String urlPath;
    private String description;
}
