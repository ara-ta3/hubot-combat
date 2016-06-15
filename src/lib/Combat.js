"use strict"

const NodeQuest = require("node-quest");
const Battle    = require("./Battle.js");
const Spell         = NodeQuest.Spell;
const StatusEffect  = NodeQuest.Effect.StatusEffect;
const StatusValues  = NodeQuest.StatusValues;
const priest = new User(0, "priest", new HitPoint(Infinity, Infinity), new MagicPoint(Infinity, Infinity), new Equipment(new Weapon(0, 0, new HitRate(100))), new Parameter(800, 10), [
        new Spell("raise", 20, [new StatusEffect(StatusValues.DEAD), new CureEffect(100)]),
]);
const UserRepository  = require("./UserRepository.js");
const SpellRepository = require("./SpellRepository.js");
const MessageRepository = require("./MessageRepository.js");

class Combat {
    constructor(userRepository) {
        this.game = new NodeQuest.Game();
        this.userRepository = userRepository;
        this.spellRepository = new SpellRepository();
        this.messageRepository = new MessageRepository();
        this.battle = new Battle(this.game, message);
    }

    loadUsers() {
        const users = this.userRepository.get();
        users.forEach((u) => {
            u.hitPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
            u.magicPoint.on("changed", (data) => {
                this.userRepository.save(this.game.users);
            });
        });
        this.game.setUsers(users);
        return this.game;
    }

    attackToUser(actorName, targetName, callbackOnMessage) {
        const actor = this.game.findUser(actorName);
        if (!actor) {
            return
        }
        const target = this.game.findUser(targetName);
        const result = this.battle.attack(actor, target);
        return callbackOnMessage(result.messages.join("\n"));
    }

    castToUser(actorName, targetName, spellName, callbackOnMessage) {
        const actor  = this.game.findUser(actorName);
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
