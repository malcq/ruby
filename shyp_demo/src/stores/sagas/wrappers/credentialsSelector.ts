export default function credentialsSelector(state: IGlobalState): ICredentials {
  if(!state || !state.user) {
    return {
      uid: '',
      accessToken: '',
      clientToken: '',
      impersonator: null
    }
  }
  return {
    uid: state.user.uid || '',
    accessToken: state.user.accessToken || '',
    clientToken: state.user.clientToken || '',
    impersonator: state.user.impersonator,
  }
}