export interface IRepositoryDetails {
  url: string;
  name: string;
  userName: string;
}
export const getRepositoryDetails: (
  respoitoryUrl: string
) => IRepositoryDetails = repository => {
  const re = new RegExp("https://github.com/(.*)/(.*).git");
  const results = re.exec(repository);
  return {
    url: results[0],
    name: results[2],
    userName: results[1]
  };
};
