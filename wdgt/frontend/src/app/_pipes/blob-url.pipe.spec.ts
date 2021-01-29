import { BlobUriPipe } from './blob-url.pipe';

describe('BlobUriPipe', () => {
  it('create an instance', () => {
    const pipe = new BlobUriPipe();
    expect(pipe).toBeTruthy();
  });
});
