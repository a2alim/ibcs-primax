package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "fsp_vendor_managements")
@EntityListeners(AuditingEntityListener.class)
public class VendorManagement extends BaseEntity {

    private String vendorName;

    private String description;

    private String contactPersonName;

    private String address;

    private String email;

    private Date vendorFormationDate;

    private Long vendorApprovalAttachmentId;

    private Long fspMasterId;

}
