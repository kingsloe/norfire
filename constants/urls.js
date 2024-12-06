export const API_BASE_URL = 'http://192.168.43.250:8000/api';
export const FAMILY_BASE_URL = `${API_BASE_URL}/family`;
export const FUNERAL_BASE_URL = `${API_BASE_URL}/funeral`;
export const FEES_BASE_URL = `${API_BASE_URL}/fees`;


export const ENDPOINTS = {

    getTokenUrl: `${API_BASE_URL}/token/`,

    refreshTokenUrl: `${API_BASE_URL}/token/refresh/`,
    
    getFamilyMembersUrl: `${FAMILY_BASE_URL}/family-members/`,

    getFamilyMembersListUrl: `${FAMILY_BASE_URL}/family-members/get_family_members_list/`,

    getSubFamilyListUrl: `${FAMILY_BASE_URL}/family-members/get_creator_sub_families/`,

    getPositionListUrl: `${FAMILY_BASE_URL}/family-members/get_position_list/`,

    getFuneralInfoUrl: `${FUNERAL_BASE_URL}/funeral-info/get_funeral_info/`,

    getTotalFuneralFeeUrl: `${FEES_BASE_URL}/take-funeral-fee/get_total_funeral_fee/`,

}
