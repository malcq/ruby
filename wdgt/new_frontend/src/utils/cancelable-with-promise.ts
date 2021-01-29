export default interface CancelableWithPromise<T> {
  promise: Promise<T>;
	cancel: () => void;
}