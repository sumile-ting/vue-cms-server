exports.init = function(){
    var configs = require('../config.json');

    var redis = require("redis"),
        redisClient = redis.createClient(configs.redis);

    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });

    return redisClient;
};