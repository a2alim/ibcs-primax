package com.ibcs.idsdp.rpm.services.jasperService;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.services.implementation.LinkupProposalWithEvaluatorsServiceImpl;
import com.ibcs.idsdp.rpm.web.dto.response.LinkupProposalWithEvaluatorsResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Created by : rakibul.hasan on 2/9/2022 11:30 AM
 * github : https://github.com/rhmtechno
 */
@Service
@AllArgsConstructor
public class LinkupProposalWithEvaluatorsHelperService {

    private final RmsConfigurationClientService rmsConfigurationClientService;
    private final LinkupProposalWithEvaluatorsServiceImpl linkupProposalWithEvaluatorsService;

    public List<ExpertEvaluatorResponseDto> getExpertEvaluators(IdSetRequestBodyDTO requestBodyDTO) {
        List<ExpertEvaluatorResponseDto> items = new ArrayList<>();

        try {
            Response<ExpertEvaluatorResponseDto> byExpertEvaluatorIdSet = rmsConfigurationClientService.getByExpertEvaluatorIdSet(requestBodyDTO);
            if (byExpertEvaluatorIdSet.isSuccess()) {
                items = byExpertEvaluatorIdSet.getItems();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        return items;
    }

    //get linkWithEvaluator list

    public List<LinkupProposalWithEvaluatorsResponseDto> getLinkWithEvaluators() {
        List<LinkupProposalWithEvaluatorsResponseDto> lists = new ArrayList<>();
        try {
            Response<LinkupProposalWithEvaluatorsResponseDto> linkupProposalWithEvaluatorsServiceList = linkupProposalWithEvaluatorsService.getList();
            if (linkupProposalWithEvaluatorsServiceList.isSuccess()) {
                lists = linkupProposalWithEvaluatorsServiceList.getItems();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return lists;

    }


    public List<LinkupProposalWithEvaluatorsResponseDto> getAvailableProposal(List<Long> ids) {
        List<LinkupProposalWithEvaluatorsResponseDto> newLists = new ArrayList<>();
        List<LinkupProposalWithEvaluatorsResponseDto> linkWithEvaluators = getLinkWithEvaluators();
        ids.forEach(f -> linkWithEvaluators.stream().filter(data -> Objects.equals(f, data.getResearcherProposalId())).findFirst().ifPresent(newLists::add));
        System.out.println("");
        return newLists;
    }


    public String getStProfileOfExpertEvaluator(List<LinkupProposalWithEvaluatorsResponseDto> linkWithEvaluators, List<ExpertEvaluatorResponseDto> expertEvaluators, Long id) {

        if(expertEvaluators==null){
            return "";
        }
        String data = "";
        Optional<LinkupProposalWithEvaluatorsResponseDto> lw = linkWithEvaluators.stream().filter(f -> Objects.equals(f.getResearcherProposalId(), id)).findFirst();
        if (lw.isPresent()) {
            if (lw.get().getStProfileOfExpertEvaluatorsId() != null) {

                Optional<ExpertEvaluatorResponseDto> ev = expertEvaluators.stream().filter(f2 -> Objects.equals(f2.getId(), lw.get().getStProfileOfExpertEvaluatorsId())).findFirst();

                if (ev.isPresent()) {
                    data = ev.get().getName() == null ? "" : ev.get().getName();

                }

            }

        }
        return data;
    }
    
    public String getStProfileOfExpertEvaluatorForProMarks(List<LinkupProposalWithEvaluatorsResponseDto> linkWithEvaluators, List<ExpertEvaluatorResponseDto> expertEvaluators, Long id) {

        if(expertEvaluators==null){
            return "";
        }
        
        String data = "";
        Optional<LinkupProposalWithEvaluatorsResponseDto> lw = linkWithEvaluators.stream().filter(f -> Objects.equals(f.getResearcherProposalId(), id)).findFirst();
        if (lw.isPresent()) {
            if (lw.get().getStProfileOfExpertEvaluatorsIdForProMarks() != null) {

                Optional<ExpertEvaluatorResponseDto> ev = expertEvaluators.stream().filter(f2 -> Objects.equals(f2.getId(), lw.get().getStProfileOfExpertEvaluatorsIdForProMarks())).findFirst();

                if (ev.isPresent()) {
                    data = ev.get().getName() == null ? "" : ev.get().getName();

                }

            }

        }
        return data;
    }
}
