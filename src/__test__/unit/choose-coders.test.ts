import _ from "lodash";
import * as chooseCoders from "../../choose-coders";

describe("chooseCoders", () => {
  test("for one coders, should return the same as winner", () => {
    expect(chooseCoders.getWinner(["Test1"])).toBe("Test1");
  });
  test("for more coders, should return one of them as winner", () => {
    const possibleCoders = ["Test1", "Test2", "Test3"];
    expect(possibleCoders).toContain(chooseCoders.getWinner(possibleCoders));
  });
  test("get list of coders", () => {
    process.env.CODERS = "Test1,Test2,Test3";
    expect(chooseCoders.getListOfCoders()).toMatchObject(["Test1", "Test2", "Test3"]);
  });
  test("main called winners 3 times", () => {
    process.env.CODERS = "Test1,Test2,Test3";
    jest.spyOn(chooseCoders, "getWinner");
    chooseCoders.default();
    expect(chooseCoders.getWinner).toHaveBeenCalledTimes(3);
  });
  test("main returns 3 winners", () => {
    process.env.CODERS = "Test1,Test2,Test3";
    const possibleCoders = ["Test1", "Test2", "Test3"];
    const winners = chooseCoders.default();
    const result = _.isEmpty(_.xor(winners.sort(), possibleCoders));
    expect(result).toBeTruthy();
  });
  test("main returns 3 different winners", () => {
    process.env.CODERS = "Test1,Test2,Test3";
    const winners = chooseCoders.default();
    const result = _.isEqual(winners, _.uniq(winners));
    expect(result).toBeTruthy();
  });
});
