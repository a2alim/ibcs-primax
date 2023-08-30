import {ProjectMovementStageConstant} from "./project-movement-stage-constant";
import {UserGroup} from "../../../shared/enum/user-group.enum";

export class StatusStage {

    getProjectStatus(status: string) {
        if (status === ProjectMovementStageConstant.AGENCY_DESK) {
            return 'এজেন্সী এর ডেস্ক';
        } else if (status === ProjectMovementStageConstant.AGENCY_HEAD) {
            return 'এজেন্সী এর হেড';
        } else if (status === ProjectMovementStageConstant.MINISTRY_HEAD) {
            return 'মিনিস্ট্রি এর হেড';
        } else if (status === ProjectMovementStageConstant.MINISTRY_DESK) {
            return 'মিনিস্ট্রি এর ডেস্ক';
        } else if (status === ProjectMovementStageConstant.PLANNING_COMMISSION_HEAD) {
            return 'পরিকল্পনা কমিশনের হেড';
        } else if (status === ProjectMovementStageConstant.PLANNING_COMMISSION_DESK) {
            return 'পরিকল্পনা কমিশনের ডেস্ক';
        } else if (status === ProjectMovementStageConstant.PLANNING_MINISTER) {
            return 'পরিকল্পনা মন্ত্রী';
        } else if (status === ProjectMovementStageConstant.PLANNING_MINISTER_APPROVED) {
            return 'মাননীয় পরিকল্পনা মন্ত্রী দ্বারা অনুমোদিত';
        } else if (status === ProjectMovementStageConstant.IN_ECNEC) {
            return 'একনেকে আছে';
        } else if (status === ProjectMovementStageConstant.ECNEC_APPROVED) {
            return 'একনেক দ্বারা অনুমোদিত';
        } else if (status === ProjectMovementStageConstant.MINISTRY_APPROVED) {
            return 'মিনিস্ট্রি দ্বারা অনুমোদিত';
        } else if (status === ProjectMovementStageConstant.MINISTERIAL_MEETING_NOTICE) {
            return 'মিনিস্টারিয়াল মিটিং এর নোটিশ';
        } else if (status === ProjectMovementStageConstant.MINISTERIAL_MEETING_HELD) {
            return 'মিনিস্টারিয়াল মিটিং অনুষ্ঠিত';
        } else if (status === ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE) {
            return 'প্রজেক্ট স্ক্রুটিনি কমিটি এর মিটিং নোটিশ';
        } else if (status === ProjectMovementStageConstant.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD) {
            return 'প্রজেক্ট স্ক্রুটিনি কমিটি এর মিটিং অনুষ্ঠিত';
        } else if (status === ProjectMovementStageConstant.DPEC_MEETING_NOTICE) {
            return 'ডিপিইসি এর মিটিং নোটিশ';
        } else if (status === ProjectMovementStageConstant.DPEC_MEETING_HELD) {
            return 'ডিপিইসি এর মিটিং অনুষ্ঠিত';
        } else if (status === ProjectMovementStageConstant.DSPEC_MEETING_NOTICE) {
            return 'ডিএসপিইসি এর মিটিং নোটিশ';
        } else if (status === ProjectMovementStageConstant.DSPEC_MEETING_HELD) {
            return 'ডিএসপিইসি এর মিটিং অনুষ্ঠিত';
        } else if (status === ProjectMovementStageConstant.MINISTRY_REJECTED) {
            return 'মিনিস্ট্রি ডিভিশন দ্বারা বাতিল কৃত';
        } else if (status === ProjectMovementStageConstant.UNDER_EXAMINE) {
            return 'পরীক্ষাধীন';
        } else if (status === ProjectMovementStageConstant.PEC_MEETING_NOTICE) {
            return 'পিইসি এর মিটিং নোটিশ';
        } else if (status === ProjectMovementStageConstant.PEC_MEETING_HELD) {
            return 'পিইসি এর মিটিং অনুষ্ঠিত';
        } else if (status === ProjectMovementStageConstant.ATTACH_POTRO_JARI) {
            return 'পত্র জারি সংযুক্ত করা হয়েছে';
        } else if (status === ProjectMovementStageConstant.ATTACH_POTRO_JARI_MINISTRY) {
            return 'মন্ত্রণালয়ে পত্র জারি সংযুক্ত করা হয়েছে';
        } else if (status === ProjectMovementStageConstant.ATTACH_POTRO_JARI_PLANCOMM) {
            return 'পরিকল্পনা কমিশনে পত্র জারি সংযুক্ত করা হয়েছে';
        } else if (status === ProjectMovementStageConstant.ECNEC_OFFICERS) {
            return 'একনেক অফিসার';
        } else if (status === ProjectMovementStageConstant.ECNEC_DESK) {
            return 'একনেক ডেস্ক';
        } else if (status === ProjectMovementStageConstant.ECNEC_CONDITIONAL_APPROVE) {
            return 'একনেক শর্তসাপেক্ষে অনুমোদন';
        } else if (status === ProjectMovementStageConstant.UNAPPROVED_BY_ECNEC) {
            return 'একনেক অননুমোদিত';
        } else if (status === ProjectMovementStageConstant.SPEC_MEETING_NOTICE) {
            return 'এসপিইসি এর মিটিং নোটিশ';
        } else if (status === ProjectMovementStageConstant.SPEC_MEETING_HELD) {
            return 'এসপিইসি এর মিটিং অনুষ্ঠিত';
        } else {
            return '';
        }
    }

    getUserGroup(status: string) {
        if (status === UserGroup.AGENCY_DESK) {
            return 'এজেন্সী এর ডেস্ক';
        } else if (status === UserGroup.AGENCY_HEAD) {
            return 'এজেন্সী এর হেড';
        } else if (status === UserGroup.MINISTRY_HEAD) {
            return 'মিনিস্ট্রি এর হেড';
        } else if (status === UserGroup.MINISTRY_DESK) {
            return 'মিনিস্ট্রি এর ডেস্ক';
        } else if (status === UserGroup.PLANNING_HEAD) {
            return 'প্ল্যানিং এর হেড';
        } else if (status === UserGroup.PLANNING_DESK) {
            return 'প্ল্যানিং এর ডেস্ক';
        } else if (status === UserGroup.PLANNING_MINISTER) {
            return 'প্ল্যানিং মিনিস্টার';
        } else if (status === UserGroup.ECNEC) {
            return 'একনেক';
        } else {
            return '';
        }
    }
}
