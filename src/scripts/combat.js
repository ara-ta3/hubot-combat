// Description
//  Fight with other users.
// Commands:
//  attack {other user} - attack to the user
//  status {user} - confirm the status of the user
//  pray - pray to god to come back to life. 

const Combat = require("../lib/Combat.js");
const UserRepository = require("../lib/UserRepository.js");
const SpellRepository = require("../lib/SpellRepository.js");
const messages = require("../lib/Messages.js");

module.exports = (robot) => {
    const combat = new Combat(
            new UserRepository(
                robot.brain,
                robot.adapter.client ? robot.adapter.client.users : {}
                ),
            new SpellRepository(null), // TODO getting spells from json
            messages
            );

    robot.brain.once("loaded", (data) => combat.loadUsers());

    robot.hear(/^attack (.+)/i, (res) => {
        combat.attackToUser(
            res.message.user.name.replace(/@/g, ""),
            res.match[1].replace(/@/g, ""),
            (m) => res.send(m)
        );
    });

    robot.hear(/^status (.+)/i, (res) => {
        combat.statusOfUser(
            res.match[1].replace(/@/g, ""),
            (m) => res.send(m)
        );
    });

    robot.hear(/^pray$/i, (res) => {
        combat.prayToGod(
            res.message.user.name.replace(/@/g, ""),
            (m) => res.send(m)
        );
    });

    robot.hear(/(.+)/, (res) => {
        const messages = (res.message.text || "").split(" ");
        (messages.length >= 2) && combat.castToUser(
                res.message.user.name.replace(/@/g, ""),
                messages[1].replace(/@/g, ""),
                messages[0],
                (m) => res.send(m)
                );
    });

}
