package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Committee;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Member;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.CommitteeRepository;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.MemberRepository;
import com.ibcs.idsdp.feasibilitystudy.services.CommitteeService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.CommitteeDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.CommitteeRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommitteeServiceImp extends BaseService<Committee, CommitteeDTO> implements CommitteeService {

    private final CommitteeRepository committeeRepository;
    private final AttachmentRepository attachmentRepository;
    private final IdGeneratorComponent idGeneratorComponent;

    CommitteeServiceImp(CommitteeRepository committeeRepository, MemberRepository memberRepository,
                        AttachmentRepository attachmentRepository, IdGeneratorComponent idGeneratorComponent) {
        super(committeeRepository);
        this.committeeRepository = committeeRepository;
        this.attachmentRepository = attachmentRepository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for create Committee
     *
     * @param committeeDTO
     * @return
     */
    @Override
    public CommitteeDTO createCommittee(CommitteeDTO committeeDTO) {
        Committee committee = new Committee();
        committee.setCommitteeName(committeeDTO.getCommitteeName());
        committee.setDescription(committeeDTO.getDescription());
        committee.setDateOfFormation(committeeDTO.getDateOfFormation());
        committee.setFspMasterId(committeeDTO.getFspMasterId());
        committee.setAttachmentId(committeeDTO.getAttachmentId() == null ? null : attachmentRepository.findById(committeeDTO.getAttachmentId()).get());
        committee.setIsDeleted(false);
        committee.setUuid(idGeneratorComponent.generateUUID());
        committee.setCreatedBy("user");
        committee.setCreatedOn(LocalDate.now());
        List<Member> memberList = new ArrayList<>();
        committeeDTO.getMembers().forEach(memberDTO -> {
            Member member = new Member();
            BeanUtils.copyProperties(memberDTO, member);
            member.setIsDeleted(false);
            member.setUuid(idGeneratorComponent.generateUUID());
            member.setCreatedBy("user");
            member.setCreatedOn(LocalDate.now());
            memberList.add(member);
        });
        committee.setMembers(memberList);
        committeeRepository.save(committee);
        BeanUtils.copyProperties(committee, committeeDTO);
        return committeeDTO;
    }

    /**
     * for get Committee List By FspMasterId
     *
     * @param request
     * @return
     */
    @Override
    public Page<CommitteeDTO> getCommitteeListByFspMasterId(CommitteeRequest request) {
        Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<Committee> ePage = committeeRepository.findAllByFspMasterIdAndIsDeletedOrderByIdDesc(request.getFspMasterId(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * for update Committee WithMember
     *
     * @param committeeDTO
     * @return
     */
    @Override
    public CommitteeDTO updateCommitteeWithMember(CommitteeDTO committeeDTO) {
        Committee committee = committeeRepository.findByUuidAndIsDeleted(committeeDTO.getUuid(), false).get();
        committee.setUpdatedBy("user");
        committee.setUpdatedOn(LocalDate.now());
        committee.setCommitteeName(committeeDTO.getCommitteeName());
        committee.setDescription(committeeDTO.getDescription());
        committee.setDateOfFormation(committeeDTO.getDateOfFormation());
        committee.setAttachmentId(committeeDTO.getAttachmentId() == null ? null : attachmentRepository.findById(committeeDTO.getAttachmentId()).get());
        committee.getMembers().clear();
        List<Member> memberList = new ArrayList<>();
        committeeDTO.getMembers().forEach(memberDTO -> {
            Member member = new Member();
            BeanUtils.copyProperties(memberDTO, member);
            member.setUuid(idGeneratorComponent.generateUUID());
            member.setIsDeleted(false);
            member.setCreatedBy("user");
            member.setCreatedOn(LocalDate.now());
            member.setUpdatedBy("user");
            member.setUpdatedOn(LocalDate.now());
            memberList.add(member);
        });
        committee.setMembers(memberList);
        committeeRepository.save(committee);
        return committeeDTO;
    }

}
