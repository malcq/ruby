export default function({ user }: IGlobalState): boolean {
  return !!(user && (
    user.loading
    || (user.accessToken && user.clientToken && user.uid)
  ));
}