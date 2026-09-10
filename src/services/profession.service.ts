import httpService from "./http.service";

const apiEndpoint = "professions";

const professionService = {
  get: async () => {
    const { data } = await httpService.get(apiEndpoint);
    return data;
  },
};

export default professionService;
