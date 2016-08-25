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

function parseJsonToSpells(json) {
    return [];
}

class SpellRepositoryOnJson {
    constructor(json) {
        this.spells = parseJsonToSpells(json);
    }

    getAll() {
        return this.spells;
    }

    getByName(name) {
        return this.spells.filter((s) => s.name === name).pop();
    }
}

module.exports = SpellRepositoryOnJson;

