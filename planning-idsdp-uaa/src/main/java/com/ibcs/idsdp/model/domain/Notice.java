package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.Date;

import static com.ibcs.idsdp.constants.TableNameConstants.NOTICE_TABLE_NAME;

@Data
@Entity
@Table(name = NOTICE_TABLE_NAME)
public class Notice extends BaseEntity {
    @NotNull
    private String title;
    @NotNull
    @Column(name="summary", columnDefinition = "TEXT")
    private String summary;
    private Date publishedDate;
    private String attachmentUrl;
    private Boolean isActive;
}
