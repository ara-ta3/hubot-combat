"use strict"

const NodeQuest  = require("node-quest");
const UserStates = NodeQuest.UserStates;
const MessageFormatter  = require("./MessageFormatter");
const formatter  = new MessageFormatter();

class Battle {
    constructor(messages) {
        this.messages = messages;
    }

    attack(actor, target) {
        if (!target) {
            return {
                messages: [formatter.format(this.messages.target.notarget, actor.name, target.name)],
                result: null
            }
        }
        const result = actor.attack(target);
        let messages = [];
        switch (result) {
            case UserStates.TargetDead:
                messages.push(formatter.format(this.messages.target.dead, actor.name, target.name));
                break;
            case UserStates.ActorDead:
                messages.push(formatter.format(this.messages.actor.dead, actor.name, target.name));
                break;
            default:
                const hit   = result.attack.hit;
                const point = result.attack.value;
                messages.push(formatter.format(this.messages.attack.default, actor.name, target.name));
                hit ?
                    messages.push(formatter.format(this.messages.target.damaged, actor.name, target.name, point, null, target.hitPoint.current, target.hitPoint.max)):
                    messages.push(formatter.format(this.messages.attack.miss, actor.name, target.name, point, null, target.hitPoint.current, target.hitPoint.max));
                target.isDead() && messages.push(formatter.format(this.messages.attack.dead, actor.name, target.name));
                break;
        }
        return {
            messages: messages,
            result: result
        };
    }

    cast(actor, target, spellName) {
        if (actor.spells.filter((s) => s.name === spellName).length <= 0) {
            return {
                messages: [],
                result: null
            };
        } else if (!target) {
            return {
                messages: [formatter.format(this.messages.target.notarget, actor.name, target.name)],
                result: null
            };
        }

        const result    = actor.cast(spellName, target);
        let messages = [];
        switch (result) {
            case UserStates.NoTargetSpell:
                break;
            case UserStates.NotEnoughMagicPoint:
                messages.push(formatter.format(this.messages.actor.nomagicpoint));
                break;
            case UserStates.TargetDead:
                messages.push(formatter.format(this.messages.target.dead, actor.name, target.name));
                break;
            case UserStates.ActorDead:
                messages.push(formatter.format(this.messages.actor.dead, actor.name, target.name));
                break;
            default:
                messages.push(formatter.format(this.messages.spell.default, actor.name, null, null, spellName));
                if( result.effects.attack !== null ) {
                    messages.push(formatter.format(this.messages.target.damaged, actor.name, target.name, result.effects.attack, null, target.hitPoint.current, target.hitPoint.max));
                        result.target.isDead() && messages.push(formatter.format(this.messages.attack.dead, actor.name, target.name));
                }
                const statusEffectResult = result.effects.status.filter((e) => e.effective)
                if(result.effects.status.length > 0) {
                    (statusEffectResult.length > 0) ?
                        messages.push(formatter.format(this.messages.raise.default, actor.name, result.target.name)):
                        messages.push(formatter.format(this.messages.acrot.noeffect, result.actor.name));
                } else if( result.effects.cure !== null) {
                    messages.push(formatter.format(this.messages.cure.default, actor.name, target.name, point, null, target.hitPoint.current, target.hitPoint.max));
                }
        }
        return {
            messages: messages,
            result: result
        };
    }
}

module.exports = Battle;
