package com.ibcs.idsdp.rdpprtapp.web.dto.ecnecDTO;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Data
public class EcnecProjectInfoDTO {
    private String projectName;
    private String projectNameBn;
    private String code;
    private String projectType;
    private boolean isMinistryProject;
    private String approvalStatus;
    private boolean isFastTrackProject;
    private boolean isRevised;
    private int revisedNumber;
    private LocalDateTime approvalDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String parentProjectCode;
    private Double totalProjectCost;
    private Double gob;
    private Double projectAid;
    private String projectAidSourceName;
    private Double ownFund;
    private Double other;
    private Double rvTotalProjectCost;
    private Double rvGob;
    private Double rvProjectAid;
    private String rvProjectAidSourceName;
    private Double rvOwnFund;
    private Double rvOther;
    private String sourceType;
    private String sourceOfFinance;
    private String sponsoringMinistry;
    private List<String> implementingAgency;
    private String planningDivision;
    private String sector;
    private String peojectPurpose;
    private String peojectActivity;
    private String ecnecProjectId;
    private Integer ecnecMeetingNumber;
    private LocalDate meetingDate;
    private String summary;
    private String benefits;
    private List<DivisionGeoDTO> location;
}
