import { environment } from '../../../../../environments/environment';

export const RESEARCHER_LIST = environment.ibcs.rpmBackend + 'api/view-researcher';
export const RESEARCHER_LIST_PUBLIC = environment.ibcs.rpmBackend + 'api/view-research-public';

export const FIND_ALL_BY_ST_FISCAL_YEAR_ID = '/find-all-by-st-fiscal-year-id';
export const FIND_ALL_BY_ST_FISCAL_YEAR_ID_AND_PROFILE_ID = '/find-all-by-st-fiscal-year-id-and-profile-id';
export const RESEARCHER_GRID_LIST = '/researcher-grid-list';
export const VIEW_RESERCHER_PROFILE = '/view-resercher-profile-by-profile-uuid';
export const VIEW_RESEARCHER_PROFILE_BY_ID = '/view-researcher-profile-by-profile-id';
export const FIND_BY_KEY_WORD = '/find-by-key-word';

export const FIND_BY_FISCAL_YEAR_ID_AND_RESEARCH_CAT_ID = '/get-list-by-fiscalYearId-ResearchCatId';



