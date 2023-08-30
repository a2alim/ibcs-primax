import {environment} from '../../../../../environments/environment';

export const QUESTION_TYPE = environment.ibcs.configurationApiEndPoint + 'questionType/';
export const GET_ACTIVE_QUESTION = QUESTION_TYPE + 'activeQuestion';
export const GET_ACTIVE_QUESTION_LIST = QUESTION_TYPE + 'activeQuestionList';
