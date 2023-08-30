package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;
import com.ibcs.idsdp.rpm.web.dto.response.LinkupProposalWithEvaluatorsResponseDto;

import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_create_seminar_time_schedule")
public class CreateSeminarTimeSchedule extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "m2_create_seminar_id")
    private CreateSeminar m2CreateSeminarId;

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "position_in_seminar")
    private String positionInSeminar;

    @ManyToOne(optional = true,fetch = FetchType.EAGER)
    @JoinColumn(name = "m1_researcher_proposal_id")
    private ResearcherProposal m1ResearcherProposalId;

    @Column(name = "schedule_name")
    private String scheduleName;

    @Column(name = "concerned_person_user_id")
    private Long concernedPersonUserId;
    
    @Column(name = "review_time")
    private String reviewTime;
    
    @Column(name = "mobile")
    private String mobile;
    
    @Column(name = "email_address")
    private String emailAddress;
    
    @Column(name = "designation")
    private String designation;
    
    @Column(name = "name")
    private String name;   
    

    @Transient
    private UserResponse user;  
    
	@Transient
	private DivisionResponse divisionDto;

	@Transient
	private ZillaResponse districtDto;

	@Transient
	private UpaZillaResponse upzilaDto;

	@Transient
	private DivisionResponse preDivisionDto;

	@Transient
	private ZillaResponse preDistrictDto;

	@Transient
	private UpaZillaResponse preUpzilaDto;
	
	@Transient
	private LinkupProposalWithEvaluatorsResponseDto linkupProposalWithEvaluatorsResponseDto;

}
