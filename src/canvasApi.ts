export type Options = {
  backgroundColor: string;
  rectActiveColor: string;
  rectInactiveColor: string;
  rectSize: number;
};

export default (ctx: CanvasRenderingContext2D, width: number, height: number, options: Options) => {
  return {
    setBackround: () => {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    },
    rect: (isActive: boolean, x: number, y: number) => {
      ctx.fillStyle = isActive ? options.rectActiveColor : options.rectInactiveColor;
      ctx.fillRect(x * options.rectSize, y * options.rectSize, options.rectSize, options.rectSize);
    },
  };
};
