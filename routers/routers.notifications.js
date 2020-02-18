const express = require("express");
const { pool } = require("../db/pool");
const router = express.Router();
const { Expo } = require("expo-server-sdk");

router.get("/", (req, res) => {
    pool.connect().then(client => {
        client
            .query("SELECT * FROM notification")
            .then(data => {
                console.log(data.rows);
                res.render("notifications/index", { notifications: data.rows });
            })
            .catch(err => console.log(err))
            .finally(() => client.release());
    });
});

router.post("/", (req, res) => {
    pool.connect()
        .then(client => {
            client
                .query({
                    text:
                        "INSERT INTO notification(noti_uid, title, description) values (uuid_generate_v4(), $1, $2) RETURNING *",
                    values: [req.body.title, req.body.description]
                })
                .then(data => res.status(200).redirect("/notifications"))
                .catch(err => {
                    console.log(err);
                    res.status(500).send(err);
                })
                .finally(() => client.release());
        })
        .catch(err => res.status(400).send("error"));
});

router.post("/:id/push", (req, res) => {
    pool.connect().then(client => {
        client
            .query({
                text: "SELECT * FROM notification WHERE noti_uid=$1",
                values: [req.params["id"]]
            })
            .then(data => {
                const noti = data.rows[0];
                client
                    .query({
                        text:
                            "UPDATE notification SET status=1 WHERE noti_uid=$1",
                        values: [req.params["id"]]
                    })
                    .then(() => {
                        client
                            .query({
                                text: "SELECT * FROM users"
                            })
                            .then(data => {
                                // Create a new Expo SDK client
                                let expo = new Expo();

                                // Create the messages that you want to send to clents
                                const messages = [];
                                const pushTokens = [];
                                for (let user of data.rows) {
                                    pushTokens.push(user.push_token);
                                }
                                for (let pushToken of pushTokens) {
                                    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

                                    // Check that all your push tokens appear to be valid Expo push tokens
                                    if (!Expo.isExpoPushToken(pushToken)) {
                                        console.error(
                                            `Push token ${pushToken} is not a valid Expo push token`
                                        );
                                        continue;
                                    }

                                    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications)
                                    messages.push({
                                        to: pushToken,
                                        sound: "default",
                                        title: noti.title,
                                        body: noti.description,
                                        data: { withSome: "data" }
                                    });
                                }
                                let chunks = expo.chunkPushNotifications(
                                    messages
                                );
                                let tickets = [];
                                (async () => {
                                    // Send the chunks to the Expo push notification service. There are
                                    // different strategies you could use. A simple one is to send one chunk at a
                                    // time, which nicely spreads the load out over time:
                                    for (let chunk of chunks) {
                                        try {
                                            let ticketChunk = await expo.sendPushNotificationsAsync(
                                                chunk
                                            );
                                            console.log(ticketChunk);
                                            tickets.push(...ticketChunk);
                                            // NOTE: If a ticket contains an error code in ticket.details.error, you
                                            // must handle it appropriately. The error codes are listed in the Expo
                                            // documentation:
                                            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                                            res.send("success");
                                        } catch (error) {
                                            console.error(error);
                                            res.send("error");
                                        }
                                    }
                                })();
                            });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("wrong input");
            })
            .finally(() => client.release());
    });
});

router.delete("/:id", (req, res) => {
    pool.connect().then(client => {
        client
            .query({
                text: "DELETE FROM notification WHERE noti_uid=$1",
                values: [req.params["id"]]
            })
            .then(() => res.status(200).send("success"))
            .catch(err => res.send(400).send("error"))
            .finally(() => client.release());
    });
});

module.exports = router;
