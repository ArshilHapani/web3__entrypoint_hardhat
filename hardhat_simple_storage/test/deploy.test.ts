import { ethers } from "hardhat";
import { expect, assert } from "chai";

import { Arshil__factory } from "../typechain-types";

describe("Arshil", function () {
  // describe what to do before each test
  let arshilFactory: Arshil__factory;
  let arshil: Awaited<ReturnType<typeof arshilFactory.deploy>>;
  beforeEach(async function () {
    arshilFactory = await ethers.getContractFactory("Arshil");
    arshil = await arshilFactory.deploy();
  });

  it("Should start with number 0 and name Nami", async function () {
    const user = await arshil.getUser();
    const expectedValues = [20, "Nami"];
    /**
     * We can use assert or expect
     */
    assert.equal(user[0].toString(), expectedValues[0].toString());
    // or
    expect(user[1]).to.equal(expectedValues[1]);
    // assert.equal(user[1].toString(), expectedValues[1].toString());
  });

  it("It should update when we call setUser function", async function () {
    const expectedValue = [10, "Robin"];
    const tx = await arshil.setUser(
      expectedValue[0].toString(),
      expectedValue[1].toString()
    );
    await tx.wait(1); // wait for 1 block confirmation
    const user = await arshil.getUser();
    assert.equal(user[0].toString(), expectedValue[0].toString());
    assert.equal(user[1].toString(), expectedValue[1].toString());
  });

  it("It should addCharacter to the list", async function () {
    const expectedValue = [10, "Robin"];
    const prevLength = (await arshil.getCharacterArray()).length;
    const tx = await arshil.addCharacter(
      expectedValue[0].toString(),
      expectedValue[1].toString()
    );
    await tx.wait(1); // wait for 1 block confirmation
    const newCharacterLength = (await arshil.getCharacterArray()).length;
    const recentValue = (await arshil.getCharacterArray()).at(prevLength) ?? [
      1,
      "Nami",
    ];
    assert.equal(recentValue[0].toString(), expectedValue[0].toString());
    assert.equal(recentValue[1].toString(), expectedValue[1].toString());
    assert.equal(newCharacterLength, prevLength + 1);
  });

  it("It should return character from passed ID", async function () {
    // add character
    const valuesToAdd = [10, "Robin"];
    const tx = await arshil.addCharacter(
      valuesToAdd[0].toString(),
      valuesToAdd[1].toString()
    );
    await tx.wait(1);

    // get character
    const character = await arshil.getCharacterMappings(valuesToAdd[0]);
    assert.equal(character, valuesToAdd[1]);
  });
});
