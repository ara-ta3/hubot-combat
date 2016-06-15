"use strict"

class MessageRepositoryOnJson {
    constructor() {
        this.jsonFilePath = env.process.HUBOT_COMBAT_MESSAGES;
        this.messages = this.load();
    }

    load() {
        const json = require(this.jsonFilePath);
        let message = {
            actor: {
                notarget: "",
                dead: "",
                nomagicpoint: "",
                noeffect: ""
            },
            target: {
                damaged: "",
                dead: ""
            },
            attack: {
                default: "",
                miss: "",
                dead: ""
            },
            spell: {
                default: ""
            },
            cure: {
                default: "",
            },
            raise: {
                default: "",
            },
            status: {
                default: ""
            }
        };
    }
}

module.exports = MessageRepositoryOnJson;

