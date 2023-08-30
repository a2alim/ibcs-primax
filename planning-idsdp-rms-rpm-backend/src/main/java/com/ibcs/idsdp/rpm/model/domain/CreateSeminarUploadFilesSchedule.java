package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_create_seminar_upload_files")
public class CreateSeminarUploadFilesSchedule extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "m2_create_seminar_id")
    private CreateSeminar m2CreateSeminarId;

    @Column(name = "file_title", nullable = false)
    private String fileTitle;

    @Column(name = "file_download_url")
    private String fileDownloadUrl;

    @Column(name = "bucket_name")
    private String bucketName;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "is_editable",columnDefinition = "boolean default false")
    private Boolean isEditable;


}
