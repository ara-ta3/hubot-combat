"use strict"

const formatter = require("string-template");

class MessageFormatter {
    format(format, actor, target, point, spell, hp, maxHP, mp, maxMP, spells) {
        return formatter(format, {
            "actor": actor,
            "target": target,
            "point": point,
            "spell": spell,
            "hp": hp,
            "maxHP": maxHP,
            "mp": mp,
            "maxMP": maxMP,
            "spells": spells
        });
    }
}

module.exports = MessageFormatter;
