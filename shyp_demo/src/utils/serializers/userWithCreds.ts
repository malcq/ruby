import userSerializer from './user';

export default function userWithCreds(response){
  const user = userSerializer(response);
  user.accessToken = response.headers['access-token'];
  user.uid = response.headers.uid;
  user.clientToken = response.headers.client;
  user.impersonator = response.headers.impersonator;
  return user;
}