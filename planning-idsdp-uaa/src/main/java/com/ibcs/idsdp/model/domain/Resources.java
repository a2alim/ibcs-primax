package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Date;

import static com.ibcs.idsdp.constants.TableNameConstants.RESOURCES_TABLE_NAME;

@Data
@Entity
@Table(name = RESOURCES_TABLE_NAME)
public class Resources extends BaseEntity {
    @NotNull
    private String title;
    @NotNull
    private String category;
    @NotNull
    @Column(name="summary", columnDefinition = "TEXT")
    private String summary;
    private String year;
    private String month;
    private Date publishedDate;
    private String attachmentName;
    private String attachmentUrl;
    private Boolean isActive;
}
