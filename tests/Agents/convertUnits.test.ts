import { expect } from "chai";
import { convertUnits, toWei, fromWei } from "../../agents/functions";

describe("Unit Conversion Functions", () => {
  it("should convert between units correctly", () => {
    expect(convertUnits("1", "ether", "wei")).to.equal("1000000000000000000");
    expect(convertUnits("1000000000000000000", "wei", "ether")).to.equal("1.0");
    expect(convertUnits("1", "gwei", "wei")).to.equal("1000000000");
  });

  it("should convert to wei correctly", () => {
    expect(toWei("1", "ether")).to.equal("1000000000000000000");
    expect(toWei("1", "gwei")).to.equal("1000000000");
  });

  it("should convert from wei correctly", () => {
    expect(fromWei("1000000000000000000", "ether")).to.equal("1.0");
    expect(fromWei("1000000000", "gwei")).to.equal("1.0");
  });
}); 