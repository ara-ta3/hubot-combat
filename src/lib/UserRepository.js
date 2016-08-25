"use strict"

const NodeQuest = require("node-quest");
const Equipment = NodeQuest.Equipment;
const Parameter = NodeQuest.Parameter;
const Weapon    = NodeQuest.Weapon;
const User      = NodeQuest.User;
const Status    = NodeQuest.Status;
const HitRate   = NodeQuest.HitRate;
const HitPoint  = NodeQuest.HitPoint;
const MagicPoint= NodeQuest.MagicPoint;
const Critical  = NodeQuest.Critical;

const MAX_HIT_POINT   = Number(process.env.HUBOT_COMBAT_MAX_HIT_POINT) || 3000;
const MAX_MAGIC_POINT = Number(process.env.HUBOT_COMBAT_MAX_MAGIC_POINT) || 1000;
const HUBOT_NODE_QUEST_USERS  = process.env.HUBOT_COMBAT_BRAIN_SAVE_PATH || "HUBOT_COMBAT_USER_DATA";

function factoryUser(id, name, hitPoint, magicPoint) {
    const eq      = new Equipment(new Weapon("bare hands", 200, 12, new HitRate(90), new Critical(0)));
    const p       = new Parameter(100, 50, 100, 10);
    return new User(id, name, hitPoint, magicPoint, eq, p);
}

class UserRepositoryOnHubot {
    constructor(brain, users) {
        this.brain = brain;
        this.users = users || {};
    }

    save(users) {
        const us = {};
        users.forEach((u) => {
            us[u.id] = {
                hitPoint: u.hitPoint.current,
                magicPoint: u.magicPoint.current
            }
        });
        this.brain.set(HUBOT_NODE_QUEST_USERS, us);
    }

    get() {
        const savedUsers  = this.brain.get(HUBOT_NODE_QUEST_USERS) || {};
        return Object.keys(this.users).map((id) => {
            const user  = this.users[id];
            const saved = savedUsers[id];
            const hitPoint    = (saved && !isNaN(saved.hitPoint)) ? saved.hitPoint : MAX_HIT_POINT;
            const magicPoint    = (saved && !isNaN(saved.magicPoint)) ? saved.magicPoint : MAX_MAGIC_POINT;
            return factoryUser(
                    user.id,
                    user.name,
                    new HitPoint(hitPoint, MAX_HIT_POINT),
                    new MagicPoint(magicPoint, MAX_MAGIC_POINT)
                    );
        })
    }
}

module.exports = UserRepositoryOnHubot;

