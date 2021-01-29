export class DomService {
  private images: HTMLImageElement[] = [];

  preloadImage(fileUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {resolve()};
      setTimeout(() => reject(new Error('Timeout')), 5000);
      image.src = fileUrl;
      this.images.push(image);
    });
  }
}

export const domService = new DomService();
