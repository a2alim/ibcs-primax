package com.ibcs.idsdp.dpptapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "dpp_tapp_ao_go")
@EntityListeners(AuditingEntityListener.class)
public class DppTappGo extends BaseEntity {

    private String pcUuid;
    private String recordNo;
    private Date recordDate;
    private String ecnecMeetingInfo;
    private Date ecnecMeetingDate;
    @Column(columnDefinition = "TEXT")
    private String projectOtherInfo;
    private String orderType;
    private String seniorAssistantHead;
    private String wing;
}
