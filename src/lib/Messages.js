"use strict";

const messages = {
    actor: {
        dead: "{actor} is dead so cannot act.",
        nomagicpoint: "{actor} don't have enough magic point.",
        noeffect: "Nothing happended"
    },
    target: {
        notarget: "No targets",
        damaged: "{target} damaged {point}!! Current HitPoint: {hp} / {maxHP}",
        dead: "{target} is dead"
    },
    attack: {
        default: "{actor} attacks {target}!!!",
        miss: "{actor} attacks but missed!!!",
        dead: "{target} died ..."
    },
    spell: {
        default: "{actor} cast {spell}!"
    },
    cure: {
        default: "{target} is cured. Current HitPoint: {hp} / {maxHP}",
    },
    raise: {
        default: "{target} returns to life.",
    },
    status: {
        default: "Current HitPoint: {hp}\nCurrent MagicPoint: {mp}\nAvailable Magics: {spells}"
    }
}

module.exports = messages;
