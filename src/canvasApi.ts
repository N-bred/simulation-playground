export type Options = {
  background_color: string;
  rectActive_color: string;
  rectInactive_color: string;
  rect_size: number;
};

export default (ctx: CanvasRenderingContext2D, width: number, height: number, options: Options) => {
  return {
    setBackground: () => {
      ctx.fillStyle = options.background_color;
      ctx.fillRect(0, 0, width, height);
    },
    rect: (isActive: boolean, x: number, y: number) => {
      ctx.fillStyle = isActive ? options.rectActive_color : options.rectInactive_color;
      ctx.fillRect(x, y, options.rect_size, options.rect_size);
    },
  };
};
