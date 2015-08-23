var thingsData = {
    'rock' : {
        "id" : 'rock',
        "damage" : 1,
        "trajectory" : "lob",
        "cost" : 0,
        "cooldown" : 120,
        "speed" : {"x" : 3, "y" : 4.5},
        "properties" : ["piercing",],
        "offset" : {"x" : 10, "y" : 150},

    },
    'eggplant' : {
        "id" : 'eggplant',
        "damage" : 3,
        "trajectory" : "lob",
        "cost" : 0,
        "cooldown" : 120,
        "speed" : {"x" : 1, "y" : 7.5},
        "properties" : ["rare","knockback","piercing"],
        "offset" : {"x" : 10, "y" : 150},

    },
    'caddie' : {
        "id" : "caddie",
        "damage" : 1,
        "trajectory" : "groundstraight",
        "cost" : 0,
        "speed" : {"x" : 4, "y" : 0},
        "properties" : ["piercing","knockback"],
        "offset" : {"x" : -10, "y" : 200},

    },
    'molotov' : {
        "id" : "molotov",
        "damage" : 1,
        "trajectory" : "lob",
        "cost" : 0,
        "speed" : {"x" : 2.5, "y" : 6},
        "properties" : ["fire","rare","explosive"],
        "offset" : {"x" : 20, "y" : 80},

    },
    'duck' : {
        "id" : "duck",
        "damage" : 1,
        "trajectory" : "lob",
        "cost" : 0,
        "speed" : {"x" : 2, "y" : 3.5},
        "properties" : ["bounce"],
        "offset" : {"x" : 20, "y" : 80},

    },
    'paperplane' : {
        "id" : "paperplane",
        "damage" : 2,
        "trajectory" : "glide",
        "cost" : 0,
        "speed" : {"x" : 4, "y" : 9},
        "properties" : ["piercing",],
        "offset" : {"x" : 20, "y" : 60},

    },
    'caddie_TNT' : {
        "id" : "caddie_TNT",
        "damage" : 2,
        "trajectory" : "groundstraight",
        "cost" : 0,
        "speed" : {"x" : 2.5, "y" : 0},
        "properties" : ["rare","explosive","knockback"],
        "offset" : {"x" : -10, "y" : 200},

    },
};
