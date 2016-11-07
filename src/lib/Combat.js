"use strict"

const NodeQuest = require("node-quest");
const Battle    = require("./Battle.js");
const User          = NodeQuest.User;
const Spell         = NodeQuest.Spell;
const HitPoint      = NodeQuest.HitPoint;
const MagicPoint    = NodeQuest.MagicPoint;
const Equipment     = NodeQuest.Equipment;
const Parameter     = NodeQuest.Parameter;
const Weapon        = NodeQuest.Weapon;
const HitRate       = NodeQuest.HitRate;
const CureEffect    = NodeQuest.Effect.CureEffect;
const StatusEffect  = NodeQuest.Effect.StatusEffect;
const StatusValues  = NodeQuest.StatusValues;
const priest = new User(
    0,
    "priest",
    new HitPoint(Infinity, Infinity),
    new MagicPoint(Infinity, Infinity),
    new Equipment(new Weapon(0, 0, new HitRate(100))),
    new Parameter(800, 10), [
        new Spell("raise", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)]),
    ]
);

class Combat {
    constructor(userRepository, spellRepository, messages) {
        this.game = new NodeQuest.Game();
        this.userRepository = userRepository;
        this.spellRepository = spellRepository;
        this.messageRepository = messageRepository;
        this.battle = new Battle(this.game, messages);
    }

    loadUsers() {
        const users = this.userRepository.get();
        const spells = this.spellRepository.getAll();
        users.forEach((u) => {
            u.spells = spells;

            u.hitPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
            u.magicPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
        });
        this.game.setUsers(users.concat([priest]));
        return this.game;
    }

    attackToUser(actorName, targetName, callbackOnMessage) {
        const actor = this.game.findUser(actorName);
        if (!actor) {
            this.loadUsers();
            return;
        }
        const target = this.game.findUser(targetName);
        const result = this.battle.attack(actor, target);
        return callbackOnMessage(result.messages.join("\n"));
    }

    castToUser(actorName, targetName, spellName, callbackOnMessage) {
        const actor  = this.game.findUser(actorName);
        if (!actor) {
            this.loadUsers();
            return;
        }
        const target = this.game.findUser(targetName);
        const result = this.battle.cast(actor, target, spellName);
        return callbackOnMessage(result.messages.join("\n"));
    }

    statusOfUser(targetName, callbackOnMessage) {
        const target = this.game.findUser(targetName);
        const message = target ?
            this.messageRepository.getStatus(target):
            this.messageRepository.getNoTarget(target);
        return callbackOnMessage(message);
    }

    prayToGod(actorName, callbackOnMessage) {
        const result = this.battle.cast(priest, this.game.findUser(actorName), "raise");
        return callbackOnMessage(result.messages.join("\n"));
    }
}

module.exports = Combat;
