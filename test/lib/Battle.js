"use strict"
const assert    = require("power-assert");
const NodeQuest = require("node-quest");
const Battle    = require("../../src/lib/Battle.js");
const messages  = require("../../src/lib/Messages.js");

describe('Battle', () => {
    it("should be success to attack user", () => {
        const u1 = new NodeQuest.User(
                "id1",
                "name1",
                new NodeQuest.HitPoint(1000, 1000),
                new NodeQuest.MagicPoint(100, 100),
                new NodeQuest.Equipment(new NodeQuest.Weapon("empty-hands", 100, 0, new NodeQuest.HitRate(100))),
                new NodeQuest.Parameter(100, 10)
                );
        const u2 = new NodeQuest.User(
                "id2",
                "name2",
                new NodeQuest.HitPoint(1000, 1000),
                new NodeQuest.MagicPoint(100, 100),
                new NodeQuest.Equipment(new NodeQuest.Weapon("empty-hands", 100, 0, new NodeQuest.HitRate(100))),
                new NodeQuest.Parameter(100, 10)
                );
        const game = new NodeQuest.Game();
        game.setUsers([u1, u2]);

        const battle = new Battle(messages);
        const result = battle.attack(u1, u2);
        assert.equal(u2.hitPoint.current, 900);
    })

    it("should be failed to attack user when target is dead", () => {
        const u1 = new NodeQuest.User(
                "id1",
                "name1",
                new NodeQuest.HitPoint(1000, 1000),
                new NodeQuest.MagicPoint(100, 100),
                new NodeQuest.Equipment(new NodeQuest.Weapon("empty-hands", 100, 0, new NodeQuest.HitRate(100))),
                new NodeQuest.Parameter(100, 10)
                );
        const u2 = new NodeQuest.User(
                "id2",
                "name2",
                new NodeQuest.HitPoint(0, 1000),
                new NodeQuest.MagicPoint(100, 100),
                new NodeQuest.Equipment(new NodeQuest.Weapon("empty-hands", 100, 0, new NodeQuest.HitRate(100))),
                new NodeQuest.Parameter(100, 10)
                );
        const game = new NodeQuest.Game();
        game.setUsers([u1, u2]);

        const battle = new Battle(messages);
        const result = battle.attack(u1, u2);

        assert.equal(u2.hitPoint.current, 0);
    })

    it("should be success to cast a spell to user", () => {
        const u1 = new NodeQuest.User(
                "id1",
                "name1",
                new NodeQuest.HitPoint(1000, 1000),
                new NodeQuest.MagicPoint(100, 100),
                new NodeQuest.Equipment(new NodeQuest.Weapon("empty-hands", 100, 0, new NodeQuest.HitRate(100))),
                new NodeQuest.Parameter(100, 0),
                [new NodeQuest.Spell("fire", 10, new NodeQuest.Effect.AttackEffect(5))]
                );
        const u2 = new NodeQuest.User(
                "id2",
                "name2",
                new NodeQuest.HitPoint(1000, 1000),
                new NodeQuest.MagicPoint(100, 100),
                new NodeQuest.Equipment(new NodeQuest.Weapon("empty-hands", 100, 0, new NodeQuest.HitRate(100))),
                new NodeQuest.Parameter(100, 10)
                );
        const game = new NodeQuest.Game();
        game.setUsers([u1, u2]);

        const battle = new Battle(messages);
        const result = battle.cast(u1, u2, "fire");

        assert.equal(u2.hitPoint.current, 895);
    })
});

