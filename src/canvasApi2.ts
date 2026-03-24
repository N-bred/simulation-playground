export default (ctx: CanvasRenderingContext2D) => {
  return {
    background: (w: number, h: number, color: string = "#000") => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
    },
    rect: (x: number, y:number, w:number, h: number, color: string = "#000") => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    },
  };
};
