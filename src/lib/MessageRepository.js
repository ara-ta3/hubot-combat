"use strict"

function macroApply(message, map) {
    return message.replace(/\{(\w+)\}/g, (m, k) => map[k]);
}

function actorMacroApply(message, actor) {
    return message.replace(/{actor\.name}/g, actor.name);
}

function targetMacroApply(message, target) {
    return message.replace(/{target\.name}/g, target.name)
        .replace(/{target\.hp}/g, target.hitPoint.current)
        .replace(/{target\.mp}/g, target.magicPoint.current)
        .replace(/{target\.maxHp}/g, target.hitPoint.max)
        .replace(/{target\.maxMp}/g, target.magicPoint.max)
        .replace(/{target\.spells}/g, target.spells.map((s) => s.name).join(","));
}

function damagePointMacroApply(message, point) {
    return message.replace(/{point}/g, point);
}

function spellMacroApply(message, spellName) {
    return message.replace(/{spell}/g, spellName);
}

class MessageRepositoryOnJson {
    constructor(json) {
        this.messages = this.load();
    }

    load() {
        let message = {
            actor: {
                dead: "{actor.name} is dead so cannot act.",
                nomagicpoint: "{actor.name} don't have enough magic point.",
                noeffect: "Nothing happended"
            },
            target: {
                notarget: "No targets",
                damaged: "{target.name} damaged {point}!! Current HitPoint: {target.hp} / {target.maxHp}",
                dead: "{target.name} is dead"
            },
            attack: {
                default: "{actor.name} attacks {target.name}!!!",
                miss: "{actor.name} attacks but missed!!!",
                dead: "{target.name} died ..."
            },
            spell: {
                default: "{actor.name} cast {spell}!"
            },
            cure: {
                default: "{target.name} is cured. Current HitPoint: {target.hp} / {target.maxHp}",
            },
            raise: {
                default: "{target.name} returns to life.",
            },
            status: {
                default: "Current HitPoint: {target.hp}\nCurrent MagicPoint: {target.mp}\nAvailable Magics: {target.spells}"
            }
        };
        return message;
    }

    getStatus(target) {
        return targetMacroApply(this.messages.status.default, target);
    }

    getNoTarget(target) {
        return targetMacroApply(this.messages.target.notarget, target);
    }

    getTargetDead(target) {
        return targetMacroApply(this.messages.target.dead, target);
    }

    getActorDead(actor) {
        return actorMacroApply(this.messages.actor.dead, actor);
    }

    getAttack(actor, target, point) {
        return damagePointMacroApply(
                targetMacroApply(
                    actorMacroApply([
                        this.messages.attack.default,
                        this.messages.status.default].join("\n"), 
                        actor
                        ), 
                    target
                    ),
                point
                );
    }

    getAttackMiss(actor) {
        return actorMacroApply(this.messages.attack.miss, actor);
    }

    getAttackDead(target) {
        return targetMacroApply(this.messages.attack.dead, target);
    }

    getNoMagicPoint(actor) {
        return actorMacroApply(`${this.messages.actor.nomagicpoint}\n${this.messages.status.default}`, actor);
    }

    getActorDead(actor) {
        return actorMacroApply(this.messages.actor.dead, actor);
    }

    getSpellCast(actor, spellName) {
        return spellMacroApply(
                actorMacroApply(
                    this.messages.spell.default,
                    actor
                    ),
                spellName
                );
    }

    getTargetDamaged(target, damagePoint) {
        return damagePointMacroApply(
                targetMacroApply(
                    this.messages.target.damaged,
                    target
                    ),
                damagePoint
                );
    }

    getRaise(target) {
        return targetMacroApply(this.messages.target.raise.default, target);
    }

    getActorNoEffect(actor) {
        return actorMacroApply(this.messages.actor.noeffect, actor);
    }

    getCure(target) {
        return targetMacroApply(this.messages.cure.default, target);
    }
}

module.exports = MessageRepositoryOnJson;

