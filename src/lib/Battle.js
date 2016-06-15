"use strict"

const NodeQuest  = require("node-quest");
const UserStates = NodeQuest.UserStates;

class Battle {
    constructor(game, messageRepository) {
        this.game = game;
        this.messageRepository = messageRepository;
    }

    attack(actor, target) {
        if (!target) {
            return {
                messages: [this.messageRepository.getNoTarget(actor)],
                result: null
            }
        }
        const result = actor.attack(target);
        let messages = [];
        switch (result) {
            case UserStates.TargetDead:
                messages.push(this.messageRepository.getTargetDead(target));
                break;
            case UserStates.ActorDead:
                messages.push(this.messageRepository.getActorDead(actor));
                break;
            default:
                const hit   = result.attack.hit;
                const point = result.attack.value;
                hit ?
                    messages.push(this.messageRepository.getAttack(actor, target, point)):
                    messages.push(this.messageRepository.getAttackMiss(target));
                target.isDead() && messages.push(this.messageRepository.getAttackDead(target));
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
                messages: [this.messageRepository.getNoTarget(actor)],
                result: null
            };
        }

        const result    = actor.cast(spellName, target);
        let messages = [];
        switch (result) {
            case UserStates.NoTargetSpell:
                break;
            case UserStates.NotEnoughMagicPoint:
                messages.push(this.messageRepository.getNoMagicPoint(actor));
                break;
            case UserStates.TargetDead:
                messages.push(this.messageRepository.getTargetDead(target));
                break
            case UserStates.ActorDead:
                    messages.push(this.messageRepository.getActorDead(actor));
                    break;
            default:
                    messages.push(this.messageRepository.getSpellCast(actor, spellName));
                    if( result.effects.attack !== null ) {
                        messages.push(this.messageRepository.getTargetDamaged(result.target, result.effects.attack));
                        result.target.isDead() && messages.push(this.messageRepository.getAttackDead(result.target));
                    }
                    const statusEffectResult = result.effects.status.filter((e) => e.effective)
                        if(result.effects.status.length > 0) {
                            (statusEffectResult.length > 0) ?
                                messages.push(this.messageRepository.getRaise(result.target)):
                                messages.push(this.messageRepository.getActorNoEffect(result.actor));
                        } else if( result.effects.cure !== null) {
                            messages.push(this.messageRepository.getCure(result.target));
                        }
        }
        return {
            messages: messages,
            result: result
        };
    }
}

module.exports = Battle;
