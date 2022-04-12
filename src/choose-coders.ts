export const getWinner = (coders: string[]): string => {
  return coders[Math.floor(Math.random() * coders.length)];
};
export const getListOfCoders = (): string[] => {
  return process.env.CODERS.split(",");
};

const chooseCoders = () => {
  const winners = [];
  let candidates = getListOfCoders();
  for (let index = 0; index < 3; index++) {
    const winner = getWinner(candidates);
    winners.push(winner);
    candidates = candidates.filter((coder) => coder !== winner);
  }
  return winners;
};
export default chooseCoders;
